import { json, error } from '@sveltejs/kit';
import { getFirestore } from 'firebase-admin/firestore';
import { getApp, cert, initializeApp } from 'firebase-admin/app';
import { STRIPE_TEST_PRIVATE_KEY } from '$env/static/private';
import Stripe from 'stripe';


export async function POST({ request }) {
	const payload = await request.json();
	console.log('payload=', payload);

	const app = getApp();
	const db = getFirestore(app);

	let responseJson = { msg: 'posted to setupIntent endpoint', cs:undefined };

	const stripe = new Stripe(STRIPE_TEST_PRIVATE_KEY);
	try {
		const setupIntent = await stripe.setupIntents.create({
			customer: payload.cuid,
			payment_method_types: ['card']
		});

		responseJson.cs = setupIntent.client_secret;

	} catch (e) {
		responseJson.msg = e.code;
		responseJson.error = true;
	}

	return json(responseJson);
}
