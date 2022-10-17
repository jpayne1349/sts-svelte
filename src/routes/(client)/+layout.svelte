<svelte:head>
	<title>
		Client Portal | SouthTexas.Software
	</title>
	<meta name='description' 
	content="Client access to manage profile, billing, services, and secure messaging.">
</svelte:head>

<script>
	// eventually many things will happen here to check user login status, redirect, etc.
	import '../../client_app.css';
	import ClientNavigationBar from '../../components/ClientPortal/ClientNavigationBar.svelte';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import ClientWelcome from '../../components/ClientPortal/ClientWelcomeWindow/ClientWelcome.svelte';
	import { initFirebaseClient } from '../../initFirebaseClient';
	import { getAuth } from 'firebase/auth';
	import { doc, getDocs, getDoc, collection, query, where } from 'firebase/firestore';
	import { browser } from '$app/environment';

	// default session data
	let session_data = {
		logged_in: false,
		creating_new_user: false,
		firebaseApp: null,
		firebaseDb: null,
		company_data: {},
		user_data: {},
		auth_data: {}
	};

    let auto_logging_in = false; // passed to the sign in button to help show animation during auto-login process...

	// default store with data created
	let session_store = writable(session_data);

	// try to connect to firebase
	async function connectToFirebase() {
		if (!browser) {
			return;
		}

		let firebase = await initFirebaseClient();

		session_data.firebaseApp = firebase.app;
		session_data.firebaseDb = firebase.db;

		session_store.set(session_data);

		let auth = getAuth(firebase.app);
		session_data.auth_data = auth;

		auth.onAuthStateChanged(async () => {

            if (auth.currentUser != null) {
				auto_logging_in = true;
				retrieveLoggedInUserInfo();
			} else {
                // user logged out

				auto_logging_in = false;
				session_data.logged_in = false;
				session_data.company_data = {};
				session_data.user_data = {};

				session_store.set(session_data);
			}
		});
	}

	async function retrieveLoggedInUserInfo() {

		// check to see if currently creating a new user, if so, try to retreive this data later
		if(session_data.creating_new_user == true) {
			return setTimeout(retrieveLoggedInUserInfo, 100);
		}

		let logged_in_user_data;
		let logged_in_company_data;

		const user_collection = collection(session_data.firebaseDb, 'client-user');
		const userQuery = query(user_collection, where('uid', '==', session_data.auth_data.currentUser.uid));
		const queryResults = await getDocs(userQuery);

		queryResults.forEach((userDoc) => {
			logged_in_user_data = userDoc.data();
		});

		const companyDocRef = doc(session_data.firebaseDb, 'client-company', logged_in_user_data.cid);
		const companyDoc = await getDoc(companyDocRef);

		if (companyDoc.exists()) {
			logged_in_company_data = companyDoc.data();
		}

		session_data.logged_in = true;
		session_data.company_data = logged_in_company_data;
		session_data.user_data = logged_in_user_data;

		session_store.set(session_data);

        auto_logging_in = false;

		
	}

	let context = setContext('session_store', session_store);

	// ***
	connectToFirebase();

	let active_view = 'home';
</script>

    <ClientNavigationBar {active_view} {auto_logging_in} />

{#if session_data.logged_in}
	<slot />
{:else}
	<ClientWelcome />
{/if}

<style>
</style>
