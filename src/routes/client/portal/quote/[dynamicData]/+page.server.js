import Stripe from 'stripe';
import { redirect } from '@sveltejs/kit';
import { stripeConfig } from '../../../../../config';



/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	let quoteId = params.dynamicData;
	let responseObject;

	const stripe = Stripe(stripeConfig.privateKey);

	try {
		responseObject = await stripe.quotes.retrieve(quoteId);
		let lineItems = await stripe.quotes.listLineItems(quoteId);

		responseObject.line_items = lineItems;
	} catch (e) {
		//(e.message);
		responseObject = {
			error: true,
			code: e.message
		};
    
		throw redirect(307, '/client/portal/billing/quote_not_found=true');

	}
	return {
		quote: responseObject
	};
}
