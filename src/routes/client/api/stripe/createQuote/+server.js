import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import { stripeConfig } from '../../../../../config';

const pricing_table = {
	basic_fixed: {
		no_features: {
			monthly: 'price_1MClerLLMTpPeabJSdHKdFBC',
			build: 'price_1MCleALLMTpPeabJEtH3IcFL'
		},
		auto_email: {
			monthly: 'price_1MClejLLMTpPeabJL8pQrJB6',
			build: 'price_1MCldzLLMTpPeabJfBCXwYzx'
		},
		custom_email: {
			monthly: 'price_1M2H7ZLLMTpPeabJAMjiV3uc',
			build: 'price_1M2HMqLLMTpPeabJvaDj0j3X'
		},
		all_features: {
			monthly: 'price_1MCleMLLMTpPeabJwEggxbgI',
			build: 'price_1MCldbLLMTpPeabJen0DFLlu'
		}
	},
	advanced_fixed: {
		no_features: {
			monthly: 'price_1MClw2LLMTpPeabJwPqqrxy6',
			build: 'price_1MClpyLLMTpPeabJYu76GRp8'
		},
		payments: {
			monthly: 'price_1MClxCLLMTpPeabJvFiuISxP',
			build: 'price_1MClsZLLMTpPeabJXIBahudZ'
		}
	},
	advanced_value: {
		monthly: 'price_1MCm85LLMTpPeabJ6e7yOSyu',
		build: 'price_1MCm59LLMTpPeabJkeW8onuC'
	}
};

export async function POST({ request }) {
	const payload = await request.json();

	let header_text = '';
	let quote_line_items = [];

	// determines what to put into quote based on sections monthly price
	// This will just default to a non-typical request header if none of the cases are met...
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

			case 300:
				quote_line_items.push({ price: pricing_table.advanced_fixed.no_features.monthly });
				quote_line_items.push({ price: pricing_table.advanced_fixed.no_features.build });
				break;

			case 500:
				quote_line_items.push({ price: pricing_table.advanced_fixed.payments.monthly });
				quote_line_items.push({ price: pricing_table.advanced_fixed.payments.build });
				break;

			case 100:
				quote_line_items.push({ price: pricing_table.advanced_value.monthly });
				quote_line_items.push({ price: pricing_table.advanced_value.build });
				break;
		}
	}
	if (payload.software_sol.selected) {
		header_text = 'Software Solution: Draft';
	}

	// do a simple check to see if the quote line items is empty.. if so, we add a blanket empty quote
	if (quote_line_items.length == 0) {
		header_text = 'Non-Typical Request: submission needs review';
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
