import { SENDGRID_API_KEY } from '$env/static/private';
import sgMail from '@sendgrid/mail';
import { dev } from '$app/environment';

const fromObj = {
	name: 'South Texas Software',
	email: 'notifications@southtexas.software'
};

const contact_form_template = 'd-f6d9d919b0904ab78b4b1e9911d6be07';
const verify_email_template = 'd-aea9ead9b3fe4202948cc55d10c3f039';
const dev_error_template = 'd-3a3c8777d96f430b9167eeb23eab2c1d';

let msg = {
	from: fromObj, // Change to your verified sender
};

export async function sendEmail(type, payload) {
	msg.to = payload.recipient;

	switch (type) {
		case 'contact-form':
			msg.templateId = contact_form_template;
			msg.dynamicTemplateData = {
				from: payload.from,
				subject: payload.subject,
				body: payload.body
			};
			break;

		case 'verify-email':
			msg.templateId = verify_email_template;
			msg.dynamicTemplateData = {
				subject: 'Verify account email address',
				link: payload.link,
				report_link: payload.report_link
			};
			break;

		case 'error':
			msg.templateId = dev_error_template;
			msg.dynamicTemplateData = {
				title: payload.title,
				account: payload.account,
				details: payload.details
			};
			break;
	}

	// try not to send too many emails if we are in dev mode!
	if (dev) {
		console.log('****************** SIMULATING EMAIL PAYLOAD *********************');
		console.error(msg);
	} else {
		sgMail.setApiKey(SENDGRID_API_KEY);

		sgMail
			.send(msg)
			.then(() => {
				return 'Email Sent';
			})
			.catch((error) => {
				console.error(error);

				throw error;
			});
	}
}
