<script>
	import StyledInput from '../StyledInput.svelte';
	import CompanyQuestions from './CompanyQuestions.svelte';
	import HowToCreate from './HowToCreate.svelte';
	import InitialView from './InitialView.svelte';
	import { fade } from 'svelte/transition';
	import CreateAccount from './CreateAccount.svelte';
	import { getContext } from 'svelte';

	import { collection, doc, getDoc, addDoc, setDoc, updateDoc, Timestamp, arrayUnion } from 'firebase/firestore';

	let session_store = getContext('session_store');

	let session_data = {};

	session_store.subscribe((data) => {
		session_data = data;
	});

	let welcome_view_object = {
		in_initial_view: true,
		in_company_questions: false,
		in_how_to_create: false,
		in_create_account: false,
		in_profile_loading: false // this is not used currently, we can revisit this if we think necessary
	};

	let show_back_button = false;

	// passed up from the companyQuestions
	let company_data;
	let previously_filled_info;
	$: {
		previously_filled_info = company_data;
	}

	function handleInitialCreateClick(event) {
		welcome_view_object.in_initial_view = false;

		welcome_view_object.in_company_questions = true;
	}

	function handleCompanyForm(event) {
		company_data = event.detail;
		welcome_view_object.in_company_questions = false;
		welcome_view_object.in_how_to_create = true;
	}

	function handleStsAccountShow(event) {
		if (event.detail == 'username_password') {
			welcome_view_object.in_how_to_create = false;
			welcome_view_object.in_create_account = true;
		}
	}

	async function handleNewUser(event) {
		// see new user info commented out below
		let new_user = event.detail;
		let new_user_name = new_user.displayName;
		let new_user_uid = new_user.uid;
		let new_user_email = new_user.email;

		// let's do a little test to try subcollections
		// first we make the company collection
		const client_company_collection = collection(session_data.firebaseDb, 'client-company');

		let json_company_data = {
			profile: {
				name: company_data.company_name,
				type: '',
				email: '',
				phone: '',
				plan: '',
				plan_description: '',
				active_links: '',
				repository: ''
			},
			billing: {
				name: '',
				address: {
					street:'',
					zipcode:'',
					city:'',
					state:''
				},
				due_date: 0,
				payment_methods:[],
				cycle: '',
				autopay: false,
				email: '',
				status:{
					message: 'Information Required',
					customer: false,
					payment_method: false,
					color: 'yellow'
				}
			},
			user_ids: [new_user_uid]
			// nest collections for users and for events
		};

		// setting of new company 'type' based on the the data provided
		if (company_data.company_name_entered) {
			json_company_data.profile.type = 'seperate';
		} else {
			json_company_data.profile.type = 'self';
		}

		// add the document to the collection
		let companyDocRef = await addDoc(client_company_collection, json_company_data);

		let json_user_data = {
			auid: new_user_uid,
			name: new_user_name,
			email: new_user_email,
			phone: '',
			cuid: companyDocRef.id
		};

		// create reference to new subcollection
		const company_users_subcollection = collection(companyDocRef, 'users');

		// we use setDoc so we can specify that the document uid should == the auth uid
		const userDoc = doc(company_users_subcollection, new_user_uid);
		const userDocRef = await setDoc(userDoc, json_user_data);


		// first event to populate events subcollection
		let json_event_data = {
			category: 'Service',
			created: Timestamp.now(),
			cuid: companyDocRef.id,
			custom_data: [{key: 'Type', value: 'Saved Data'}],
			status: 'Completed',
			title: 'Account Creation',
			description: 'Thank you for creating an account! Events will continue to be generated manually and automatically.',
			type: 'Automated',
			updated: null
		};

		// create reference to new subcollection
		const company_event_subcollection = collection(companyDocRef, 'events');
		const eventDocRef = await addDoc(company_event_subcollection, json_event_data);

		// updating a global state to notify other processes that the new user if finished being created
		session_store.update((existing_data) => {
			existing_data.creating_new_user = false;
			return existing_data;
		});

		// rest of page should react
	}

	function handleBackButton() {
		if (welcome_view_object.in_how_to_create) {
			welcome_view_object.in_how_to_create = false;
			welcome_view_object.in_company_questions = true;
		}
		if (welcome_view_object.in_create_account) {
			welcome_view_object.in_create_account = false;
			show_back_button = true;
			setTimeout(() => {
				welcome_view_object.in_how_to_create = true;
				show_back_button = false; // this is a weird work-around to make this transition smoother..
			}, 200);
		}
	}
</script>

<div id="client-welcome-container">
	<div id="welcome-title">Welcome to our Client Portal!</div>

	<div id="welcome-body">
		{#if welcome_view_object.in_initial_view}
			<InitialView on:validated_click={handleInitialCreateClick} />
		{:else if welcome_view_object.in_company_questions}
			<CompanyQuestions {previously_filled_info} on:completed={handleCompanyForm} />
		{:else if welcome_view_object.in_how_to_create}
			<HowToCreate {company_data} on:sts_account={handleStsAccountShow} />
		{:else if welcome_view_object.in_create_account}
			<CreateAccount {company_data} on:account_created={handleNewUser} />
		{/if}
	</div>

	{#if welcome_view_object.in_how_to_create || welcome_view_object.in_create_account || show_back_button}
		<button id="back-button" on:click={handleBackButton}>Back</button>
	{/if}

	<div id="welcome-footer">
		<div id="footer-text">
			This site is currently under development as we work to provide a more seamless experience to
			our clients and partners. If you encounter any issues or have suggestions for features, please
			drop us an email at <a href="mailto:development@southtexas.software" id="email-text"
				>development@southtexas.software</a
			>
			or just fill out the contact card at
			<a id="link" href="https://southtexas.software/contact-us">southtexas.software/contact-us</a>
		</div>
	</div>
</div>

<style>
	#client-welcome-container {
		flex-basis: 78vw;
		min-height: 70vh;
		background-color: var(--box-color);
		border-radius: var(--box-border-radius);
		margin: 1vh 3vw 5vh 3vw;
		padding: 0 0 5vh 0;
		box-shadow: var(--box-shadow);
		color: black;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		align-self: center;
		transition: all 1s;
	}
	#welcome-title {
		font-family: openSans-boldItalic;
		font-size: 3.5vw;
		color: #526889;
		margin-top: 2vh;
		user-select: none;
	}
	#welcome-body {
		display: flex;
		flex-direction: column;
		flex-grow: 4;
		align-items: center;
		width: 100%;
		position: relative;
	}
	#back-button {
		font-size: 0.8vw;
		width: 4vw;
		align-self: flex-start;
		margin-left: 10vw;
		margin-bottom: 2vh;
		text-align: center;
		font-family: openSans-semiBold;
		color: white;
		background-color: #526889;
		border-radius: 5px;
		height: 1.8vw;
		box-shadow: 0px 1px 2px #464d5b;
		transition: all 0.2s;
		cursor: pointer;
		user-select: none;
		position: relative;
	}
	#welcome-footer {
		width: 80%;
		text-align: center;
		font-family: openSans-light;
		font-size: 1vw;
		user-select: none;
	}
	#email-text {
		text-decoration: none;
		color: black;
	}
	#link {
		text-decoration: none;
		color: #6b88b3;
	}
</style>
