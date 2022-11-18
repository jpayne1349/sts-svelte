import { sendEmail } from '../../emailing';
import { json } from '@sveltejs/kit';


export async function POST({ request }) {
	const payload = await request.json();

	let responseJson = { error: false };

	try {
		let sending = await sendEmail('error', {
			recipient: 'development@southtexas.software',
			title: payload.title,
			account: payload.account,
			details: payload.details
		});
		
	} catch (e) {
		responseJson.error = true;
		responseJson.code = e;
	}

	return json(responseJson);
}

