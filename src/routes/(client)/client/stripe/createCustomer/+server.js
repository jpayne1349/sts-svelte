import { json, error } from '@sveltejs/kit';
import { getFirestore } from 'firebase-admin/firestore';
import { getApp, cert, initializeApp } from 'firebase-admin/app';
import { STRIPE_TEST_PRIVATE_KEY } from '$env/static/private';
import Stripe from 'stripe';

// i guess this is kind of silly if we don't send our message encrypted and decrypt with an env variable on the client side.. lol

export async function POST({ request }) {
	const payload = await request.json();
	console.log('payload=', payload);

	const app = getApp();
	const db = getFirestore(app);

	const stripe = new Stripe(STRIPE_TEST_PRIVATE_KEY);

	let responseJson = {};

	try {
		const new_customer_object = await stripe.customers.create({
			id: payload.cuid,
			email: payload.email,
			name: payload.name,
			address: {
				city: payload.address.city,
				state: payload.address.state,
				line1: payload.address.street,
				country: 'US',
				postal_code: payload.address.zipcode
			},
			metadata: {
				created_by: payload.auid
			}
		});
		console.log('new customer created');

		responseJson = {
			error: false,
			created: true,
			updated: false
		};
	} catch (e) {
		if (e.code == 'resource_already_exists') {
			try {
				const new_customer_object = await stripe.customers.update(payload.cuid, {
					email: payload.email,
					name: payload.name,
					address: {
						city: payload.address.city,
						state: payload.address.state,
						line1: payload.address.street,
						postal_code: payload.address.zipcode
					},
					metadata: {
						created_by: payload.auid
					}
				});

				responseJson = {
					error: false,
					created: false,
					updated: true
				};
			} catch (e2) {
				console.log('ERROR IN NEW CUSTOMER: ', e2.code);

				responseJson = {
					error: true,
					code: e2.code
				};
			}
		}

		// resource_already_exists returned if matching customer id found in stripe database
	}

	return json(responseJson);
}
