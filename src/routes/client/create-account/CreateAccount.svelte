<script>
	import { alertStore, fbStore, sessionStore, loadingStore } from '../stores.js';
	import { enhance } from '$app/forms';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { fade } from 'svelte/transition';
	import { doc, collection, setDoc, Timestamp } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let password_validating = false;
	let password_validated = false;

	let password_confirming = false;
	let password_confirmed = false;

	let password_holder = '';

	let submitting_form = false;
	let form_element;

	// called on each input in the password field
	function checkPassword(event) {
		if (event.target.value.length > 0) {
			password_validating = true;
		} else {
			password_validating = false;
			return;
		}

		if (event.target.value.length < 8) {
			password_validated = false;
			return;
		}

		if (validate_password_string(event.target.value)) {
			password_validated = true;
			password_holder = event.target.value;
		} else {
			password_validated = false;
		}
	}

	// called on each input in the confirm field
	function confirmPassword(event) {
		if (event.target.value.length > 0) {
			password_confirming = true;
		} else {
			password_confirming = false;
		}

		if (event.target.value == password_holder) {
			password_confirmed = true;
		} else {
			password_confirmed = false;
		}
	}

	// used in checkPassword to validate requirements via regex
	function validate_password_string(str) {
		var pattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$');

		if (pattern.test(str)) {
			return true;
		}

		return false;
	}

	async function createAccount(event) {
		if (submitting_form) {
			return;
		}
		// show spinner somewhere and disable the continue button
		submitting_form = true;

		sessionStore.update((data) => {
			data.creatingNewUser = true;

			return data;
		});

		let data = new FormData(form_element);

		let email = data.get('email');
		let password = data.get('password');

		try {
			let newUser = await createUserWithEmailAndPassword($fbStore.auth, email, password);

			let newUserData = {
				creatingNewUser: false,
				logged_in: true,
				uid: newUser.user.uid,
				email: email,
				email_verified: false,
				fullname: '',
				phone: '',
				company_is_seperate: null,
				company_name: '',
				cuid: '',
				address: {
					line1: '',
					line2: '',
					city: '',
					state: '',
					postal_code: '',
					country: 'US'
				},
				service_log: {
					active_links: [],
					preview_links: [],
					code_repo: '',
					latest_event: '',
					events: [
						{
							time: Timestamp.now(),
							description: email + ' created an account.',
							type: 'service',

						}
					]
				},
				subscription: {
					plan: '',
					options: '',
					monthly: '',
					status: '',
					renewal: '',
					id: '',
					message: ''
				},
				default_payment_method: {
					type: '',
					last_four: '',
					id: ''
				},
				billing: {
					use_account_email: true,
					use_company_name: true,
					name: '',
					email: '',
					status: '',
					documents: [
						// { type: 'quote', filename: 'Quote_lkjasdf.pdf' , created: unixTimestamp}
					],
					open_documents: [],
					latest_charge: {
						status:'',
						receiptId:'',
						chargeId:'',
						invoiceId:''
					}
				},
				account_setup: {
					account_info: {
						completed: false
					},
					billing_address: {
						seen: false,
						completed: false
					},
					billing_method: {
						seen: false,
						completed: false
					},
					subscription_service: {
						seen: false,
						completed: false
					}
				},
				service_forms: [],
				navigation: {
					returnBack: false,
					returnTo: ''
				}
			};

			let send_verifiction_email = await verificationEmail(email, newUser.user.id);

			let users_collection = collection($fbStore.db, 'client-portal-user');

			let newUserDocRef = doc(users_collection, newUser.user.uid);

			let createdUserDoc = await setDoc(newUserDocRef, newUserData);
			
			$sessionStore.creatingNewUser = false;
			
			
		} catch (e) {
			alertStore.set({
				message: e.code,
				error: true,
				show: true
			});

			let sendEmail = fetch('/client/api/generateErrorEmail', {
				method: 'POST',
				body: JSON.stringify({
					title: 'Error in Create Account',
					account: 'unknown',
					details: e
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			// reset fields in the form
			form_element.reset();

			password_confirming = false;
			password_confirmed = false;
			password_validating = false;
			password_validated = false;

			submitting_form = false;

			sessionStore.set({
				creatingNewUser: false
			});
		}
	}

	async function verificationEmail(email, uid) {
		let server_response = await fetch('/client/api/generateVerifyEmail', {
			method: 'POST',
			body: JSON.stringify({
				 email: email, 
				 uid: uid,
				 origin: $page.url.origin 
				}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		let responseJson = await server_response.json();

		if (responseJson.error) {
			alertStore.set({
				message: 'Error Sending Verification Email',
				show: true,
				error: true
			});
			return;
		}
	}
</script>

<section class="container" id="sign-in-container">
	<h1 class="container-title">Create an account</h1>

	<form
		method="POST"
		id="sign-in-form"
		on:submit|preventDefault={createAccount}
		bind:this={form_element}
	>
		<label for="email-label" id="email-label" class="label">Email</label>
		<input name="email" id="email-input" class="input" type="email" required autocomplete="email" />

		<div class="label-container">
			<label for="password" class="label">Password </label>
			{#if password_validating == true && password_validated == false}
				<div class="validation-spinner" />
			{:else if password_validated == true && password_validating == true}
				<div class="validation-passed" in:fade />
			{/if}
		</div>
		<input
			name="password"
			id="password-input"
			class="input"
			type="password"
			required
			on:input={checkPassword}
			autocomplete="new-password"
		/>
		<div class="password-reqs">min: 1 uppercase | 1 number | 1 special character | length > 7</div>

		<div class="label-container">
			<label for="password-confirm" class="label">Confirm</label>
			{#if password_confirming == true && password_confirmed == false}
				<div class="validation-spinner" />
			{:else if password_confirming == true && password_confirmed == true}
				<div class="validation-passed" in:fade />
			{/if}
		</div>
		<input
			name="password-confirm"
			id="password-confirm"
			class="input"
			type="password"
			required
			on:input={confirmPassword}
		/>

		<button
			id="submit-sign-in"
			type="submit"
			for="sign-in-form"
			class:available={password_confirmed}
		>
			{#if !submitting_form}
				Continue
			{:else}
				<span class="button-spinner" in:fade />
			{/if}
		</button>
	</form>

	<div class="grey-question">
		Already have an account? <a href="/client/sign-in" class="question-link">Sign in</a>
	</div>
</section>

<style>
	.container {
		min-height: 40vh;
		user-select: none;
	}
	form {
		display: flex;
		flex-direction: column;
		color: var(--bg);
	}

	.label-container {
		display: flex;
		align-items: center;
		margin-bottom: 1vh;
	}
	.label {
		font-family: openSans-semibold;

		position: relative;
	}
	.label#email-label {
		margin-bottom: 1vh;
	}
	input {
		margin-bottom: 2vh;
	}
	input#password-input {
		margin-bottom: 0;
	}
	.password-reqs {
		font-family: openSans-semibold;
		font-size: 10px;
		color: var(--text);
		margin-bottom: 1.8vh;
	}

	.grey-question {
		margin-top: 5vh;
	}
	button {
		margin-top: 3vh;
		filter: opacity(0.5);
		pointer-events: none;
		user-select: none;
		transition: all 0.3s;
	}
	button.available {
		filter: none;
		pointer-events: all;
		cursor: pointer;
	}
	.validation-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid var(--bg);
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
	.validation-passed {
		content: '';
		width: 0.6vh;
		height: 1.1vh;
		border-bottom: 3px solid var(--global-green);
		border-right: 3px solid var(--global-green);
		transform: rotate(35deg);
		margin-left: 10px;
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
		margin-left: 0px;
	}

	@media only screen and (max-width: 500px) {
		input {
			margin-bottom: 4vh;
		}
		.password-reqs {
			font-size: 2.5vw;
		}
		button {
			margin-top: 2vh;
		}
		.validation-spinner {
			width: 1.5vh;
			height: 1.5vh;
			border-top: 1px solid var(--link);
			border-right: 1px solid transparent;
		}
		.validation-passed {
			width: 0.8vh;
			height: 1.5vh;
			border-bottom: 3px solid var(--global-green);
			border-right: 3px solid var(--global-green);
		}
		.button-spinner {
			width: 20px;
			height: 20px;
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
