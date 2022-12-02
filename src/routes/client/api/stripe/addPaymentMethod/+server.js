import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import { stripeConfig } from '../../../../../config';



export async function POST({ request }) {
	const payload = await request.json();
	
	let responseJson = { error:false };

	const stripe = new Stripe(stripeConfig.privateKey);

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
