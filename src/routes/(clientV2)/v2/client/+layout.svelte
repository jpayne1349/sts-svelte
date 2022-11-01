<script>
	import '../../../../client_app.css';
	import MenuIcon from '../../components/MenuIcon.svelte';
	import PageLoading from '../../components/PageLoading.svelte';
	import Alert from '../../components/Alert.svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { alertStore, fbStore, stripeStore } from './stores.js';
	import { browser } from '$app/environment';
	import { initFirebaseClient } from '../../../../initFirebaseClient';
	import { loadStripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_TEST_KEY } from '$env/static/public';

	let connecting = true;

	// asynchonously sets the global stores to the connections. also should be where we wait for authStatechange initially?
	async function connect() {
		let firebase = await initFirebaseClient();

		if (firebase.error) {
			// TODO: show an error page, post to backend to send out an email to dev team
		}

        // if auth.currentUser != null, we sign in and perform other fetches etc.

		fbStore.set(firebase);

		let stripe = loadStripe(PUBLIC_STRIPE_TEST_KEY);

		stripeStore.set(stripe);

		connecting = false;

		return;
	}

	if (browser) {
		connect();
	}

	// used for filling the footer
	let page_width;
</script>

<svelte:head>
	<meta name="theme-color" content="#FFFFFF" />
</svelte:head>

<div class="navbar">
	<div class="logo-wrapper">
		<a href="https://southtexas.software" alt="South Texas Sofware Homepage"
			><img src="../../sts-logo-regular.svg" alt="STS Logo" /></a
		>
	</div>

	<MenuIcon />
</div>

<!-- <div class="background-stripe" /> -->

<div class="client-portal-title">Client Portal</div>

<div class="content">
	{#if connecting}
		<PageLoading />
	{:else}
		<slot />
	{/if}
</div>

<div class="footer" bind:clientWidth={page_width}>
	<a href="https://southtexas.software/terms-of-us" class="footer-link ">Terms of Use</a>
	<a href="https://southtexas.software/privacy-policy" class="footer-link" transition:fade
		>Privacy Policy</a
	>
	{#if page_width > 650}
		<a href="https://southtexas.software/contact-us" class="footer-link " transition:fade>Contact</a
		>
	{/if}
</div>

<!-- dynamically filling and shown via the alertStore global -->
<Alert />


<style>
	.navbar {
		display: flex;
		height: 15vh;
		justify-content: center;
		width: 100%;
	}
	.logo-wrapper img {
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
		width: 40vw;
		justify-content: space-around;
        margin-top: 2vh;
	}
	.footer-link {
		color: #858d9a;
		font-size: 0.8vw;
		font-family: openSans-semibold;
	}
	.client-portal-title {
		font-family: openSans-extrabold;
		color: var(--dark-blue);
		font-size: 1.5vw;
		width: 30vw;
		margin-top: 1vh;
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
		}
		.footer-link {
			color: #858d9a;
			font-size: 3vw;
			font-family: openSans-semibold;
		}
		.client-portal-title {
			font-family: openSans-extrabold;
			color: var(--dark-blue);
			font-size: 5vw;
			width: 95vw;
			margin-top: 1vh;
		}
	}

	@media (prefers-color-scheme: dark) {
	}
</style>
