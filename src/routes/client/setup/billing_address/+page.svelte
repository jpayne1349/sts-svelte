<script>
	import { sessionStore, alertStore, fbStore } from '../../stores';
	import { fly } from 'svelte/transition';
	import { updateDoc, doc, Timestamp, arrayUnion } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	let submitting_form = false;
	let settingUpLater = false;
	let form_element;
	let use_account_email = true;
	let use_company_name = true;

	// for binding elements to
	let address_line1;
	let address_line2;
	let city;
	let state;
	let postal_code;
	let billing_email;
	let billing_name;

	async function addBillingAddress() {
		submitting_form = true;

		if (!validateFields()) {
			submitting_form = false;
			return;
		}

		let update_customer = {
			address: {
				line1: address_line1.value,
				line2: address_line2.value,
				city: city.value,
				state: state.value,
				postal_code: postal_code.value,
				country: 'US'
			}
		};

		if ($sessionStore.billing.use_account_email == false) {
			update_customer.email = billing_email.value;
		} else {
			update_customer.email = $sessionStore.email;
		}

		if ($sessionStore.billing.use_company_name == false) {
			update_customer.name = billing_name.value;
		} else {
			update_customer.name = $sessionStore.company_name;
		}

		// add customer id for server lookup
		let customer_id = $sessionStore.cuid;

		let server_response = await fetch('/client/api/stripe/updateCustomer', {
			method: 'POST',
			body: JSON.stringify({ customer_id, update_customer }),
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
					title: 'Error Updating Stripe Customer Address',
					account: $sessionStore.email,
					details: responseJson.code
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return;
		}

		let billingUpdateEvent = {
			time: Timestamp.now(),
			description: $sessionStore.email + ' updated billing information.',
			type: 'billing'
		}

		let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);
		if ($sessionStore.address.line1 == '') {
			let updatedUserDoc = await updateDoc(userDocReference, {
				'account_setup.billing_address.seen': true,
				'account_setup.billing_address.completed': true,
				address: update_customer.address,
				'billing.name': update_customer.name,
				'billing.email': update_customer.email,
				'billing.use_account_email': $sessionStore.billing.use_account_email,
				'billing.use_company_name': $sessionStore.billing.use_company_name,
				'service_log.events': arrayUnion(billingUpdateEvent)

			});
		} else {
			let updatedUserDoc = await updateDoc(userDocReference, {
				address: update_customer.address,
				'billing.name': update_customer.name,
				'billing.email': update_customer.email,
				'billing.use_account_email': $sessionStore.billing.use_account_email,
				'billing.use_company_name': $sessionStore.billing.use_company_name,
				'navigation.returnBack': true,
				'navigation.returnTo': '/client/portal/billing',
				'service_log.events': arrayUnion(billingUpdateEvent)
			});

			let yeet = goto($sessionStore.navigation.returnTo);

			return;
		}

		let nextpage = await goto('/client/setup/billing_method');

		submitting_form = false;
	}

	// sets a flag and returns false if trying to 'continue' with empty fields
	function validateFields() {
		let flag = true;

		if (!address_line1.value) {
			address_line1.classList.add('required');
			flag = false;
		}
		if (!city.value) {
			city.classList.add('required');
			flag = false;
		}
		if (!state.value) {
			state.classList.add('required');
			flag = false;
		}
		if (!postal_code.value) {
			postal_code.classList.add('required');
			flag = false;
		}

		return flag;
	}

	async function setUpLater() {
		settingUpLater = true;

		let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);

		let updatedUserDoc = await updateDoc(userDocReference, {
			'account_setup.billing_address.seen': true
		});

		let nextPage = await goto('/client/setup/billing_method');
	}
</script>

