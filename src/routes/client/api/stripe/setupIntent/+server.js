import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { stripeConfig } from '../../../../../config';


export async function POST({ request }) {
	const payload = await request.json();


	let responseJson = {error: false};

	const stripe = new Stripe(stripeConfig.privateKey);
	try {
		const setupIntent = await stripe.setupIntents.create({
			customer: payload.cuid,
			payment_method_types: ['card']
		});

		responseJson.intent_code = setupIntent.client_secret;

	} catch (e) {
		responseJson.code = e.code;
		responseJson.error = true;
	}

	return json(responseJson);
}
