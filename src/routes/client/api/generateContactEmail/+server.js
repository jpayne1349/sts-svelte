import { sendEmail } from '../../emailing';
import { json } from '@sveltejs/kit';


export async function POST({ request }) {
	const payload = await request.json();

	let responseJson = { error: false };

	try {
		let sending = await sendEmail('contact-form', {
			recipient: 'development@southtexas.software',
			from: payload.from,
			subject: payload.subject,
			body: payload.body
		});
		
	} catch (e) {
		responseJson.error = true;
		responseJson.code = e;
	}

	return json(responseJson);
}

