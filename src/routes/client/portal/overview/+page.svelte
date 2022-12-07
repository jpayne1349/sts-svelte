<script>
	import { sessionStore, fbStore } from '../../stores';
	import PaymentCard from '../PaymentCard.svelte';
	import Event from '../Event.svelte';
	import { fly } from 'svelte/transition';
	import { deleteUser } from 'firebase/auth';
	import ReauthenticateModal from '../ReauthenticateModal.svelte';

	let latest_event = {
		time: '',
		description: '',
		type: '',
		exists: false
	};

	let unsubCallback = sessionStore.subscribe((storeData) => {
		if (storeData.service_log) {
			latest_event = storeData.service_log.events[0];
			latest_event.exists = true;
		}
		return;
	});

	let deleteAccountRequested = false;
	let deletingAccount = false;
	let reauthRequired = false;
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
				reauthRequired = true;
				first_pass = false;
				return;
			}
		}
	}
	
</script>

<section class="container">
	<div class="overview-section">
		<h3 class="section-title">Profile</h3>

		{#if $sessionStore.company_is_seperate}
			<p class="section-info">
				<span class="info-label">Company:</span>{$sessionStore.company_name}
			</p>
		{/if}
		<p class="section-info"><span class="info-label">Name:</span>{$sessionStore.fullname}</p>
		<p class="section-info"><span class="info-label">Account Email:</span>{$sessionStore.email}</p>
	</div>

	<div class="overview-section">
		<h3 class="section-title billing">
			Billing
			{#if $sessionStore.billing.status != ''}
				<span class="billing-status" class:active={$sessionStore.billing.status == 'Active'}
					>{$sessionStore.billing.status}</span
				>
			{/if}
		</h3>

		<p class="section-info payment-method">
			<span class="info-label">Payment Method:</span>
			{#if $sessionStore.default_payment_method.id != ''}
				<PaymentCard />
			{:else}
				Not Added
			{/if}
		</p>

		<p class="section-info">
			<span class="info-label">Services:</span>{$sessionStore.subscription.status}
		</p>
		<p class="section-info address">
			<span class="info-label">Address:</span>
			{#if $sessionStore.address.line1 != ''}
				{$sessionStore.address.line1} <br />
				{$sessionStore.address.city}, {$sessionStore.address.state}
				{$sessionStore.address.postal_code}
			{/if}
		</p>
	</div>

	<div class="overview-section">
		<h3 class="section-title">Service Log</h3>

		<p class="section-info">
			<span class="info-label">Active Links:</span>
			{#each $sessionStore.service_log.active_links as link}
				<a href={link}>{link}</a> |
			{/each}
		</p>
		<p class="section-info">
			<span class="info-label">Code Repo:</span>{$sessionStore.service_log.code_repo}
		</p>
		<p class="section-info col">
			<span class="info-label col">Latest Event</span>
			{#if latest_event.exists}
				<Event
					time={latest_event.time}
					description={latest_event.description}
					type={latest_event.type}
				/>
			{/if}
		</p>
	</div>
	<div class="overview-section last">
		<button
			class="delete-account"
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

{#if reauthRequired}
	<ReauthenticateModal
		on:success={() => {
			reauthRequired = false;
			deleteUserAccount();
		}}
	/>
{/if}

<style>
	.container {
		margin-bottom: 4vh;
		box-shadow: var(--box-shadow);
	}
	.overview-section {
		padding: 15px 0;
		border-bottom: 1px solid var(--bar-color);
	}
	.overview-section.last {
		border: none;
		position: relative;
	}
	.section-title {
		font-family: openSans-semibold;
		font-size: 18px;
		margin-bottom: 5px;
	}
	.section-title.billing {
		display: flex;
	}
	.section-info {
		font-family: openSans-medium;
		font-size: 16px;
		margin-bottom: 6px;
		display: flex;
	}
	.section-info.col {
		flex-direction: column;
	}
	.info-label.col {
		font-family: openSans-regular;
		align-self: flex-start;
		margin-top: 15px;
	}
	.section-info.payment-method {
		align-items: flex-end;
		margin-top: 0px;
	}
	.info-label {
		font-family: openSans-light;
		margin-right: 5px;
		text-align: end;
	}

	.billing-status {
		font-family: openSans-light;
		font-size: 8px;
		margin-left: 5px;
		padding: 2px 4px;
		border-radius: 5px;
		border: 1px solid var(--alert-orange);
		color: var(--alert-orange);
		background-color: #d3ba9b1c;
		align-self: flex-start;
	}
	.billing-status.active {
		border: 1px solid var(--global-green);
		color: var(--global-green);
		background-color: #7aa66f19;
	}
	.delete-account {
		width: 100%;
		margin-top: 20px;
		background-color: #d25f5799;
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

	@media only screen and (max-width: 500px) {
		.container {
			padding-bottom: 25px;
		}
		.billing-status {
			font-size: 8px;
		}
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

	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
