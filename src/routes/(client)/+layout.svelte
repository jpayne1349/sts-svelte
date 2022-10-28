<script>
	// eventually many things will happen here to check user login status, redirect, etc.
	import '../../client_app.css';
	import ClientNavigationBar from '../../components/ClientPortal/ClientNavigationBar.svelte';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import ClientWelcome from '../../components/ClientPortal/ClientWelcomeWindow/ClientWelcome.svelte';
	import { initFirebaseClient } from '../../initFirebaseClient';
	import { getAuth } from 'firebase/auth';
	import { doc, getDocs, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
	import { browser } from '$app/environment';
	import { crossfade } from 'svelte/transition';

	// default session data
	let session_data = {
		logged_in: false,
		creating_new_user: false,
		firebaseApp: null,
		firebaseDb: null,
		company: {},
		user: {},
		auth_data: {},
		live_event_list: []
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
				session_data.company = {};
				session_data.user = {};

				session_store.set(session_data);
			}
		});
	}

	async function retrieveLoggedInUserInfo() {
		// check to see if currently creating a new user, if so, try to retreive this data later
		if (session_data.creating_new_user == true) {
			return setTimeout(retrieveLoggedInUserInfo, 100);
		}

		let logged_in_company_data;

		try {
			let matchedCompanyObject;
			const company_collection = collection(session_data.firebaseDb, 'client-company');

			// so now we have to query the companies and look within user_ids array to see if the company contains this user?
			const company_query = query(
				company_collection,
				where('user_ids', 'array-contains', session_data.auth_data.currentUser.uid)
			);
			const queryResults = await getDocs(company_query);

			// this should only return 1 company.. atleast at this point.
			queryResults.forEach((companyDoc) => {
				logged_in_company_data = companyDoc.data();
				matchedCompanyObject = companyDoc;
			});

			// we're not really doing much with this ref other than getting the matched user below, we could eventually show an admin what users
			// were associated with the company
			const users_collection = collection(
				session_data.firebaseDb,
				'client-company/' + matchedCompanyObject.id + '/users'
			);

			const thisUserReference = doc(users_collection, session_data.auth_data.currentUser.uid);
			const thisUser = await getDoc(thisUserReference);

			// we want all of these available.
			const events_collection = collection(
				session_data.firebaseDb,
				'client-company/' + matchedCompanyObject.id + '/events'
			);
			// const all_events = await getDocs(events_collection);

			let initial_list_fill = true;
			let updated_event_list = [];

			const events_snapshot = onSnapshot(events_collection, (snapshot) => {
				
				snapshot.docChanges().forEach((change) => {
					if (change.type === 'added') {
						let event_object = change.doc.data();
						event_object.eid = change.doc.id;

						updated_event_list = prepend(event_object, session_data.live_event_list);

						session_data.live_event_list = updated_event_list;

						//console.log('Session data updated via event snapshot listener loop:', event_object);
					}

					if (change.type === 'modified') {
						console.log('Event Document Modified:', change.doc.data());
						// TODO: will add later on, in case of an event update like invoicing
					}
				});

				// check if this is first pass and sorts by creation time.
				if (initial_list_fill) {
					session_data.live_event_list.sort((a, b) => {
						return b.created.seconds - a.created.seconds;
					});

					initial_list_fill = false;
				}

				session_store.update((existing_data) => {
					existing_data.live_event_list = updated_event_list;
					//console.log('session store updated via events snapshot');
					return existing_data;
				});
			});

			const thisUserData = thisUser.data();

			session_data.logged_in = true;
			session_data.company = logged_in_company_data;
			session_data.user = thisUserData;

			session_store.set(session_data);
		} catch (e) {
			console.warn('Unable to retrieve logged in user data');
			console.log(e);
			auto_logging_in = false;
		}

		auto_logging_in = false;

		console.log('Session Data: ', session_data);
	}

	let context = setContext('session_store', session_store);

	// ***
	connectToFirebase();

	let active_view = 'home';

	// helper function only
	function prepend(value, array) {
		var newArray = array.slice();
		newArray.unshift(value);
		return newArray;
	}
</script>

<svelte:head>
	<title>Client Portal | SouthTexas.Software</title>
	<meta
		name="description"
		content="Client access to manage profile, billing, services, and secure messaging."
	/>
</svelte:head>

<ClientNavigationBar {active_view} {auto_logging_in} />

{#if session_data.logged_in}
	<slot />
{:else}
	<ClientWelcome />
{/if}

<style>
</style>
