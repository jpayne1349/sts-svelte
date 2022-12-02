import { json } from '@sveltejs/kit';
import { EMAIL_VERIFICATION_PRIVATE_KEY } from '$env/static/private';
import * as crypto from 'crypto';


export async function POST({ request }) {
	let payload = await request.json();
	let responseJson = { error: false };

	let token = payload.token;
	let user_object = decrypt(token);
	user_object = JSON.parse(user_object);

    responseJson.decryptedToken = user_object;

	return json(responseJson);
}


function decrypt(text) {
	var decipher = crypto.createDecipher('aes-256-cbc', EMAIL_VERIFICATION_PRIVATE_KEY);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

