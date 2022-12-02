import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import { stripeConfig } from '../../../../../config';



export async function POST({ request }) {
	const payload = await request.json();
	
	const stripe = new Stripe(stripeConfig.privateKey);

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
