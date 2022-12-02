import { json, error } from '@sveltejs/kit';
import { STRIPE_TEST_PRIVATE_KEY } from '$env/static/private';
import Stripe from 'stripe';

// i guess this is kind of silly if we don't send our message encrypted and decrypt with an env variable on the client side.. lol

export async function POST({ request }) {
	const payload = await request.json();


	const stripe = new Stripe(STRIPE_TEST_PRIVATE_KEY);

	let responseJson = {
		error: false,
		cuid: ''
	};

	try {
		const new_customer_object = await stripe.customers.update(payload.cuid, {
			email: payload.email
		});

		responseJson = {
			error: false,
			cuid: new_customer_object.id
		};
	} catch (e) {
		responseJson = {
			error: true,
			code: e.code
		};

		// resource_already_exists returned if matching customer id found in stripe database
	}

	return json(responseJson);
}
