<script>
	import { alertStore, sessionStore, fbStore } from '../../stores';
	import { fly } from 'svelte/transition';
	import { deleteUser } from 'firebase/auth';
	import ReauthenticateModal from '../ReauthenticateModal.svelte';
	import EditAccountEmail from './EditAccountEmail.svelte';
	import ChangePassword from './ChangePassword.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let showChangePassword = false;
	let edit_account_email = false;
	let reauth_required = false;

	let trigger_retry = false;

	let sending_email = false;

	async function sendVerificationEmail() {
		if (sending_email == true) {
			return;
		}
		sending_email = true;

		let server_response = await fetch('/client/api/generateVerifyEmail', {
			method: 'POST',
			body: JSON.stringify({ email: $sessionStore.email, uid: $sessionStore.uid }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		let json = await server_response.json();

		if (json.error) {
			alertStore.set({
				show: true,
				error: true,
				message: 'Error Sending Email'
			});
			sending_email = false;
			return;
		}

		alertStore.set({
			show: true,
			error: false,
			message: 'New Email Sent!'
		});

		sending_email = false;
	}

	function formatPhoneNumber(number) {
		let formattedString = number;
		if (number.length == 10) {
			let areaCode = number.slice(0, 3);
			let firstChunk = number.slice(3, 6);
			let secondChunk = number.slice(6, 10);
			formattedString = '(' + areaCode + ') ' + firstChunk + '-' + secondChunk;
		}
		if (number.length == 11) {
			let countryCode = number.slice(0, 1);
			let areaCode = number.slice(1, 4);
			let firstChunk = number.slice(4, 7);
			let secondChunk = number.slice(7, 11);
			formattedString = '+' + countryCode + ' (' + areaCode + ') ' + firstChunk + '-' + secondChunk;
		}
		if (number.length == 7) {
			let firstChunk = number.slice(0, 3);
			let secondChunk = number.slice(3, 7);
			formattedString = firstChunk + '-' + secondChunk;
		}

		return formattedString;
	}

	let deleteAccountRequested = false;
	let deletingAccount = false;
	let deleteAccountReauthRequired = false;
	let first_pass = true;

	async function deleteUserAccount() {
		deletingAccount = true;

		try {
			if (first_pass) {
				throw { code: 'auth/requires-recent-login' };
			}
			// need to delete the user auth and the firestore reference

			let sendEmail = fetch('/client/api/generateErrorEmail', {
				method: 'POST',
				body: JSON.stringify({
					title: 'User Account Deleted',
					account: $sessionStore.email,
					details: ''
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			let deletingUser = await deleteUser($fbStore.auth.currentUser);

			alertStore.set({
				show: true,
				error: false,
				message: 'Account Deleted'
			});
		} catch (err) {
			if (err.code == 'auth/requires-recent-login') {
				deleteAccountReauthRequired = true;
				first_pass = false;
				return;
			}
		}
	}
</script>

<div class="container">
	<section>
		{#if $sessionStore.company_is_seperate}
			<div class="information-row">
				<p class="label">Company:</p>

				<p class="data">{$sessionStore.company_name}</p>
			</div>
		{/if}

		<div class="information-row">
			<p class="label">Name:</p>

			<p class="data">{$sessionStore.fullname}</p>
		</div>

		<div class="information-row">
			<p class="label">Phone:</p>

			<p class="data">{formatPhoneNumber($sessionStore.phone)}</p>
		</div>

		<div class="information-row">
			<p class="label email">Email:</p>
			<p class="data">{$sessionStore.email}</p>
			<p class="email-status" class:verified={$sessionStore.email_verified}>
				{#if $sessionStore.email_verified == false}
					(unverified)
				{:else}
					verified
				{/if}
			</p>
			<button
				class="edit-button"
				on:click={() => {
					edit_account_email = true;
				}}><img src="../../edit_pencil_icon.svg" alt="Edit" /></button
			>
		</div>

		<button
			class="text-link"
			on:click={() => {
				showChangePassword = true;
			}}>Change Password</button
		>

		<button
			class="text-link"
			on:click={() => {
				$sessionStore.navigation.returnBack = true;
				$sessionStore.navigation.returnTo = '/client/portal/profile';

				goto('/client/setup/account_info');
			}}>Update Profile</button
		>

		{#if $sessionStore.email_verified == false}
			<button class="text-link" on:click={sendVerificationEmail}
				>Resend Email Verification Link
				{#if sending_email}
					<span class="text-link-spinner" />
				{/if}
			</button>
		{/if}

		<div class="overview-section last">
			<button
				class="delete-account text-link"
				on:click={() => {
					deleteAccountRequested = true;
				}}>Delete Account</button
			>
			{#if deleteAccountRequested}
				<div class="confirm-delete-container" in:fly={{ y: -50 }}>
					<p>Are you sure you want to delete your account?</p>
					<div class="confirm-delete-buttons">
						<button
							on:click={() => {
								deleteAccountRequested = false;
							}}
							class="cancel-delete">Cancel</button
						>
						<button on:click={deleteUserAccount} class="confirm-delete">
							{#if deletingAccount}
								<div class="spinner" />
							{:else}
								Confirm
							{/if}
						</button>
					</div>
				</div>
			{/if}
		</div>
	</section>
</div>

{#if edit_account_email}
	<EditAccountEmail
		on:close={() => {
			edit_account_email = false;
		}}
		on:reauth={() => {
			reauth_required = true;
		}}
		external_trigger={trigger_retry}
		on:retried={() => {
			trigger_retry = false;
		}}
	/>
{/if}

{#if showChangePassword}
	<ChangePassword
		on:close={() => {
			showChangePassword = false;
		}}
	/>
{/if}

{#if reauth_required}
	<ReauthenticateModal
		on:success={() => {
			reauth_required = false;
			trigger_retry = true;
		}}
	/>
{/if}

{#if deleteAccountReauthRequired}
	<ReauthenticateModal
		on:success={() => {
			deleteAccountReauthRequired = false;
			deleteUserAccount();
		}}
	/>
{/if}

<style>
	.container {
		margin-bottom: 4vh;
		box-shadow: var(--box-shadow);
		position: relative;
	}
	section {
		padding: 15px 0;
		margin-bottom: 30px;
	}
	.information-row {
		display: flex;
		padding: 15px 0;
		border-bottom: 1px solid var(--bar-color);
		align-items: center;
		font-size: 16px;
	}
	.label {
		font-family: openSans-light;
		margin-right: 5px;
		font-size: 16px;
		position: relative;
	}
	.data {
		font-family: openSans-medium;
		font-size: 16px;
	}
	.email-status {
		font-family: openSans-semibold;
		font-size: 10px;
		margin-left: 10px;
		align-self: flex-start;
	}
	.email-status.verified {
		color: var(--global-green);
	}
	.text-link {
		font-family: openSans-bolditalic;
		text-decoration: underline;
		background-color: transparent;
		color: var(--main);
		box-shadow: none;
		padding: 0;
		margin: 25px 0 0 15px;
		position: relative;
	}
	.edit-button {
		background-color: transparent;
		box-shadow: none;
		padding: 0;
		margin: 0 0 0 auto;
	}
	.edit-button img {
		width: 20px;
	}
	.text-link-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid var(--main);
		border-right: 2px solid transparent;
		width: 15px;
		height: 15px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 15px;
	}

	.delete-account {
		margin-top: 20px;
		position: relative;
	}

	.confirm-delete-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: space-around;
		position: absolute;
		height: 150px;
		background: white;
		box-shadow: 0px 1px 3px #a2a2a2;
		border-radius: 5px;
		align-items: center;
		bottom: 0px;
		left: 0;
	}
	.confirm-delete-container p {
		font-family: openSans-bold;
		color: var(--alert-red);
		text-align: center;
	}
	.confirm-delete-buttons {
		display: flex;
		justify-content: space-around;
		width: 100%;
	}
	.confirm-delete-buttons button {
		margin: 0;
		width: 140px;
	}
	button.confirm-delete {
		background-color: var(--button-light-blue);
	}
	.spinner {
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
