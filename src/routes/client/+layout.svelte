<script>
	import PageLoading from './components/PageLoading.svelte';
	import Alert from './components/Alert.svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import {
		alertStore,
		fbStore,
		stripeStore,
		sessionStore,
		loadingStore,
		email_verification,
		signInRedirectStore
	} from './stores.js';
	import { browser } from '$app/environment';
	import { initFirebaseClient } from '../../initFirebaseClient';
	import { loadStripe } from '@stripe/stripe-js';
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import { doc, getDoc, onSnapshot } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { stripeConfig } from '../../config';

	let connecting = true;
	let connected = false;

	let dev_loggedInUser;

	// used for the load in process
	let initial_auth_updated = false;

	initializeClientConnections();

	// calls connect, and sets up auth state change listener, will call loginAuthorizedUser if state is correct
	function initializeClientConnections() {
		if (browser) {
			connect()
				.then((fb) => {
					// create the state change listener
					onAuthStateChanged(fb.auth, authStateChangeCallback);
				})
				// handles and retries if there was an issue connected to firebase on the client
				.catch((error) => {
					//console.log(error);
					// set an error message
					alertStore.set({
						error: true,
						show: true,
						message: 'Database Connection Error: Attempt Reconnect'
					});

					// wait 4 seconds, display message, then retry
					setTimeout(() => {
						alertStore.set({
							error: false,
							show: true,
							message: 'Attempting to Reconnect to Database'
						});
					}, 4000);
					setTimeout(() => {
						initializeClientConnections();
					}, 8000);
				});
		}
	}

	// asynchonously sets the global stores to the connections. also should be where we wait for authStatechange initially?
	async function connect() {
		return new Promise(async (resolve, reject) => {
			let firebase = await initFirebaseClient();

			if (firebase.error) {
				// TODO: show an error message that the services are currently down..
				connected = false;
				reject('Database Connection Error');
			}

			fbStore.set(firebase);

			let stripe = loadStripe(stripeConfig.publicKey);

			stripeStore.set(stripe);

			connecting = false;

			connected = true;

			resolve(firebase);
		});
	}

	/**
	 * Manages access to routes if auth state changes, initial state change after login should redirect dynamically.
	 **/
	async function authStateChangeCallback() {
		// if a new user is being created, we should wait to do the lookup of their new database information
		if ($sessionStore.creatingNewUser) {
			//console.log('creatingNewUser - retry in 1000');
			setTimeout(authStateChangeCallback, 1000);

			return;
		}

		if ($fbStore.auth.currentUser != null) {
			try {
				//setup the document listener for this user to update the sessionStore
				let userDocRef = doc($fbStore.db, 'client-portal-user', $fbStore.auth.currentUser.uid);

				// this should only be 'setup' once. ie, when the user is initially logged in
				const unsub_listener = onSnapshot(userDocRef, async (userDoc) => {
					//console.log('firebase snapshot listener fired');
					let updated_firebase_data = userDoc.data();
					//console.log('Firebase listener fired: ', updated_firebase_data);

					if (updated_firebase_data == undefined) {
						sessionStore.set({});
						signOutUser();
						return;
					}

					// flips the events list to be chronological -> newest first
					updated_firebase_data.service_log.events.reverse();
					updated_firebase_data.billing.documents.reverse();

					sessionStore.set(updated_firebase_data);

					// handle redirects after signIn, if set
					if ($signInRedirectStore.url != '') {
						//console.log('redirect store url set, redirecting now');
						let tempRedirectPath = $signInRedirectStore.url;
						$signInRedirectStore.url = '';

						let signInRedirect = await goto(tempRedirectPath);

						if (!initial_auth_updated) {
							initial_auth_updated = true;
							loadingStore.set({ show: false });
						}
					}

					let setupIsIncomplete = await redirectUserToCompleteSetup(updated_firebase_data);
					if (setupIsIncomplete) {
						//console.log('setup is incomplete bro');
						return;
					} else {
						// setup is complete
						// if passed setup and following a public link -> /client/sign-in , etc
						// redirect to portal overview
						if (
							$page.url.pathname == '/client' ||
							$page.url.pathname == '/client/sign-in' ||
							$page.url.pathname == '/client/create-account'
						) {
							let overviewPage = await goto('/client/portal/overview');
						}
					}

					// all other checks fallen through, render requested page for authorized user.

					if (!initial_auth_updated) {
						initial_auth_updated = true;
						loadingStore.set({ show: false });
					}
				});
			} catch (e) {
				console.warn('ERROR LOADING AUTH.CURRENTUSER', e);

				alertStore.set({
					error: true,
					show: true,
					message: 'Error in automatic sign in'
				});

				let sendEmail = fetch('/client/api/generateErrorEmail', {
					method: 'POST',
					body: JSON.stringify({
						title: 'Error in automatic sign in',
						account: 'unknown',
						details: e
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				});

				//console.log('CALLING SIGN OUT USER TO RESET');

				signOutUser();

				if (!initial_auth_updated) {
					initial_auth_updated = true;
					loadingStore.set({ show: false });
				}
			}
		} else {
			// user is null, not authenticated

			// if requesting a public route, pass through
			if (
				$page.url.pathname == '/client' ||
				$page.url.pathname == '/client/sign-in' ||
				$page.url.pathname == '/client/create-account'
			) {
				// signal that the first auth state change is complete
				if (!initial_auth_updated) {
					initial_auth_updated = true;
					loadingStore.set({ show: false });
				}
			} else {
				// set redirect store and push navigation to sign in first
				$signInRedirectStore.url = $page.url.pathname;

				alertStore.set({
					error: false,
					show: true,
					message: 'Sign In Required'
				});

				let redirect_page = await goto('/client/sign-in');

				// signal that the first auth state change is complete
				if (!initial_auth_updated) {
					initial_auth_updated = true;
					loadingStore.set({ show: false });
				}
			}

			dev_loggedInUser = null;
		}
	}

	/**
	 * Checks the updated sessionStore.account_setup booleans and redirects user to next UNSEEN step
	 * **/
	async function redirectUserToCompleteSetup(retrievedData) {
		//console.log(retrievedData);
		if (retrievedData.account_setup.account_info.completed == false) {
			let next_page = await goto('/client/setup/account_info');

			if (!initial_auth_updated) {
				initial_auth_updated = true;
				loadingStore.set({ show: false });
			}

			return true;
		}
		if (retrievedData.account_setup.billing_address.seen == false) {
			let next_page = await goto('/client/setup/billing_address');

			if (!initial_auth_updated) {
				initial_auth_updated = true;
				loadingStore.set({ show: false });
			}

			return true;
		}
		if (retrievedData.account_setup.billing_method.seen == false) {
			let next_page = await goto('/client/setup/billing_method');

			if (!initial_auth_updated) {
				initial_auth_updated = true;
				loadingStore.set({ show: false });
			}
			//console.log('havent seen billing method');
			return true;
		}
		if (retrievedData.account_setup.subscription_service.seen == false) {
			let next_page = await goto('/client/setup/subscription_service');

			if (!initial_auth_updated) {
				initial_auth_updated = true;
				loadingStore.set({ show: false });
			}

			return true;
		}

		return false;
	}

	async function signOutUser() {
		let response = await signOut($fbStore.auth);

		let next_page = await goto('/client/sign-in');

		sessionStore.set({});

		//console.log('SIGNED USER OUT');
	}

	// bound to match the with of the navbar element, which reflects the window width basically.
	let window_width;
</script>

<header class="client-portal-header">
	<h1 class="client-portal-title">
		{#if $sessionStore.logged_in}
			<a href="/client/portal/overview">Client Portal</a>
		{:else}
			<a href="/client">Client Portal</a>
		{/if}
	</h1>

	<!-- DEV ONLY -->
	<!-- <p class="dev">test-user: {dev_loggedInUser}</p> -->

	<button class="log-out" on:click={signOutUser} class:available={$sessionStore.logged_in}>
		<img src="/sign-out-icon.svg" alt="Log Out" />
	</button>
</header>

<div class="content">
	<PageLoading />
	{#if connecting == false && initial_auth_updated == true}
		<slot />
	{/if}
</div>

<!-- dynamically filling and shown via the alertStore global -->
<Alert />

<style>
	.content {
		width: 80vw;
		min-height: 70vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.client-portal-header {
		display: flex;
		width: 500px;
		margin-top: 1vh;
		justify-content: space-between;
		align-items: center;
	}
	.client-portal-title a {
		font-family: openSans-extrabold;
		color: var(--secondary);
		font-size: 24px;
	}
	.log-out {
		background-color: transparent;
		box-shadow: none;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		pointer-events: none;
		opacity: 0;
		transition: all 0.5s;
		margin-bottom: 0;
		margin-left: 15px;
	}
	.log-out.available {
		pointer-events: all;
		opacity: 1;
	}

	@media only screen and (max-width: 500px) {
		.content {
			width: 80vw;
			min-height: 70vh;
		}

		.client-portal-header {
			width: 100vw;
			margin-top: 10px;
			position: relative;

			align-self: flex-start;
			padding: 0 15px;
			z-index: 15;
		}
		.client-portal-title {
			font-family: openSans-extrabold;
			color: var(--main);
			font-size: 5vw;
		}
		.log-out {
			margin-right: 15px;
		}
	}

	@media (prefers-color-scheme: dark) {
	}
</style>
