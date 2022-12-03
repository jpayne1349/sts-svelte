import { sendEmail } from '../../emailing';
import { json } from '@sveltejs/kit';
import crypto from 'crypto';
import { encryptionConfig } from '../../../../config';


export async function POST({ request }) {
	const payload = await request.json();

	let responseJson = { error: false };

	let uniqueVerificationString = encrypt(JSON.stringify(payload));

	let verification_url = payload.origin + '/client/email_verification/d=' + uniqueVerificationString;

	let report_url = payload.origin + '/report_email/' + uniqueVerificationString;

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
	const iv = crypto.randomBytes(16);

	const cipher = crypto.createCipheriv('aes-256-ctr', encryptionConfig.privateKey, iv);

	const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

	const string = iv.toString('hex') + '=' + encrypted.toString('hex');

	console.log('url extension encrypted', string)

	return string;
};