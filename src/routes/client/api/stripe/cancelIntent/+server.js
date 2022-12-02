import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import { stripeConfig } from '../../../../../config';


export async function POST({ request }) {
	const payload = await request.json();


	let intent_id = payload.intent_code.split('_secret_')

	let responseJson = { msg: 'canceled setup intent'};

	const stripe = new Stripe(stripeConfig.privateKey);

	try {
		const cancelIntent = await stripe.setupIntents.cancel(intent_id[0]);

	} catch (e) {
		responseJson.msg = e.code;
		responseJson.error = true;
	}

	return json(responseJson);
}
