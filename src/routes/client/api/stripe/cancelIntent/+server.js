import { json, error } from '@sveltejs/kit';
import { STRIPE_TEST_PRIVATE_KEY } from '$env/static/private';
import Stripe from 'stripe';

// i guess this is kind of silly if we don't send our message encrypted and decrypt with an env variable on the client side.. lol

export async function POST({ request }) {
	const payload = await request.json();


	let intent_id = payload.intent_code.split('_secret_')

	let responseJson = { msg: 'canceled setup intent'};

	const stripe = new Stripe(STRIPE_TEST_PRIVATE_KEY);

	try {
		const cancelIntent = await stripe.setupIntents.cancel(intent_id[0]);

	} catch (e) {
		responseJson.msg = e.code;
		responseJson.error = true;
	}

	return json(responseJson);
}
