import { json } from '@sveltejs/kit';
import { STRIPE_TEST_PRIVATE_KEY } from '$env/static/private';
import Stripe from 'stripe';



export async function POST({ request }) {
	const payload = await request.json();


	let responseJson = {error: false};

	const stripe = new Stripe(STRIPE_TEST_PRIVATE_KEY);
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
