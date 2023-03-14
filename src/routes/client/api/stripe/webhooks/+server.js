import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import { dev } from '$app/environment';
import { sendEmail } from '../../../emailing';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { got } from 'got';
import { stripeConfig } from '../../../../../config';
import { load } from '../../../+layout.server';

export async function POST({ request }) {
	//console.log('received webhook event');

	const _rawBody = await request.arrayBuffer();
	const payload = toBuffer(_rawBody);

	// run server side firebase connections before proceeding with webhook handling.
	await load();

	const stripe = Stripe(stripeConfig.privateKey);
	const firestoreCollection = getFirestore().collection('/client-portal-user');
	const storageBucket = getStorage().bucket();

	const sig = request.headers.get('stripe-signature');

	let event;

	try {
		event = stripe.webhooks.constructEvent(payload, sig, stripeConfig.webhookSecret);
	} catch (err) {
		let error_reponse = new Response('Webhook Error: ' + err.message, { status: 400 });
		console.log(error_reponse);
		return error_reponse;
	}

	// Handle the event
	switch (event.type) {
		case 'quote.created':
			const createdQuoteObject = event.data.object;
			let createdQuoteId = createdQuoteObject.id;
			let createdQuoteCustomerId = createdQuoteObject.customer;

			// to be filled from firebase query
			let userEmail = '';

			//build a shorthand name for Quote file/object
			let draftQuoteName = 'Draft_Quote_' + createdQuoteId.slice(-8, -1);

			/** Generate firebase event and update subscription/services status & message **/
			const createdQuoteQuery = await firestoreCollection
				.where('cuid', '==', createdQuoteCustomerId)
				.get();

			const createdQuoteTime = Timestamp.now();

			createdQuoteQuery.forEach(async (userDoc) => {
				let userObject = userDoc.data();

				userEmail = userObject.email;

				let updateDoc = await userDoc.ref.update({
					'service_log.events': FieldValue.arrayUnion({
						time: createdQuoteTime,
						description: draftQuoteName + ' was generated for internal review.',
						type: 'billing'
					}),
					'subscription.status': 'Draft Quote Generated',
					'subscription.message':
						'Thanks for filling out the services form. We will be contacting you soon to get more details.'
				});
			});

			/** send email to development as notification **/
			let createdQuoteEmail = await sendEmail('notify_dev', {
				recipient: 'development@southtexas.software',
				title: 'A quote has been created',
				account: userEmail,
				details: 'Created Quote: ' + createdQuoteId
			});

			break;

		case 'quote.finalized':
			const finalizedQuote = event.data.object;

			let finalizedQuoteId = finalizedQuote.id;
			let finalizedQuoteCustomer = finalizedQuote.customer;

			let finalQuoteName = 'Quote_' + finalizedQuoteId.slice(-8, -1);

			/** pipe the new document from stripe to firebase storage **/

			const finalizedQuoteFilename =
				'client-portal-users/' + finalizedQuoteCustomer + '/' + finalQuoteName + '.pdf';
			const finalizedQuoteReference = storageBucket.file(finalizedQuoteFilename);

			const fqWriter = finalizedQuoteReference.createWriteStream({
				metadata: {
					contentType: 'application/pdf'
				}
			});

			//get readable stream of new pdf from stripe
			const fqPDF = await stripe.quotes.pdf(finalizedQuoteId);

			await new Promise((resolve) => {
				fqPDF.pipe(fqWriter);
				fqPDF.on('end', () => resolve());
			});

			/** finished piping file to firebase storage **/

			/** Add event to this users event log **/
			const finalizedQuoteQuery = await firestoreCollection
				.where('cuid', '==', finalizedQuoteCustomer)
				.get();
			const finalizedQuoteTimeFirestore = Timestamp.now();

			const finalizedQuoteUnixTimestamp = getUnixTimestamp();

			finalizedQuoteQuery.forEach(async (userDoc) => {
				let updateDoc = await userDoc.ref.update({
					'service_log.events': FieldValue.arrayUnion({
						time: finalizedQuoteTimeFirestore,
						description: finalQuoteName + ' was finalized.',
						type: 'billing'
					}),
					'subscription.status': 'New Quote Finalized',
					'subscription.message':
						'We finalized your quote. An email was sent with your quote link, or you can access it from the link above. Thanks!',
					'billing.open_documents': FieldValue.arrayUnion({
						type: 'quote',
						id: finalizedQuoteId
					}),
					'billing.documents': FieldValue.arrayUnion({
						type: 'quote',
						id: finalizedQuoteId,
						filename: finalQuoteName + '.pdf',
						created: finalizedQuoteUnixTimestamp
					})
				});
			});

			/** Generate email and custom link for customer **/
			const customer = await stripe.customers.retrieve(finalizedQuoteCustomer);
			// build unique link for them to follow
			let quoteLink;
			if (dev) {
				quoteLink = 'http://192.168.1.25:5173/client/portal/quote/' + finalizedQuoteId;
			} else {
				quoteLink = 'https://www.southtexas.software/client/portal/quote/' + finalizedQuoteId;
			}
			// send email to associated customer with quote review link, etc
			let finalizedQuoteEmail = await sendEmail('finalize-quote', {
				recipient: customer.email, //email pulled from stripe = billing.email
				link: quoteLink
			});

			break;

		case 'quote.accepted':
			const acceptedQuote = event.data.object;

			let acceptedQuoteId = acceptedQuote.id;
			let acceptedQuoteCustomer = acceptedQuote.customer;
			let acceptedQuoteInvoice = acceptedQuote.invoice;
			let customerEmail = '';

			let acceptedQuoteName = 'Accepted_Quote_' + acceptedQuoteId.slice(-8, -1);

			/** pipe the new document from stripe to firebase storage **/

			const acceptedQuoteFilename =
				'client-portal-users/' + acceptedQuoteCustomer + '/' + acceptedQuoteName + '.pdf';
			const acceptedQuoteReference = storageBucket.file(acceptedQuoteFilename);

			const aqWriter = acceptedQuoteReference.createWriteStream({
				metadata: {
					contentType: 'application/pdf'
				}
			});

			//get readable stream of new pdf from stripe
			const aqPDF = await stripe.quotes.pdf(acceptedQuoteId);

			await new Promise((resolve) => {
				aqPDF.pipe(aqWriter);
				aqPDF.on('end', () => resolve());
			});

			/** Add event to this users event log **/
			const acceptedQuoteQuery = await firestoreCollection
				.where('cuid', '==', acceptedQuoteCustomer)
				.get();
			const acceptedQuoteTime = Timestamp.now();
			const acceptedQuoteUnixTimestamp = getUnixTimestamp();
			acceptedQuoteQuery.forEach(async (userDoc) => {
				let userObject = userDoc.data();
				customerEmail = userObject.billing.email; // has to go to the billing email
				let updateDoc = await userDoc.ref.update({
					'service_log.events': FieldValue.arrayUnion({
						time: acceptedQuoteTime,
						description: acceptedQuoteName + ' added to documents',
						type: 'billing'
					}),
					'subscription.status': 'Quote Accepted',
					'subscription.message':
						'The work begins! We will notify you when the work scope is complete and ready to be invoiced. Thank you.',
					'billing.open_documents': FieldValue.arrayRemove({
						type: 'quote',
						id: acceptedQuoteId
					}),
					'billing.documents': FieldValue.arrayUnion({
						type: 'quote',
						id: acceptedQuoteId,
						filename: acceptedQuoteName + '.pdf',
						created: acceptedQuoteUnixTimestamp
					})
				});
			});

			/** send email to development as notification **/
			let acceptedQuoteEmail = await sendEmail('notify_dev', {
				recipient: 'development@southtexas.software',
				title: 'A quote has been accepted',
				account: customerEmail,
				details: 'Accepted Quote: ' + acceptedQuoteId
			});

			/** set flag to halt invoice at draft stage until prompted **/
			let createdInvoice = await stripe.invoices.update(acceptedQuoteInvoice, {
				auto_advance: false,
				collection_method: 'send_invoice',
				days_until_due: 3
			});

			break;

		case 'invoice.finalized':
			const finalizedInvoice = event.data.object;

			let finalizedInvoiceId = finalizedInvoice.id;
			let finalizedInvoiceCustomer = finalizedInvoice.customer;
			let finalizedInvoicePdf = finalizedInvoice.invoice_pdf;
			let invoicedCustomerEmail = '';

			let finalizedInvoiceName = 'Invoice_' + finalizedInvoiceId.slice(-8, -1);

			/** Transfer file from stripe to google cloud **/
			const finalizedInvoiceFilename =
				'client-portal-users/' + finalizedInvoiceCustomer + '/' + finalizedInvoiceName + '.pdf';
			const finalizedInvoiceReference = storageBucket.file(finalizedInvoiceFilename);

			const fiWriter = finalizedInvoiceReference.createWriteStream({
				metadata: {
					contentType: 'application/pdf'
				}
			});

			await new Promise((resolve) => {
				got.stream(finalizedInvoicePdf).pipe(fiWriter);
				fiWriter.on('finish', () => resolve());
			});
			/** Finished transferring file ... **/

			/** Generate email and custom link for customer **/
			const invoicedCustomer = await stripe.customers.retrieve(finalizedInvoiceCustomer);
			// build unique link for them to follow
			let invoiceLink;
			if (dev) {
				invoiceLink = 'http://192.168.1.25:5173/client/portal/invoice/' + finalizedInvoiceId;
			} else {
				invoiceLink = 'https://www.southtexas.software/client/portal/invoice/' + finalizedInvoiceId;
			}
			// send email to associated customer with quote review link, etc
			let invoiceEmail = await sendEmail('pay-invoice', {
				recipient: invoicedCustomer.email, // email pulled from stripe
				link: invoiceLink
			});

			/** Update firebase to reflect changes in the app **/
			const finalizedInvoiceQuery = await firestoreCollection
				.where('cuid', '==', finalizedInvoiceCustomer)
				.get();
			const finalizedInvoiceTime = Timestamp.now();
			const finalizedInvoiceUnixTimestamp = getUnixTimestamp();
			finalizedInvoiceQuery.forEach(async (userDoc) => {
				let updateDoc = await userDoc.ref.update({
					'service_log.events': FieldValue.arrayUnion({
						time: finalizedInvoiceTime,
						description: finalizedInvoiceName + ' was finalized.',
						type: 'billing'
					}),
					'subscription.status': 'Invoice Finalized',
					'subscription.message': 'The job is done! Please pay the invoice using the link above.',
					'billing.open_documents': FieldValue.arrayUnion({
						type: 'invoice',
						id: finalizedInvoiceId
					}),
					'billing.documents': FieldValue.arrayUnion({
						type: 'invoice',
						id: finalizedInvoiceId,
						filename: finalizedInvoiceName + '.pdf',
						created: finalizedInvoiceUnixTimestamp
					})
				});
			});

			break;

		case 'invoice.payment_succeeded':
			const paidInvoice = event.data.object;

			let paidInvoiceId = paidInvoice.id;
			let paidInvoiceCustomer = paidInvoice.customer;
			let paidInvoicePdf = paidInvoice.invoice_pdf;
			let paidInvoiceUserEmail = await stripe.customers.retrieve(paidInvoiceCustomer).email;

			/** Get the receipt url and pipe it to firebase **/
			let invoiceChargeId = paidInvoice.charge;
			let chargeObject = await stripe.charges.retrieve(invoiceChargeId);
			let chargePageUrl = chargeObject.receipt_url;
			let parseArray = chargePageUrl.split('?');
			let receipt_url = parseArray[0] + '/pdf?' + parseArray[1];

			let paidInvoiceName = 'Invoice_' + paidInvoiceId.slice(-8, -1);
			let receiptName = 'Receipt_' + paidInvoiceId.slice(-8, -1);

			const receiptFilename =
				'client-portal-users/' + paidInvoiceCustomer + '/' + receiptName + '.pdf';
			const receiptReference = storageBucket.file(receiptFilename);

			const rWriter = receiptReference.createWriteStream({
				metadata: {
					contentType: 'application/pdf'
				}
			});

			await new Promise((resolve) => {
				got.stream(receipt_url).pipe(rWriter);
				rWriter.on('finish', () => resolve());
			});

			let userSubscription = {
				status: 'Active',
				id: '',
				monthly: '',
				options: '',
				plan: '',
				renewal: '',
				message: ''
			};

			// check for a subscription and if so, add that information into firebase.
			if (paidInvoice.subscription != null) {
				userSubscription.id = paidInvoice.subscription;

				let subscriptionObject = await stripe.subscriptions.retrieve(paidInvoice.subscription);

				userSubscription.monthly = subscriptionObject.plan.amount / 100;
				userSubscription.renewal = subscriptionObject.billing_cycle_anchor;

				let productId = subscriptionObject.plan.product;
				let productObject = await stripe.products.retrieve(productId);

				userSubscription.plan = productObject.name;
				userSubscription.options = productObject.description;
			}

			/** Update firebase to reflect changes in the app **/
			const paidInvoiceQuery = await firestoreCollection
				.where('cuid', '==', paidInvoiceCustomer)
				.get();
			const paidInvoiceTime = Timestamp.now();
			const receiptUnixTimestamp = getUnixTimestamp();
			paidInvoiceQuery.forEach(async (userDoc) => {
				let updateDoc = await userDoc.ref.update({
					'service_log.events': FieldValue.arrayUnion(
						{
							time: paidInvoiceTime,
							description: paidInvoiceName + ' payment succeeded.',
							type: 'billing'
						},
						{
							time: paidInvoiceTime,
							description: receiptName + ' added to documents.',
							type: 'billing'
						}
					),
					subscription: userSubscription,
					'billing.status': 'Active',
					'billing.open_documents': FieldValue.arrayRemove({
						type: 'invoice',
						id: paidInvoiceId
					}),
					'billing.latest_charge': {
						status: 'succeeded',
						receiptId: receiptName,
						invoiceId: paidInvoiceId,
						chargeId: invoiceChargeId
					},
					'billing.documents': FieldValue.arrayUnion({
						type: 'receipt',
						id: invoiceChargeId,
						filename: receiptName + '.pdf',
						created: receiptUnixTimestamp
					})
				});
			});

			/** send out emails with links to view documents and notify **/
			/** send email to development as notification **/
			let paidInvoiceDev = await sendEmail('notify_dev', {
				recipient: 'development@southtexas.software',
				title: 'An invoice has been paid',
				account: paidInvoiceUserEmail, // pulled from stripe, so email is correct
				details: 'Invoice Paid: ' + paidInvoiceId
			});

			let portalReceiptLink = 'https://southtexas.software/client/portal/receipt/' + receiptName;

			let paidInvoiceCustomerEmail = await sendEmail('receipt', {
				recipient: paidInvoiceUserEmail,
				link: portalReceiptLink
			});

			break;

		case 'quote.canceled':
			const canceledQuoteObject = event.data.object;
			let canceledQuoteId = canceledQuoteObject.id;
			let canceledQuoteCustomerId = canceledQuoteObject.customer;

			const canceledQuoteQuery = await firestoreCollection
				.where('cuid', '==', canceledQuoteCustomerId)
				.get();

			canceledQuoteQuery.forEach(async (userDoc) => {
				let userObject = userDoc.data();

				let openDocuments = userObject.billing.open_documents;

				const canceledQuoteTime = Timestamp.now();

				for (let document of openDocuments) {
					if (document.id == canceledQuoteId) {
						// get document name from documents list
						let documentFilename = 'A quote';

						for (let docName of userObject.billing.documents) {
							if (docName.id == canceledQuoteId) {
								documentFilename = docName.filename;
							}
						}

						let updateDoc = await userDoc.ref.update({
							'billing.open_documents': FieldValue.arrayRemove(document),
							'service_log.events': FieldValue.arrayUnion({
								time: canceledQuoteTime,
								description: documentFilename + ' was canceled.',
								type: 'billing'
							}),
							'subscription.status': 'Recent Quote Canceled',
							'subscription.message':
								"Uh Oh! It looks like a recent quote was canceled. This happens at expiry or can be manually triggered by us. We'll check in soon!"
						});
					}
				}
			});

			break;

		case 'invoice.canceled':
			const canceledInvoiceObject = event.data.object;
			let canceledInvoiceId = canceledInvoiceObject.id;
			let canceledInvoiceCustomerId = canceledInvoiceObject.customer;

			const canceledInvoiceQuery = await firestoreCollection
				.where('cuid', '==', canceledInvoiceCustomerId)
				.get();

			canceledInvoiceQuery.forEach(async (userDoc) => {
				let userObject = userDoc.data();

				let openDocuments = userObject.billing.open_documents;

				const canceledInvoiceTime = Timestamp.now();

				for (let document of openDocuments) {
					if (document.id == canceledInvoiceId) {
						// get document name from documents list
						let documentFilename = 'An invoice';

						for (let docName of userObject.billing.documents) {
							if (docName.id == canceledInvoiceId) {
								documentFilename = docName.filename;
							}
						}

						let updateDoc = await userDoc.ref.update({
							'billing.open_documents': FieldValue.arrayRemove(document),
							'service_log.events': FieldValue.arrayUnion({
								time: canceledInvoiceTime,
								description: documentFilename + ' was canceled.',
								type: 'billing'
							}),
							'subscription.status': 'Recent Invoice Canceled',
							'subscription.message':
								"Uh Oh! It looks like a recent invoice was canceled. This happens at expiry or can be manually triggered by us. We'll check in soon!"
						});
					}
				}
			});

			break;

		default:
		//console.log(`Unhandled event type ${event.type}`);
	}

	let success_reponse = new Response('Success', { status: 200 });
	return success_reponse;
}

/**
 *
 * @returns {Buffer} html body as a Buffer
 **/
function toBuffer(ab) {
	const buf = Buffer.alloc(ab.byteLength);
	const view = new Uint8Array(ab);
	for (let i = 0; i < buf.length; i++) {
		buf[i] = view[i];
	}
	return buf;
}

/**
 * @returns {number} Current timestamp in Unix format
 **/
function getUnixTimestamp() {
	let now = new Date();
	let nowInMilliseconds = now.getTime();
	let nowUnixTimestamp = Math.floor(nowInMilliseconds / 1000);

	return nowUnixTimestamp;
}
