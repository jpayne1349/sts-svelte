import { json } from '@sveltejs/kit';
import { EMAIL_VERIFICATION_PRIVATE_KEY } from '$env/static/private';
import * as crypto from 'crypto';

export function load({ params }) {
	console.log(params.slug);

    let pageData = { 
        error: false,
        //... email/uid
    }

    try {
    let passed_info = decrypt(params.slug);
    let json_object = JSON.parse(passed_info);

    pageData.email = json_object.email;
    pageData.uid = json_object.uid;

    // TODO: import sendEmail and send email to dev team with info.

    } catch(e) {
        pageData.error = true;
    }
    

    return pageData;

}


function decrypt(text) {
	var decipher = crypto.createDecipher('aes-256-cbc', EMAIL_VERIFICATION_PRIVATE_KEY);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}