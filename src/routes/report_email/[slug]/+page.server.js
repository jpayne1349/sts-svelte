import { json } from '@sveltejs/kit';
import * as crypto from 'crypto';
import { sendEmail } from '../../client/emailing';
import { encryptionConfig } from '../../../config';



export function load({ params }) {
	//console.log(params.slug);

	let pageData = {
		error: false
		//... email/uid
	};

	try {
		let passed_info = decrypt(params.slug);
		let json_object = JSON.parse(passed_info);

		pageData.email = json_object.email;
		pageData.uid = json_object.uid;

		
		let reportEmail = sendEmail('notify_dev', {
			title: 'Email Reported',
			account: pageData.email,
			details:
				'This email was reported, it may have been sent in error or from someone who would like to not receive emails. Look into it.'
		});

	} catch (e) {
		pageData.error = true;
	}

	return pageData;
}

function decrypt(text) {
	var decipher = crypto.createDecipher('aes-256-cbc', encryptionConfig.privateKey);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}
