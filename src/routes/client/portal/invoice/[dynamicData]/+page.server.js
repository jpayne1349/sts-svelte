import { STRIPE_TEST_PRIVATE_KEY } from '$env/static/private';
import Stripe from 'stripe';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	let invoiceId = params.dynamicData;
	let responseObject;

	const stripe = Stripe(STRIPE_TEST_PRIVATE_KEY);

	try {
		responseObject = await stripe.invoices.retrieve(invoiceId);
		
	} catch (e) {
		//console.log(e.message);
		responseObject = {
			error: true,
			code: e.message
		};
    
		throw redirect(307, '/client/portal/billing/invoice_not_found=true');

	}
	return {
		invoice: responseObject
	};
}
