import { json, error } from '@sveltejs/kit';
import { STRIPE_TEST_PRIVATE_KEY } from '$env/static/private';
import Stripe from 'stripe';




export async function POST({ request }) {
	const payload = await request.json();
	
	let responseJson = { error:false };

	const stripe = new Stripe(STRIPE_TEST_PRIVATE_KEY);

	try {
		const getPaymentMethodDetails = await stripe.customers.listPaymentMethods(
			payload.cuid,
			{type: 'card'}
		);
			
		getPaymentMethodDetails.data.forEach(async (payment_method)=>{
			

			if(payment_method.id == payload.pm_id) {

				responseJson.type = payment_method.card.brand;
				responseJson.last_four = payment_method.card.last4;
				responseJson.pm_id = payload.pm_id;
				responseJson.default = true;

				let updateCustomer = await stripe.customers.update(payload.cuid,{
					invoice_settings:{
						default_payment_method: payload.pm_id
					}
				});

				}
		});
		

	} catch (e) {
		responseJson.code = e.code;
		responseJson.error = true;
	}

	return json(responseJson);
}
