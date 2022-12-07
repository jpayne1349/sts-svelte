<script>
	import { sessionStore, fbStore, alertStore } from '../../../stores';
	import Document from '../../billing/Document.svelte';
	import { ref } from 'firebase/storage';
	import { goto } from '$app/navigation';
	import { beforeUpdate } from 'svelte';
	import PaymentCard from '../../PaymentCard.svelte';
	import { init } from 'svelte/internal';
	import Alert from '../../../components/Alert.svelte';

	export let data;
	let paying_invoice = false;
	let invoiceObject;
	let fileReference;
	let invoiceStatus = '';
	let allowPayment = true;
	let payment_status = 'Processing Payment';
	let redirectToStripe = false;

	invoiceObject = data.invoice;

	if (invoiceObject.status != 'open') {
		invoiceStatus = invoiceObject.status;
		allowPayment = false;
	}
	
	if ($sessionStore.default_payment_method.id == '') {
		redirectToStripe = true;
	}

	// get fileobject from sessionStore
	let invoiceFilename = 'Invoice_' + invoiceObject.id.slice(-8, -1) + '.pdf';
	for (let doc of $sessionStore.billing.documents) {
		if (doc.filename == invoiceFilename) {
			fileReference = doc;
		}
	}

	async function payInvoice() {
		paying_invoice = true;

		if (redirectToStripe) {
			let paymentPage = await goto(invoiceObject.hosted_invoice_url);

			return;
		}

		let serverReponse = await fetch('/client/api/stripe/payInvoice', {
			method: 'POST',
			body: JSON.stringify({ invoiceId: invoiceObject.id }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		serverReponse = await serverReponse.json();

		if (serverReponse.error) {
			alertStore.set({
				message: 'Something Went Wrong',
				error: true,
				show: true
			});

			let sendEmail = fetch('/client/api/generateErrorEmail', {
				method: 'POST',
				body: JSON.stringify({
					title: 'Error in Paying Invoice',
					account: $sessionStore.email,
					details: serverReponse.code
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			paying_invoice = false;

			return;
		}
		$sessionStore.billing.open_documents[0].processing = true;

		// successful / no errors
		awaitPaymentStatus();
	}

	// recursive function which checks for the event that's posted by the webhook
	function awaitPaymentStatus() {
		if ($sessionStore.billing.latest_charge.invoiceId == invoiceObject.id) {
			if ($sessionStore.billing.latest_charge.status == 'succeeded') {
				alertStore.set({
					error: false,
					show: true,
					message: 'Payment Succeeded!'
				});

				
				
				// payment succeeded and receipt has been generated.
				let receiptPage = goto(
					'/client/portal/receipt/' + $sessionStore.billing.latest_charge.receiptId
				);
			}
			if ($sessionStore.billing.latest_charge.status == 'failed') {
				alertStore.set({
					error: true,
					show: true,
					message: 'Payment Failed'
				});

				let sendEmail = fetch('/client/api/generateErrorEmail', {
					method: 'POST',
					body: JSON.stringify({
						title: 'Error in Paying Invoice',
						account: $sessionStore.email,
						details: 'Latest Charge Status: Failed'
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				});

				paying_invoice = false;
				return;
			}
		} else {
			// update in .5 seconds
			setTimeout(awaitPaymentStatus, 500);
		}
	}

	function formatItem(string) {
		let stringArray = string.split(':');
		return stringArray[0] + '<br>' + stringArray[1];
	}
	
</script>

<section class="container">
	<h3>Invoice Payment</h3>

	<div class="group">
		<p class="label">Name</p>
		<p class="variable">{$sessionStore.billing.name}</p>
	</div>

	<div class="group">
		<p class="label">Address</p>
		<p class="variable">
			{#if $sessionStore.address.line1 != ''}
				{$sessionStore.address.line1} <br />
				{$sessionStore.address.city}, {$sessionStore.address.state}
				{$sessionStore.address.postal_code}
			{/if}
		</p>
	</div>

	<div class="group">
		<p class="label payment">Default Payment Method</p>
		<p class="card">
			{#if $sessionStore.default_payment_method.id == ''}
				None: You will be redirected to our payment processor.
			{:else}
				<PaymentCard />
			{/if}
		</p>
	</div>

	<div class="group">
		<p class="label document">Reference Document</p>
		<p class="variable document">
			{#if fileReference }
			<Document file={fileReference} />
			{/if}
		</p>
	</div>

	<div class="group">
		<p class="variable line-items">
			{#each invoiceObject.lines.data as item}
				<p class="line-item">{@html formatItem(item.description)}</p>
			{/each}
		</p>
	</div>

	<div class="group"><p class="total">Total: ${invoiceObject.total / 100} USD</p></div>

	<p class="footer">
		By clicking 'Pay Invoice' you authorize South Texas Software, LLC to charge your default payment
		method the total amount above. If applicable, recurring items will be set up as a subscription
		that will be automatically charged on this date each month. Subscriptions can be cancelled or
		changed via the Billing page. Thank you.
	</p>

	<div class="group">
		{#if allowPayment}
			<button on:click={payInvoice}>
				{#if paying_invoice}
					<div class="spinner" />
					{payment_status}
				{:else}
					Pay Invoice
				{/if}
				<img class='lock-icon' src="../../../lock-icon.svg" alt='Secure Transaction' />
			</button>
		{:else}
			<div class="not-allowed">Looks like this invoice has been {invoiceStatus}</div>
		{/if}
	</div>
</section>

<style>
	.container {
		margin-bottom: 2vh;
		display: flex;
		flex-direction: column;
		min-height: 600px;
		padding: 0;
		border: 1px solid var(--main);
	}
	h3 {
		font-family: openSans-semibold;
		background-color: var(--main);
		color: white;
		width: 100%;
		text-align: center;
		padding: 15px 0;
		margin-bottom: 15px;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}

	.group {
		display: flex;
		flex-direction: column;
		margin: 10px 25px 5px;
	}

	p {
		font-family: openSans-regular;
		font-size: 16px;
	}
	p.label {
		font-family: openSans-medium;
		width: 150px;
	}
	p.label.document,
	p.label.payment {
		width: 100%;
	}
	p.variable {
		margin: 0px 0 0 10px;
		background-color: rgb(250, 250, 250);
		padding: 4px 10px;
		border-radius: 5px;
	}
	p.variable.document {
		padding-bottom: 15px;
	}
	p.total {
		font-family: openSans-semibold;
		font-size: 16px;
		margin-bottom: 25px;
		text-align: center;
	}
	p.card {
		margin: 5px 0 0 25px;
	}

	.line-item {
		display: flex;
		font-size: 12px;
		color: var(--main);
		margin: 8px 0px;
		border-bottom: 1px dotted var(--bar-color);
	}
	button {
		width: 100%;
		margin-bottom: 15px;
		background-color: var(--main);
		position: relative;
	}
	.not-allowed {
		width: 100%;
		margin-bottom: 15px;
		background-color: var(--alert-orange);
		text-align: center;
		font-family: openSans-medium;
		color: white;
		padding: 10px 20px;
		border-radius: 5px;
	}
	.footer {
		font-family: openSans-light;
		font-size: 14px;
		text-align: center;
		margin: auto 15px 20px;
	}
	.spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid white;
		border-right: 2px solid transparent;
		width: 15px;
		height: 15px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-right: 10px;
	}
	.lock-icon {
	font-size: 10px;
	position: absolute;
	right: 15px;
	user-select: none;
	width: 10px;
}

	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	@media only screen and (max-width: 500px) {
		.footer {
			font-size: 12px;
		}
		p.card {
			margin-left: 15px;
		}
	}
</style>
