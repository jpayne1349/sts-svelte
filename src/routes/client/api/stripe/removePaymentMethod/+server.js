import { json, error } from '@sveltejs/kit';
import { STRIPE_TEST_PRIVATE_KEY } from '$env/static/private';
import Stripe from 'stripe';




export async function POST({ request }) {
	const payload = await request.json();


	let responseJson = { error:false };

	const stripe = new Stripe(STRIPE_TEST_PRIVATE_KEY);

	try {
		const getPaymentMethodDetails = await stripe.paymentMethods.detach(
			payload.pm_id
			
		);

	} catch (e) {
		responseJson.code = e.code;
		responseJson.error = true;
	}

	return json(responseJson);
}
