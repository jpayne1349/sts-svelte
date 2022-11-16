import { json, error } from '@sveltejs/kit';
import { STRIPE_TEST_PRIVATE_KEY } from '$env/static/private';
import Stripe from 'stripe';

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = 'whsec_b683e46cb593d510eef7f0f49229da29bb54b9c2b4577c1a49a4edde8190bbb7';

export async function POST({ request }) {
    console.log('received webhook event');

    const _rawBody = await request.arrayBuffer();
    const payload = toBuffer(_rawBody);

	const stripe = Stripe(STRIPE_TEST_PRIVATE_KEY);

    const sig = request.headers.get('stripe-signature');

	let event;

	try {
		event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
	} catch (err) {
        
        let error_reponse = new Response('Webhook Error: ' + err.message, { status: 400 });
        return error_reponse;
	}

	// Handle the event
	switch (event.type) {
		case 'payment_intent.succeeded':
			const paymentIntent = event.data.object;
			
            console.log('SOME STUFF FROM THIS INCOMING PAYMENT INTENT SUCCESS EVENT');
            console.log(paymentIntent.customer)
            console.log(paymentIntent.amount)

			break;
		
            // ... handle other event types


		default:
			console.log(`Unhandled event type ${event.type}`);
	}

    let success_reponse  = new Response('Success', { status: 200 });
    return success_reponse;

}


// copy pasta
function toBuffer(ab) {
	const buf = Buffer.alloc(ab.byteLength);
	const view = new Uint8Array(ab);
	for (let i = 0; i < buf.length; i++) {
		buf[i] = view[i];
	}
	return buf;
}