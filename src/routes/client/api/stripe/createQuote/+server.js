import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import { stripeConfig } from '../../../../../config';


const pricing_table = {
	basic_fixed: {
		no_features: {
			monthly: 'price_1M210ZLLMTpPeabJAdkPejBY',
			build: 'price_1M2HJtLLMTpPeabJ239hGRFR'
		},
		auto_email: {
			monthly: 'price_1M2H60LLMTpPeabJYmsR6SOe',
			build: 'price_1M2HMBLLMTpPeabJkwQp2ML7'
		},
		custom_email: {
			monthly: 'price_1M2H7ZLLMTpPeabJAMjiV3uc',
			build: 'price_1M2HMqLLMTpPeabJvaDj0j3X'
		},
		all_features: {
			monthly: 'price_1M2HBQLLMTpPeabJ5YLHXc89',
			build: 'price_1M2HNRLLMTpPeabJjY2RRDYh'
		}
	},
	advanced_fixed: {
		no_features: {
			monthly: '',
			build: ''
		},
		payments: {
			monthly: '',
			build: ''
		}
	},
	advanced_value: {
		monthly: '',
		build: ''
	}
};

export async function POST({ request }) {
	const payload = await request.json();

	let header_text = '';
	let quote_line_items = [];

	// determines what to put into quote based on sections monthly price
	// TODO: this could get broken if someone chooses more than one type of plan, basic + advanced, etc.
	if (payload.web_dev.selected) {
		header_text = 'Web Development: Draft';

		switch (payload.web_dev.monthly) {
			case 30:
				quote_line_items.push({ price: pricing_table.basic_fixed.no_features.monthly });
				quote_line_items.push({ price: pricing_table.basic_fixed.no_features.build });
				break;

			case 35:
				quote_line_items.push({ price: pricing_table.basic_fixed.auto_email.monthly });
				quote_line_items.push({ price: pricing_table.basic_fixed.auto_email.build });
				break;

			case 45:
				quote_line_items.push({ price: pricing_table.basic_fixed.custom_email.monthly });
				quote_line_items.push({ price: pricing_table.basic_fixed.custom_email.build });
				break;

			case 50:
				quote_line_items.push({ price: pricing_table.basic_fixed.all_features.monthly });
				quote_line_items.push({ price: pricing_table.basic_fixed.all_features.build });
				break;
		}
	}
	if (payload.software_sol.selected) {
		header_text = 'Software Solution: Draft';
	}

	// do a simple check to see if the quote line items is empty.. if so, we add a blanket empty quote
	if (quote_line_items.length == 0) {
		header_text = 'Non-Typical Request: submission under review';
	}

	let responseJson = { error: false };

	const stripe = new Stripe(stripeConfig.privateKey);
	try {
		const setupQuote = await stripe.quotes.create({
			customer: payload.cuid,
			line_items: quote_line_items,
			header: header_text,
			description:
				'This quote has been finalized. We look forward to working with you! Please contact us if you have questions or would like to make changes.',
			footer:
				'This quote is the result of a verbal agreement between the client and South Texas Software, LLC. Once accepted through the client portal, quotes are considered binding agreements.'
		});

		payload.quoteId = setupQuote.id;
		responseJson.payload = payload;
	} catch (e) {
		responseJson.code = e;
		responseJson.error = true;
	}

	return json(responseJson);
}
