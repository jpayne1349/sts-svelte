<script>
	import { alertStore, sessionStore, fbStore } from '../../stores';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { updateEmail } from 'firebase/auth';
	import { doc, updateDoc } from 'firebase/firestore';

	let dispatch = createEventDispatcher();
	let form_element;
	let email_confirmed = false;

	let new_email_value = '';
	let confirm_email_value = '';

	let submitting_form = false;

	let update_billing = false;

	//@testing only
	let first_pass = true;

	export let external_trigger;

	// happens after a reauthentication process was required
	$: if (external_trigger == true) {
		updateAccountEmail();
		dispatch('retried', 'after_auth');
	}

	if ($sessionStore.email == $sessionStore.billing.email) {
		update_billing = true;
	}

	async function updateAccountEmail() {
		submitting_form = true;

		try {
			//@testing
			// if(first_pass) {
			//     throw {code: 'auth/requires-recent-login'};
			// }

			let updated_user = await updateEmail($fbStore.auth.currentUser, new_email_value);

			// also update the firestore data
			let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);

			if (update_billing) {
				// update both emails on file
				let updatedDoc = await updateDoc(userDocReference, {
					email: new_email_value,
					'billing.email': new_email_value
				});

				let stripe_payload = {
					cuid: $sessionStore.cuid,
					email: new_email_value
				};
				// use our api to update the stripe customer email
				let server_response = await fetch('/client/api/stripe/updateEmail', {
					method: 'POST',
					body: JSON.stringify(stripe_payload),
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

					submitting_form = false;

					return;
				}
			} else {
				// just update the users email in firestore and carry on
				let updatedDoc = await updateDoc(userDocReference, {
					email: new_email_value,
					email_verified: false
				});
			}
			// send new verification email to this new email address..
			let server_response = await fetch('/client/api/generateVerifyEmail', {
				method: 'POST',
				body: JSON.stringify({ email: new_email_value, uid: $sessionStore.uid }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			submitting_form = false;
			// everything will update dynamically, just close the modal
			dispatch('close', 'clicked');
		} catch (e) {
			
			if (e.code == 'auth/requires-recent-login') {
				//@testing
				// first_pass = false;
				// prompts the reauth modal to open/show
				dispatch('reauth', 'required');

				submitting_form = false;
				return;
			}

			alertStore.set({
				show: true,
				error: true,
				message: e.code
			});
			submitting_form = false;
		}

		submitting_form = false;
	}

	function compareInputs() {
		if (new_email_value == confirm_email_value) {
			email_confirmed = true;
		} else {
			email_confirmed = false;
		}
	}
</script>

<div class="modal" in:fly={{ y: -50 }}>
	<h3>Update Account Email</h3>

	<button
		class="close-modal"
		on:click={() => {
			dispatch('close', 'clicked');
		}}
	/>

	<form on:submit|preventDefault={updateAccountEmail} bind:this={form_element}>
		<div class="row">
			<p class="label">Current:</p>
			<p class="data">{$sessionStore.email}</p>
		</div>

		<div class="row">
			<label class="label" for="new-email">New:</label>
			<input
				class="data"
				type="email"
				name="new-email"
				id="new-email"
				autocomplete="email"
				bind:value={new_email_value}
				required
			/>
		</div>

		<div class="row">
			<label class="label" for="confirm-email">Confirm:</label>
			<input
				class="data"
				type="email"
				name="confirm-email"
				id="confirm-email"
				bind:value={confirm_email_value}
				required
				on:input={compareInputs}
			/>
		</div>

		{#if update_billing}
			<p class="billing-email-info">
				It looks like you use your account email for billing notifications. This will update them to
				match again.
			</p>
		{/if}

		<button type="submit" class="save" class:active={email_confirmed}>
			<div id="spinner" class:active={submitting_form} />
			{#if !submitting_form}
				Save
			{:else}
				<span class="button-spinner" />
			{/if}
		</button>

		<p class="info">
			Note: You will no longer be able to log in to this account using the old email address.
		</p>
	</form>
</div>

<style>
	.modal {
		position: absolute;
		width: 400px;

		top: 30vh;
		box-shadow: var(--box-shadow);
		border-radius: 5px;
		background-color: white;
		z-index: 10;
		padding: 25px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	h3 {
		font-family: openSans-bold;
		font-size: 20px;
		color: var(--dark-blue);
		margin-bottom: 25px;
	}
	form {
		display: flex;
		flex-direction: column;
	}
	button.close-modal {
		position: absolute;
		width: 20px;
		height: 20px;
		background-color: transparent;
		box-shadow: none;
		top: 10px;
		right: 10px;
	}
	button.close-modal::before,
	button.close-modal::after {
		content: '';
		position: absolute;
		width: 3px;
		height: 20px;
		border-radius: 2px;
		background-color: var(--dark-blue);
		top: 5px;
		left: 5px;
		transition: all 0.5s 1s;
		transform: rotate(45deg);
	}
	button.close-modal::after {
		transform: rotate(-45deg);
	}
	.row {
		display: flex;
		margin-bottom: 15px;
		align-items: flex-end;
	}
	.label {
		font-family: openSans-light;
		font-size: 18px;
		color: var(--dark-blue);
		width: 75px;
		text-align: end;
	}
	.data {
		font-family: openSans-medium;
		font-size: 16px;
		color: var(--dark-blue);
		margin-left: 5px;
	}
	input {
		height: fit-content;
		font-size: 16px;
		margin-left: 5px;
		padding: 2px 5px;
		width: 250px;
	}
	.billing-email-info {
		font-family: openSans-regular;
		font-size: 12px;
		text-align: center;
	}
	.info {
		font-family: openSans-regular;
		font-size: 12px;
		text-align: center;
		margin-top: 25px;
		margin-bottom: -15px;
	}
	button.save {
		margin-top: 40px;
		width: 300px;
		align-self: center;
		margin-bottom: 0;
		pointer-events: none;
		background-color: var(--bar-blue);
		position: relative;
		user-select: none;
	}
	button.active {
		pointer-events: all;
		background-color: var(--dark-blue);
		cursor: pointer;
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
		margin-left: 10px;
	}
	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
	@media only screen and (max-width: 500px) {
		.label,
		.data,
		input {
			font-size: 16px;
		}
		.billing-email-info {
			margin: 10px 0;
		}
	}
</style>
