import { json, error } from '@sveltejs/kit';
import { STRIPE_TEST_PRIVATE_KEY } from '$env/static/private';
import Stripe from 'stripe';

// i guess this is kind of silly if we don't send our message encrypted and decrypt with an env variable on the client side.. lol

export async function POST({ request }) {
	const payload = await request.json();
	
	const stripe = new Stripe(STRIPE_TEST_PRIVATE_KEY);

	let responseJson = {
		error: false
	};

	try {
		const updated_customer = await stripe.customers.update(
			payload.customer_id,
			payload.update_customer
		);

		
		responseJson = {
			error: false
		};
	} catch (e) {
		responseJson = {
			error: true,
			code: e.code
		};
		
	}

	return json(responseJson);
}
