import { json, error } from '@sveltejs/kit';
import { STRIPE_TEST_PRIVATE_KEY } from '$env/static/private';
import Stripe from 'stripe';


export async function POST({ request }) {
	const payload = await request.json();
	let response = { error: false };

	const stripe = new Stripe(STRIPE_TEST_PRIVATE_KEY);

	try {
		const invoice = await stripe.invoices.pay(payload.invoiceId);
		
	} catch (e) {
		response.code = e.code;
		response.error = true;
	}

	return json(response);
}
