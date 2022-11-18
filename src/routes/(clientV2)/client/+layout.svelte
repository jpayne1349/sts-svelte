<script>
	import '../../../client_app.css';
	import MobileNav from '../components/MobileNav.svelte';
	import PageLoading from '../components/PageLoading.svelte';
	import Alert from '../components/Alert.svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import {
		alertStore,
		fbStore,
		stripeStore,
		sessionStore,
		loadingStore,
		email_verification
	} from './stores.js';
	import { browser } from '$app/environment';
	import { initFirebaseClient } from '../../../initFirebaseClient';
	import { loadStripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_TEST_KEY } from '$env/static/public';
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import { doc, getDoc, onSnapshot } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

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
					console.log(error);
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

			let stripe = loadStripe(PUBLIC_STRIPE_TEST_KEY);

			stripeStore.set(stripe);

			connecting = false;

			connected = true;

			resolve(firebase);
		});
	}


	async function authStateChangeCallback() {
		console.log('auth state change callback called');
		
		// check if a new user is being created
		if ($sessionStore.creatingNewUser) {

			setTimeout(authStateChangeCallback, 1000);

			return;
		}


		if ($fbStore.auth.currentUser != null) {
			try {
				//setup the document listener for this user to update the sessionStore
				let userDocRef = doc($fbStore.db, 'client-portal-user', $fbStore.auth.currentUser.uid);

				const unsub_listener = onSnapshot(userDocRef, async (userDoc) => {
					let updated_firebase_data = userDoc.data();
					console.log('Firebase listener fired: ', updated_firebase_data);

					dev_loggedInUser = updated_firebase_data.email;

					updated_firebase_data.service_log.events.reverse();

					sessionStore.set(updated_firebase_data);

					// handle a user who just logged in to verify their email address
					if ($email_verification.url != '') {
						let emailPage = await goto($email_verification.url);
						return;
					}

					if (
						$page.url.pathname == '/client/sign-in' ||
						$page.url.pathname == '/client/create-account' ||
						$page.url.pathname == '/client'
					) {
						// check what setup step is next, if any
						if ($sessionStore.account_setup.account_info.completed == false) {
							let next_page = await goto('/client/setup/account_info');

							if (!initial_auth_updated) {
								initial_auth_updated = true;
								loadingStore.set({ show: false });
							}

							return;
						}
						if ($sessionStore.account_setup.billing_address.seen == false) {
							let next_page = await goto('/client/setup/billing_address');

							if (!initial_auth_updated) {
								initial_auth_updated = true;
								loadingStore.set({ show: false });
							}

							return;
						}
						if ($sessionStore.account_setup.billing_method.seen == false) {
							let next_page = await goto('/client/setup/billing_method');

							if (!initial_auth_updated) {
								initial_auth_updated = true;
								loadingStore.set({ show: false });
							}

							return;
						}
						if ($sessionStore.account_setup.subscription_service.seen == false) {
							let next_page = await goto('/client/setup/subscription_service');

							if (!initial_auth_updated) {
								initial_auth_updated = true;
								loadingStore.set({ show: false });
							}

							return;
						}

						let next_page = await goto('/client/portal/overview');

						if (!initial_auth_updated) {
							initial_auth_updated = true;
							loadingStore.set({ show: false });
						}
					}

					// render the requested page for the authorized user.
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

				console.log('CALLING SIGN OUT USER TO RESET');

				signOutUser();

				if (!initial_auth_updated) {
					initial_auth_updated = true;
					loadingStore.set({ show: false });
				}
			}
		} else {
			// user is null

			// redirect to sign-in if trying to verify email without auth
			if ($page.url.pathname.includes('/client/email_verification/p=')) {
				$email_verification.url = $page.url.pathname;

				alertStore.set({
					show: true,
					error: false,
					message: 'Sign In to Verify Email'
				});

				let redirect_page = await goto('/client/sign-in');
			}
			// redirect to client home
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
				let redirect_page = await goto('/client');

				// signal that the first auth state change is complete
				if (!initial_auth_updated) {
					initial_auth_updated = true;
					loadingStore.set({ show: false });
				}
			}

			dev_loggedInUser = null;
		}
	}

	async function signOutUser() {
		let response = await signOut($fbStore.auth);

		let next_page = await goto('/client/sign-in');

		sessionStore.set({});

		console.log('SIGNED USER OUT');
	}

	// bound to match the with of the navbar element, which reflects the window width basically.
	let window_width;

</script>

<svelte:head>
	<meta name="theme-color" content="#FFFFFF" />
</svelte:head>

<svelte:window bind:innerWidth={window_width} />

{#if window_width > 500}
<div class="navbar" >
	
		<a href="/services" alt="Services">Services</a>
		<a href="/pricing" alt="Services">Pricing</a>

		<div class="logo-wrapper">
			<a href="https://southtexas.software" alt="South Texas Sofware Homepage"
				><img class="logo-img" src="/../../sts-logo-regular.svg" alt="STS Logo" /></a
			>
		</div>

		<a href="/contact-us" alt="Services">Contact</a>
		<a href="/client" alt="Services">Client Portal</a>
</div>
{:else}
		<MobileNav />
{/if}

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

<footer class="footer" >
	<a href="https://southtexas.software/terms-of-us" class="footer-link ">Terms of Use</a>
	<a href="https://southtexas.software/privacy-policy" class="footer-link" transition:fade
		>Privacy Policy</a
	>

	<a href="https://southtexas.software/contact-us" class="footer-link " transition:fade>Contact</a>
</footer>

<!-- dynamically filling and shown via the alertStore global -->
<Alert />

<style>
	.navbar {
		display: flex;
		height: 15vh;
		justify-content: center;
		width: 100%;
		align-items: center;
		
	}
	.navbar a {
		font-family: openSans-medium;
		padding: 0 15px;
		margin-top: 60px;
	}
	.logo-img {
		height: 15vh;
	}

	.content {
		width: 80vw;
		min-height: 70vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.footer {
		display: flex;
		width: 450px;
		justify-content: space-around;
		margin: 3vh 0 5vh 0;
		user-select: none;
	}
	.footer-link {
		color: #858d9a;
		font-size: 10px;
		font-family: openSans-semibold;
	}
	.client-portal-header {
		display: flex;
		width: 500px;
		margin-top: 1vh;
		justify-content: space-between;
		align-items: center;
	}
	.client-portal-title {
		font-family: openSans-extrabold;
		color: var(--dark-blue);
		font-size: 28px;
	}
	.dev {
		font-size: 12px;
		color: grey;
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
		.navbar {
			display: flex;
			height: 10vh;
			justify-content: center;
			align-items: center;
			width: 100%;
		}

		.logo-wrapper img {
			height: 15vh;
		}

		.content {
			width: 80vw;
			min-height: 70vh;
		}
		.footer {
			display: flex;
			width: 80vw;
			justify-content: space-around;
			margin: 7vh 0 3vh 0;
		}
		.footer-link {
			color: #858d9a;
			font-size: 3vw;
			font-family: openSans-semibold;
		}
		.client-portal-header {
			width: 85vw;
			margin-top: 10px;
			position: sticky;
			position: -webkit-sticky;
			top: 0;
			align-self: flex-start;
			margin-left: 3vw;
			z-index: 15;
			
		}
		.client-portal-title {
			font-family: openSans-extrabold;
			color: var(--dark-blue);
			font-size: 5vw;
		}
		.log-out {
			margin-right: 5vw;
		}
	}

	@media (prefers-color-scheme: dark) {
	}
</style>
