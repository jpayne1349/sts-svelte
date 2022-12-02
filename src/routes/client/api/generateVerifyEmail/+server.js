import { sendEmail } from '../../emailing';
import { json } from '@sveltejs/kit';
import * as crypto from 'crypto';
import { encryptionConfig } from '../../../../config';


export async function POST({ request }) {
	const payload = await request.json();

	let responseJson = { error: false };


	let uniqueVerificationString = encrypt(JSON.stringify(payload));

	let verification_url = 'http://192.168.1.25:5173/client/email_verification/p=' + uniqueVerificationString;

	let report_url = 'http://192.168.1.25:5173/report_email/' + uniqueVerificationString;

	try {
		let sending = await sendEmail('verify-email', {
			recipient: payload.email,
			link: verification_url,
			report_link: report_url,
		});
		
	} catch (e) {
		responseJson.error = true;
		responseJson.code = e;
	}

	return json(responseJson);
}


function encrypt(text) {
	var cipher = crypto.createCipher('aes-256-cbc', encryptionConfig.privateKey);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}