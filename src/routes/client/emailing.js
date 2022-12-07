
import sgMail from '@sendgrid/mail';
import { dev } from '$app/environment';
import { sendgridConfig } from '../../config';

const fromObj = {
	name: 'South Texas Software',
	email: 'notifications@southtexas.software'
};

const contact_form_template = 'd-f6d9d919b0904ab78b4b1e9911d6be07';
const verify_email_template = 'd-aea9ead9b3fe4202948cc55d10c3f039';
const dev_error_template = 'd-3a3c8777d96f430b9167eeb23eab2c1d';
const finalize_quote_template = 'd-1e5ddef331cc411482505662e5a8a046';
const notify_dev_template = 'd-9f2e48302f4d4d66b22e5e3069f82c33';
const pay_invoice_template = 'd-4c2a73162ec44633a63e27311bc7c047';
const receipt_template = 'd-fe4afc874c58451e8b2ec28b86616fa9';
const reset_password_template = 'd-a1fb019d9ca14bc5b6fefd5bc2f43a3b';

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

		case 'finalize-quote':
			msg.templateId = finalize_quote_template;
			msg.dynamicTemplateData = {
				subject: 'A quote is ready for review',
				link: payload.link
			};
			break;

		case 'pay-invoice':
			msg.templateId = pay_invoice_template;
			msg.dynamicTemplateData = {
				subject: 'An invoice is ready for payment',
				link: payload.link
			};
			break;

		case 'receipt':
			msg.templateId = receipt_template;
			msg.dynamicTemplateData = {
				subject: 'Login to view your receipt',
				link: payload.link
			};
			break;

		case 'reset-password':
			msg.templateId = reset_password_template;
			msg.dynamicTemplateData = {
				token: payload.token
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

		case 'notify_dev':
			msg.templateId = notify_dev_template;
			msg.dynamicTemplateData = {
				title: payload.title,
				account: payload.account,
				details: payload.details
			};
			break;
	}

	// d: change to dev if testing other features
	if (false) {
		console.log('****************** SIMULATING EMAIL PAYLOAD *********************');
		console.error(msg);
	} else {
		sgMail.setApiKey(sendgridConfig.apiKey);

		sgMail
			.send(msg)
			.then(() => {
				return 'Email Sent';
			})
			.catch((error) => {
				console.error(error);

			});
	}
}
