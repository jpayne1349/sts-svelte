<script>
	import { alertStore, sessionStore, fbStore } from '../stores';
	import { fly } from 'svelte/transition';
	import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
	import { doc, updateDoc, Timestamp, arrayUnion } from 'firebase/firestore';
    import { goto } from '$app/navigation';

	let form_element;
	let password_confirmed = false;
	let failed_validation = false;

	let current_password_value = '';
	let new_password_value = '';
	let confirm_password_value = '';

	let submitting_form = false;

	async function changePassword() {
		submitting_form = true;

		try {
			//validate new password
			if (!checkPassword(new_password_value)) {
				failed_validation = true;
				throw { code: 'Requirements not met' };
			}

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
			
			alertStore.set({
				show: true,
				error: false,
				message: 'Password Change Successful!'
			});

            // redirect to portal overview

            let redirect = await goto('/client/portal/overview');

		} catch (e) {
			alertStore.set({
				show: true,
				error: true,
				message: e.code
			});

			let sendEmail = fetch('/client/api/generateErrorEmail', {
				method: 'POST',
				body: JSON.stringify({
					title: 'Error during Password Reset',
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
	<h3>Reset Account Password</h3>

	<form on:submit|preventDefault={changePassword} bind:this={form_element}>
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

		top: 22vh;
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
		color: var(--main);
		margin-bottom: 25px;
	}
	form {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.row {
		display: flex;
		margin-bottom: 15px;
		align-items: flex-end;
	}

	.label {
		font-family: openSans-light;
		font-size: 18px;
		color: var(--main);
		width: 75px;
		text-align: end;
	}
	.data {
		font-family: openSans-medium;
		font-size: 16px;
		color: var(--main);
		margin-left: 5px;
	}
	input {
		height: fit-content;
		font-size: 16px;
		margin-left: 5px;
		padding: 2px 5px;
		width: 200px;
        margin-top: 15px;
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
		background-color: var(--bar-color);
		position: relative;
		user-select: none;
	}
	button.active {
		pointer-events: all;
		background-color: var(--main);
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
