import { sendEmail } from '../../emailing';
import { json } from '@sveltejs/kit';
import { getAuth } from 'firebase-admin/auth';

export async function POST({ request }) {
	const payload = await request.json();

	let responseJson = { error: false };


	let auth = getAuth();

	try {
		let userRecord = await auth.getUserByEmail(payload.email);

		let signInToken = await auth.createCustomToken(userRecord.uid);
		
		let newEmail = await sendEmail('reset-password', {
			recipient: payload.email,
			token: signInToken
		});

		responseJson.sent = true;

	} catch (error) {
		//console.log(error);
		responseJson.error = true;
		responseJson.code = error.code;
	}

	return json(responseJson);
}
