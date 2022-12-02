import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import { stripeConfig } from '../../../../../config';

// i guess this is kind of silly if we don't send our message encrypted and decrypt with an env variable on the client side.. lol

export async function POST({ request }) {
	const payload = await request.json();


	let responseJson = { msg: 'canceling subscription' };

	const stripe = new Stripe(stripeConfig.privateKey);

	try {
		const cancelIntent = await stripe.subscriptions.update(payload.sub_id, {
			cancel_at_period_end: true
		});
	} catch (e) {
		responseJson.msg = e.code;
		responseJson.error = true;
	}

	return json(responseJson);
}
