import { json } from '@sveltejs/kit';
import crypto from 'crypto';
import { encryptionConfig } from '../../../../config';

export async function POST({ request }) {
	let payload = await request.json();
	let responseJson = { error: false };

	let token = payload.token;
	let user_object = decrypt(token);
	user_object = JSON.parse(user_object);

    responseJson.decryptedToken = user_object;

	return json(responseJson);
}


function decrypt(string) {
	
	const peices = string.split('=');
	
	const hash = {
		iv: peices[0],
		content: peices[1]
	}

	const decipher = crypto.createDecipheriv('aes-256-ctr', encryptionConfig.privateKey, Buffer.from(hash.iv, 'hex'));

	const decrpyted = Buffer.concat([
		decipher.update(Buffer.from(hash.content, 'hex')),
		decipher.final()
	]);

	return decrpyted.toString();
};
