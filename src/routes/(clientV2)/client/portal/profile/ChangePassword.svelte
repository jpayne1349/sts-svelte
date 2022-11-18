<script>
	import { alertStore, sessionStore, fbStore } from '../../stores';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
	import { doc, updateDoc, Timestamp, arrayUnion } from 'firebase/firestore';

	let dispatch = createEventDispatcher();
	let form_element;
	let password_confirmed = false;
	let failed_validation = false;

	let current_password_value = '';
	let new_password_value = '';
	let confirm_password_value = '';

	let submitting_form = false;

	//@testing only
	let first_pass = true;

	async function changePassword() {
		submitting_form = true;

		try {
			//@testing
			// if(first_pass) {
			//     throw {code: 'auth/requires-recent-login'};
			// }

			//validate new password
			if (!checkPassword(new_password_value)) {
				failed_validation = true;
				throw { code: 'Requirements not met' };
			}

			let credential = EmailAuthProvider.credential($sessionStore.email, current_password_value);

			let reauth = await reauthenticateWithCredential($fbStore.auth.currentUser, credential);

			let update_password = await updatePassword($fbStore.auth.currentUser, new_password_value);

			let serviceUpdateEvent = {
				time: Timestamp.now(),
				description: $sessionStore.email + ' updated account password.',
				type: 'service'
			};
			let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);
			let updatedUserDoc = await updateDoc(userDocReference, {
				'service_log.events': arrayUnion(serviceUpdateEvent)
			});

			submitting_form = false;
			// everything will update dynamically, just close the modal
			alertStore.set({
				show: true,
				error: false,
				message: 'Password Change Successful!'
			});

			dispatch('close', 'clicked');
		} catch (e) {
			alertStore.set({
				show: true,
				error: true,
				message: e.code
			});

			let sendEmail = fetch('/client/api/generateErrorEmail', {
				method: 'POST',
				body: JSON.stringify({
					title: 'Error during Password Change',
					account: $sessionStore.email,
					details: e
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			current_password_value = '';
			new_password_value = '';
			confirm_password_value = '';

			submitting_form = false;
		}

		submitting_form = false;
	}

	function compareInputs() {
		if (new_password_value == confirm_password_value) {
			password_confirmed = true;
		} else {
			password_confirmed = false;
		}
	}

	// used in checkPassword to perform the regex check
	function validate_password_string(str) {
		var pattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$');

		if (pattern.test(str)) {
			return true;
		}

		return false;
	}

	function checkPassword(password) {
		if (password.length < 8) {
			return false;
		}
		return validate_password_string(password);
	}
</script>

<div class="modal" in:fly={{ y: -50 }}>
	<h3>Change Account Password</h3>

	<button
		class="close-modal"
		on:click={() => {
			dispatch('close', 'clicked');
		}}
	/>

	<form on:submit|preventDefault={changePassword} bind:this={form_element}>
		<div class="row current">
			<label class="label" for="current-password">Current:</label>
			<input
				class="data"
				type="password"
				name="current-password"
				id="current-password"
				autocomplete="password"
				bind:value={current_password_value}
				required
			/>
		</div>

		<div class="row">
			<label class="label" for="new-password">New:</label>
			<input
				class="data"
				type="password"
				name="new-password"
				id="new-password"
				bind:value={new_password_value}
				required
			/>
		</div>

		<div class="row">
			<label class="label" for="confirm-password">Confirm:</label>
			<input
				class="data"
				type="password"
				name="confirm-password"
				id="confirm-password"
				bind:value={confirm_password_value}
				required
				on:input={compareInputs}
			/>
		</div>
		<div class="password-reqs" class:red={failed_validation}>
			min: 1 uppercase | 1 number | 1 special character | length > 7
		</div>

		<button type="submit" class="save" class:active={password_confirmed}>
			<div id="spinner" class:active={submitting_form} />
			{#if !submitting_form}
				Save
			{:else}
				<span class="button-spinner" />
			{/if}
		</button>

		<p class="info" />
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
		width: 100%;
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
	.row.current {
		margin-bottom: 50px;
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
		width: 200px;
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
	.password-reqs {
		font-family: openSans-semibold;
		font-size: 11px;
		color: var(--grey-text);
		margin-bottom: 1.8vh;
		text-align: center;
	}
	.password-reqs.red {
		color: var(--alert-red);
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
	}
</style>
