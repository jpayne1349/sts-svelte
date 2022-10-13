// example session_store
let fake_profile_data = {
	company_data: {
		type: 'seperate',
		company_name: 'The Test Company',
		cid: 894321,
		owner_name: 'Donald Smith',
		company_email: 'company@email.com',
		company_phone: '800-292-4001',
		company_repository: 'www.github.com/sts/test_company',
		company_active_links: 'www.southtexas.software',
		company_plan: 'Monthly - Value',
		company_plan_description:
			'Provide software as a service including web development, website server hosting management, domain name management, etc.',
		billing_info: {
			billing_address: '123 Fairy Ln',
			billing_card_number: '3215 6543 6543 5465',
			billing_card_ccv: '123',
			billing_name: 'John Smith',
			billing_cycle: 'monthly',
			billing_due_date: 22
		}
	},
	user_list: [
		{
			uid: 846513,
			email: 'd_smith@email.com',
			role: 'admin'
		}
	],
	event_list: [
		{
			eid: 545183,
			category: 'service',
			type: 'Work',
			title: 'Code Commit fghsd',
			status: 'Completed',
			timestamp_full: 'Tue Sep 05 2022 10:57:47 GMT-0500 (Central Daylight Time)',
			timestamp_part: 'Tue Sep 05 2022',
			custom_attributes: [
				{
					title: 'Type:',
					value: 'Maintenance'
				}
			]
		},
		{
			eid: 682343,
			category: 'billing',
			type: 'Invoice',
			title: 'August 2022 / The Crazy P',
			status: 'Closed',
			timestamp_full: 'Tue Sep 27 2022 10:37:53 GMT-0500 (Central Daylight Time)',
			timestamp_part: 'Tue Sep 27 2022',
			custom_attributes: [
				{
					title: 'Amount:',
					value: '30.00'
				}
			]
		},

		{
			eid: 683183,
			category: 'service',
			type: 'Work',
			title: 'Code Commit aebsd',
			status: 'Completed',
			timestamp_full: 'Tue Oct 04 2022 10:57:47 GMT-0500 (Central Daylight Time)',
			timestamp_part: 'Tue Oct 04 2022',
			custom_attributes: [
				{
					title: 'Type:',
					value: 'Maintenance'
				}
			]
		}
	]
};

let fake_user_profile = {
	uid: 'jkanslkjfasdfna',
	name: 'John Doe', //same as displayName
	email: 'jdoe@gmail.com',
	cid: null
};


import { initFirebaseClient } from '../../initFirebaseClient';


export async function load() {

	// new plan. we make a writable store to hold the 'session_data' and then subscribe to it where needed..
	// initialized here with basically a new/no users settings


	return {
		
	};

}
