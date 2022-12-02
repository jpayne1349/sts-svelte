import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import { stripeConfig } from '../../../../../config';



export async function POST({ request }) {
	const payload = await request.json();


	let responseJson = { error:false };

	const stripe = new Stripe(stripeConfig.privateKey);

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
