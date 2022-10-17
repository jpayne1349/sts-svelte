<script>
	import StyledInput from '../StyledInput.svelte';
	import CompanyQuestions from './CompanyQuestions.svelte';
	import HowToCreate from './HowToCreate.svelte';
	import InitialView from './InitialView.svelte';
	import { fade } from 'svelte/transition';
	import CreateAccount from './CreateAccount.svelte';
	import { getContext } from 'svelte';

	import { collection, doc, getDoc ,addDoc, updateDoc } from 'firebase/firestore';

	let session_store = getContext('session_store');

    let session_data = {};

    session_store.subscribe((data) => {
        session_data = data;
    });

	let welcome_view_object = {
		in_initial_view: false,
		in_company_questions: true,
		in_how_to_create: false,
		in_create_account: false,
		in_profile_loading: false
	};

	let show_back_button = false;

	// passed up from the companyQuestions
	let company_data;
	let previously_filled_info;
	$: {previously_filled_info = company_data;}

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

		welcome_view_object.in_create_account = false;
		welcome_view_object.in_profile_loading = true;

		// references to our db tables
		const client_user_collection = collection(session_data.firebaseDb, 'client-user');
		const client_company_collection = collection(session_data.firebaseDb, 'client-company');

		// actually db call with appropriate information
        const userDocRef = await addDoc(client_user_collection, { 
            uid: new_user_uid,
            name: new_user_name,
            email: new_user_email,

        });
        
        let companyDocRef;

        if(company_data.company_name_entered){
            companyDocRef = await addDoc(client_company_collection, {
                company_info: {
                    name: company_data.company_name,
                    type: 'seperate',
                    email: '',
                    phone: '',
                    plan: '',
                    plan_description: '',
                    active_links: '',
                    repository: '',
                    billing: {
                        name: '',
                        address: '',
                        due_date: 0,
                        card: '',
                        ccv: '',
                        cycle: '',
                    }
                },
                user_list: [userDocRef.id],
                event_list: []
            });
        } else if(!company_data.company_is_associated) {
            companyDocRef = await addDoc(client_company_collection,{
                company_info: {
                    name: '',
                    type: 'self',
                    email: new_user_email,
                    phone: '',
                    plan: '',
                    plan_description: '',
                    active_links: '',
                    repository: '',
                    billing: {
                        name: '',
                        address: '',
                        due_date: 0,
                        card: '',
                        ccv: '',
                        cycle: '',
                    }
                },
                user_list: [userDocRef.id],
                event_list: []
            });
        } 

        // update the newly created user to include a company doc id field
        await updateDoc(userDocRef, { cid: companyDocRef.id});

        // updating a global state to notify other processes that the new user if finished being created
		session_store.update((existing_data)=>{existing_data.creating_new_user = false; return existing_data;});

        // rest of page should react    


	}

	function handleBackButton() {
		if(welcome_view_object.in_how_to_create) {
			welcome_view_object.in_how_to_create = false;
			welcome_view_object.in_company_questions = true;
		}
		if(welcome_view_object.in_create_account) {
			welcome_view_object.in_create_account = false;
			show_back_button = true;
			setTimeout(()=> { 
				welcome_view_object.in_how_to_create = true;
				show_back_button = false; // this is a weird work-around to make this transition smoother..
			}, 200);;
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
			<HowToCreate {company_data} on:sts_account={handleStsAccountShow}/>
		{:else if welcome_view_object.in_create_account}
			<CreateAccount {company_data} on:account_created={handleNewUser}/>
		{/if}
	</div>
	
	{#if welcome_view_object.in_how_to_create || welcome_view_object.in_create_account || show_back_button }
	<button id='back-button' on:click={handleBackButton} >Back</button>
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
