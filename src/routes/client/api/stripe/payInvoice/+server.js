import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import { stripeConfig } from '../../../../../config';


export async function POST({ request }) {
	const payload = await request.json();
	let response = { error: false };

	const stripe = new Stripe(stripeConfig.privateKey);

	try {
		const invoice = await stripe.invoices.pay(payload.invoiceId);
		
	} catch (e) {
		response.code = e.code;
		response.error = true;
	}

	return json(response);
}
