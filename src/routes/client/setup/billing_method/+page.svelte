<script>
	import { sessionStore, alertStore, fbStore } from '../../stores';
	import { loadStripe } from '@stripe/stripe-js';
	import { Elements, PaymentElement } from 'svelte-stripe';
	import { PUBLIC_STRIPE_TEST_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { updateDoc, doc, arrayUnion, Timestamp } from 'firebase/firestore';

	let setting_up_intent = false;
	let submitting_form = false;
	let form_element;
	let elements;
	let stripe;
	let show_payment_element = false;
	let intent_code;

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_TEST_KEY);
	});

	async function setupIntent() {
		setting_up_intent = true;

		let payloadObject = {
			cuid: $sessionStore.cuid
		};

		let server_response = await fetch('/client/api/stripe/setupIntent', {
			method: 'POST',
			body: JSON.stringify(payloadObject),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		let jsonResponse = await server_response.json();

		if (jsonResponse.error) {
			// handle error by setting alert
			alertStore.set({
				message: jsonResponse.code,
				show: true,
				error: true
			});

			let sendEmail = fetch('/client/api/generateErrorEmail', {
				method: 'POST',
				body: JSON.stringify({
					title: 'Error in Stripe Setup Intent',
					account: $sessionStore.email,
					details: responseJson.code
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			setting_up_intent = false;
			return;
		}

		intent_code = jsonResponse.intent_code;

		show_payment_element = true;
	}

	async function cancelIntent() {
		if (intent_code) {
			let payloadObject = {
				intent_code: intent_code
			};

			let server_response = await fetch('/client/api/stripe/cancelIntent', {
				method: 'POST',
				body: JSON.stringify(payloadObject),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			let jsonResponse = await server_response.json();

			if (jsonResponse.error) {
				// handle error by setting alert
				alertStore.set({
					message: jsonResponse.code,
					show: true,
					error: true
				});

				let sendEmail = fetch('/client/api/generateErrorEmail', {
					method: 'POST',
					body: JSON.stringify({
						title: 'Error in Stripe Cancel Intent',
						account: $sessionStore.email,
						details: responseJson.code
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				});

				return;
			}
		}
	}

	async function addPaymentMethod() {
		if (submitting_form) {
			return;
		}
		submitting_form = true;

		const saveAttempt = await stripe.confirmSetup({
			elements,
			confirmParams: {
				return_url: 'http://192.168.1.25:5173/client/setup/subscription_service'
			},
			redirect: 'if_required'
		});

		// if fields are empty, etc.
		if (saveAttempt.error) {
			submitting_form = false;
			return;
		}

		let result = saveAttempt.setupIntent;

		switch (result.status) {
			case 'succeeded': {
				storeNewPaymentMethod(result.payment_method);
				break;
			}
			case 'processing': {
				alertStore.set({
					show: true,
					error: false,
					message: 'Verifying - Please Wait'
				});
				setTimeout(addPaymentMethod, 2000);
				break;
			}
			case 'requires_payment_method': {
				alertStore.set({
					show: true,
					error: true,
					message: 'Something went wrong'
				});

				let refresh = await goto('/client/setup/billing_method');
				break;
			}
		}
	}

	async function storeNewPaymentMethod(pm_id) {
		let payloadObject = {
			cuid: $sessionStore.cuid,
			pm_id: pm_id
		};

		let server_response = await fetch('/client/api/stripe/addPaymentMethod', {
			method: 'POST',
			body: JSON.stringify(payloadObject),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		let responseJson = await server_response.json();

		// contains the properties: type, last_four, pm_id, and default

		if (responseJson.error) {
			alertStore.set({
				message: responseJson.code,
				show: true,
				error: true
			});

			let sendEmail = fetch('/client/api/generateErrorEmail', {
				method: 'POST',
				body: JSON.stringify({
					title: 'Error in Stripe addPaymentMethod',
					account: $sessionStore.email,
					details: responseJson.code
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return;
		}

		let new_default_card = {
			type: responseJson.type,
			last_four: responseJson.last_four,
			id: responseJson.pm_id
		};

		let billingUpdateEvent = {
			time: Timestamp.now(),
			description: $sessionStore.email + ' updated default payment method.',
			type: 'billing'
		}

		let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);
		if ($sessionStore.default_payment_method.id == '') {
			// used if this is the first time a payment method has been added.
			let updatedUserDoc = await updateDoc(userDocReference, {
				'account_setup.billing_method.seen': true,
				'account_setup.billing_method.completed': true,
				'billing.status': 'Not Active',
				default_payment_method: new_default_card,
				'service_log.events': arrayUnion(billingUpdateEvent)
			});
		} else {
			// updates to the method don't alter the billing status, as to not interrupt the billing cycle
			let updatedUserDoc = await updateDoc(userDocReference, {
				default_payment_method: new_default_card,
				'navigation.returnBack': true,
				'navigation.returnTo': '/client/portal/billing',
				'service_log.events': arrayUnion(billingUpdateEvent)
			});

			let nextpage = await goto($sessionStore.navigation.returnTo);

			return;
		}

		let nextpage = await goto('/client/setup/subscription_service');
	}

	async function setUpLater() {
		let cancelingIntent = await cancelIntent();

		let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);

		let updatedUserDoc = await updateDoc(userDocReference, {
			'account_setup.billing_method.seen': true
		});

		let nextPage = await goto('/client/setup/subscription_service');
	}
</script>

<section class="container" id="billing_method">
	<h2 class="container-title">Billing Info</h2>
	<h3 class="container-subtitle">Add a payment method</h3>
	<p>
		You may securely save/update your default payment method below. No charges will be applied.
	</p>

	<form
		class="stripe-element-container"
		id="stripe-form"
		on:submit|preventDefault={addPaymentMethod}
		bind:this={form_element}
	>
		<div class="loading-spinner" />
		{#if show_payment_element}
			<Elements
				{stripe}
				clientSecret={intent_code}
				bind:elements
				variables={{
					colorPrimary: '#122745',
					colorText: '#122745',
					colorDanger: '#d39b9b',
					fontFamily: 'Open Sans, system-ui',
					borderRadius: '5px',
					fontWeightNormal: '600'
				}}
			>
				<PaymentElement />
			</Elements>

			<button id="submit-billing_method" type="submit" for="stripe-form" in:fade={{ delay: 1000 }}>
				{#if !submitting_form}
					Save
				{:else}
					<span class="button-spinner" />
				{/if}
			</button>
		{:else}
			<button class="add-card" on:click|preventDefault={setupIntent}>
				{#if setting_up_intent}
					<span class="button-spinner" />
				{:else}
					Add Card
				{/if}
			</button>
		{/if}
	</form>

	<p>
		We require a card on file before starting a monthly plan, not required for one-time payments.
	</p>

	<div class="double-button-container">
		<button id="set-up-later" on:click|preventDefault={setUpLater}>Set Up Later</button>
	</div>
</section>

<style>
	.double-button-container {
		display: flex;
		width: 100%;
		justify-content: center;
	}
	#set-up-later {
		background-color: var(--button-light-blue);
		margin-right: auto;
		width: 100%;
		height: 35px;
	}
	#submit-billing_method {
		width: 120px;
		margin: 15px 0 0px auto;
	}
	p {
		font-family: openSans-semibold;
		font-size: 14px;
		color: var(--main);
		margin-bottom: 2vh;
	}
	.stripe-element-container {
		width: 100%;
		min-height: 430px;

		border-radius: 5px;
		margin-bottom: 2vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		transition: all 0.2s;
	}
	.add-card {
		width: 200px;
		margin: 0;
		background-color: var(--global-green);
	}
	.button-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid white;
		border-right: 2px solid transparent;
		width: 15px;
		height: 15px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
	}

	@media only screen and (max-width: 500px) {
		.stripe-element-container {
			padding: 0;
		}
		#submit-billing_method {
			height: 35px;
		}
	}

	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