<section class="container" id="billing_address">
	<h2 class="container-title">Billing Info</h2>
	<h3 class="container-subtitle">Address</h3>

	<form method="POST" id="billing_address-form" bind:this={form_element}>
		<label for="line-one-input" class="label">Line 1</label>
		<input
			name="line-one"
			id="line-one-input"
			class="input"
			type="text"
			autocomplete="address-line1"
			bind:this={address_line1}
			class:required={false}
			value={$sessionStore.address.line1}
		/>

		<label for="line-two-input" class="label">Line 2</label>
		<input
			name="line-two"
			id="line-two-input"
			class="input"
			type="text"
			autocomplete="address-line2"
			bind:this={address_line2}
			value={$sessionStore.address.line2}
		/>

		<label for="city-input" class="label">City</label>
		<input
			name="city"
			id="city-input"
			class="input"
			type="text"
			bind:this={city}
			class:required={false}
			value={$sessionStore.address.city}
		/>

		<div class="double-input-container">
			<div class="double-input">
				<label for="state-input" class="label">State</label>
				<input
					name="state"
					id="state-input"
					class="input"
					type="text"
					bind:this={state}
					class:required={false}
					value={$sessionStore.address.state}
				/>
			</div>
			<div class="double-input">
				<label for="postal-code-input" class="label">Postal Code</label>
				<input
					name="postal-code"
					id="postal-code"
					class="input"
					type="text"
					autocomplete="postal-code"
					bind:this={postal_code}
					class:required={false}
					value={$sessionStore.address.postal_code}
				/>
			</div>
		</div>

		<div class="checkbox-container">
			<input
				name="use-account-email"
				id="use-account-email"
				type="checkbox"
				class="checkbox"
				bind:checked={$sessionStore.billing.use_account_email}
			/>
			<label id="use-account-email-label" for="use-account-email" class="checkbox-label"
				>Use <span class="dynamic-text">{$sessionStore.email}</span> for billing notifications</label
			>
		</div>

		{#if $sessionStore.billing.use_account_email == false}
			<label for="billing-email-input" class="label" in:fly={{ y: -20 }}>Billing Email</label>
			<input
				name="billing-email"
				id="billing-email-input"
				class="input"
				type="email"
				autocomplete="email"
				in:fly={{ y: -20 }}
				bind:this={billing_email}
				value={$sessionStore.billing.email}
			/>
		{/if}

		<div class="checkbox-container">
			<input
				name="use-company-name"
				type="checkbox"
				class="checkbox"
				id="use-company-name"
				bind:checked={$sessionStore.billing.use_company_name}
			/>
			<label id="use-company-name-label" for="use-company-name" class="checkbox-label"
				>Use the name <span class="dynamic-text">{$sessionStore.company_name}</span> for billing paperwork</label
			>
		</div>

		{#if $sessionStore.billing.use_company_name == false}
			<label for="billing-name-input" class="label" in:fly={{ y: -20 }}>Billing Name</label>
			<input
				name="billing-name"
				id="billing-name-input"
				class="input"
				type="text"
				in:fly={{ y: -20 }}
				autocomplete="name"
				bind:this={billing_name}
				value={$sessionStore.billing.name}
			/>
		{/if}

		<div class="double-button-container">
			<button id="set-up-later" on:click|preventDefault={setUpLater}>
				{#if settingUpLater}
					<div class='button-spinner'></div>
				{:else}
					Set Up Later
				{/if}
				
			</button>

			<button
				id="submit-sign-in"
				type="submit"
				for="sign-in-form"
				on:click|preventDefault={addBillingAddress}
			>
				{#if !submitting_form}
					Continue
				{:else}
					<span class="button-spinner" />
				{/if}
			</button>
		</div>
	</form>
</section>

<style>
	.double-input-container {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	.double-input {
		display: flex;
		flex-direction: column;
	}
	.double-input input {
		width: 120px;
	}
	form {
		display: flex;
		flex-direction: column;
		color: var(--main);
	}
	.label {
		font-family: openSans-semibold;
		margin-bottom: 1vh;
	}
	input {
		margin-bottom: 2vh;
	}
	input.required {
		border-color: var(--alert-red);
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
		font-size: 13px;
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
		width: 15px;
		height: 15px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
	}
	.double-button-container {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}
	.double-button-container button {
		width: 45%;
		height: 35px;
	}
	#set-up-later {
		background-color: var(--button-light-blue);
	}
	.dynamic-text {
		color: var(--button-light-blue);
	}

	@media only screen and (max-width: 500px) {
		input,
		.checkbox-container {
			margin-bottom: 2vh;
		}
		.double-input input {
			width: 35vw;
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
