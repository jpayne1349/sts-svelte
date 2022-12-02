<script>
	import { fade, fly } from 'svelte/transition';
	import { alertStore, sessionStore, fbStore, loadingStore } from '../../stores';
	import { updateDoc, doc, Timestamp, arrayUnion } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let form_element;
	let submitting_form = false;
	let company_in_system = false;

	onMount(() => {
		loadingStore.set({ show: false });
	});

	async function addAccountInfo() {
		submitting_form = true;

		let data = new FormData(form_element);

		let fullname = data.get('fullname');
		let phone = data.get('phone');
		let company_name = data.get('company-name');
		//TODO: company-id

		if (!$sessionStore.company_is_seperate) {
			company_name = fullname;
		}

		let account_info = {
			fullname: fullname,
			phone: phone,
			email: $sessionStore.email,
			company_is_seperate: $sessionStore.company_is_seperate,
			company_in_system: company_in_system,
			company_name: company_name
			//company_id: company_id
		};

		if ($sessionStore.cuid == '') {
			// hit api with info and await response TODO: company-in-system functionality
			let server_response = await fetch('/client/api/stripe/createCustomer', {
				method: 'POST',
				body: JSON.stringify(account_info),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			let responseJson = await server_response.json();

			if (responseJson.error) {
				alertStore.set({
					message: responseJson.code,
					show: true,
					error: true
				});

				let sendEmail = fetch('/client/api/generateErrorEmail', {
					method: 'POST',
					body: JSON.stringify({
						title: 'Error Creating Stripe Customer',
						account: $sessionStore.email,
						details: responseJson.code
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				});

				return;
			}

			// else, response was valid and customer was created, use this to add to/create firebase documents
			let new_customer_id = responseJson.cuid;
			// create customer doc
			
			// update user doc
			let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);
			let updatedUserDoc = await updateDoc(userDocReference, {
				cuid: new_customer_id,
				'account_setup.account_info.completed': true,
				fullname: fullname,
				phone: phone,
				company_is_seperate: $sessionStore.company_is_seperate,
				company_in_system: company_in_system,
				company_name: company_name,
				'service_log.events': arrayUnion({
					time: Timestamp.now(),
					description: $sessionStore.email + ' updated account info.',
					type: 'service'
				})
			});
		} else {
			// this runs if if we're updating an existing customers profile
			// we don't touch the billing name or anything with stripe, as that is only affected in billing_address and billing_method
			if (company_name != $sessionStore.company_name) {
				alertStore.set({
					show: true,
					error: false,
					message: 'Company Name Changed!'
				});
			}

			let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);
			let updatedUserDoc = await updateDoc(userDocReference, {
				fullname: fullname,
				phone: phone,
				company_is_seperate: $sessionStore.company_is_seperate,
				company_in_system: company_in_system,
				company_name: company_name,
				'navigation.returnBack': true,
				'navigation.returnTo': '/client/portal/profile',
				'service_log.events': arrayUnion({
					time: Timestamp.now(),
					description: $sessionStore.email + ' changed company name.',
					type: 'service'
				})
			});

			let previousPage = $sessionStore.navigation.returnTo;

			let returnTo = await goto(previousPage);
			submitting_form = false;

			return;
		}

		let nextpage = await goto('/client/setup/billing_address');

		submitting_form = false;
	}
</script>

<section class="container" id="account_info">
	<h2 class="container-title">Account Info</h2>

	<form
		method="POST"
		id="account_info-form"
		on:submit|preventDefault={addAccountInfo}
		bind:this={form_element}
	>
		<label for="fullname-input" class="label">Full Name</label>
		<input
			name="fullname"
			id="fullname-input"
			class="input"
			type="text"
			autocomplete="name"
			required
			value={$sessionStore.fullname}
		/>

		<label for="phone-input" class="label">Phone</label>
		<input
			name="phone"
			id="phone-input"
			class="input"
			type="tel"
			autocomplete="tel"
			value={$sessionStore.phone}
		/>

		<div class="checkbox-container">
			<input
				name="not-company"
				id="not-company"
				type="checkbox"
				class="checkbox"
				bind:checked={$sessionStore.company_is_seperate}
			/>
			<label id="not-company-label" for="not-company" class="checkbox-label"
				>I am associated with a company</label
			>
		</div>

		{#if $sessionStore.company_is_seperate == true}
			<div class="checkbox-container" in:fly={{ y: -20 }}>
				<input
					name="remember"
					type="checkbox"
					class="checkbox"
					id="remember-check"
					bind:checked={company_in_system}
				/>
				<label id="remember-label" for="remember-check" class="checkbox-label"
					>My company is already in the system</label
				>
			</div>
		{/if}

		{#if $sessionStore.company_is_seperate == true && company_in_system == false}
			<label for="company-name-input" class="label" in:fly={{ y: -20 }}>Company Name</label>
			<input
				name="company-name"
				id="company-name-input"
				class="input"
				type="text"
				in:fly={{ y: -20 }}
				value={$sessionStore.company_name}
			/>
		{/if}

		<!-- TODO: needs a confirm/verify button to check if this exists... -->
		{#if $sessionStore.company_is_seperate == true && company_in_system == true}
			<label for="company-id-input" class="label" in:fly={{ y: -20 }}>Company Unique ID</label>
			<input
				name="company-id"
				id="company-id-input"
				class="input"
				type="text"
				in:fly={{ y: -20 }}
			/>
		{/if}

		<button id="submit-sign-in" type="submit" for="sign-in-form">
			{#if !submitting_form}
				Continue
			{:else}
				<span class="button-spinner" in:fade />
			{/if}
		</button>
	</form>
</section>

<style>
	.container {
		min-height: 40vh;
	}
	form {
		display: flex;
		flex-direction: column;
		color: var(--main);
		padding: 25px;
		font-size: 18px;
	}
	.label {
		font-family: openSans-semibold;
		margin-bottom: 1vh;
	}
	input {
		margin-bottom: 2vh;
	}
	.checkbox-container {
		display: flex;
		align-items: center;
		font-family: openSans-semibold;
		color: var(--main);
		margin-bottom: 2vh;
		user-select: none;
	}
	.checkbox-label {
		font-size: 15px;
	}
	button {
		cursor: pointer;
		user-select: none;
		margin-top: 2vh;
	}
	.button-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid white;
		border-right: 2px solid transparent;
		width: 1vh;
		height: 1vh;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 10px;
	}

	@media only screen and (max-width: 500px) {
		input,
		.checkbox-container {
			margin-bottom: 4vh;
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
