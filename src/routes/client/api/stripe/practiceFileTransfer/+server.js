import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import { getStorage } from 'firebase-admin/storage';
import { stripeConfig } from '../../../../../config';

const quoteId = 'qt_1M85FgLLMTpPeabJdt1mSw5z';

export async function POST({ request }) {
	//console.log('attempting file transfer');

	const stripe = Stripe(stripeConfig.privateKey);

	const bucket = getStorage().bucket();

	//console.log(bucket);

	const filename = 'client-portal-users/practice/' + quoteId + '.pdf';
	const fileReference = bucket.file(filename);

	const fileWriter = fileReference.createWriteStream({
		metadata: {
			contentType: 'application/pdf'
		}
	});
	const pdf = await stripe.quotes.pdf(quoteId);

	

	await new Promise((resolve) => {
		pdf.pipe(fileWriter);
		//console.log('piping file');
		fileWriter.on('error', (e) => {
			//console.log(e);
		});

		fileWriter.on('finish', () => {
			//console.log('finished writing');
			resolve();
		});

	});



	let success_response = new Response('Success', { status: 200 });
	//console.log('successful response');
	return success_response;
}
