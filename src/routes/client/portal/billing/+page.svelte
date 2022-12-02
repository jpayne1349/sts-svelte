<script>
	import { sessionStore, alertStore, fbStore } from '../../stores';
	import { goto } from '$app/navigation';
	import { updateDoc, doc, Timestamp, arrayUnion } from 'firebase/firestore';
	import Event from '../Event.svelte';
	import { ref, listAll } from 'firebase/storage';
	import { writable } from 'svelte/store';
	import { FirebaseError } from 'firebase/app';
	import Document from './Document.svelte';
	import PaymentCard from '../PaymentCard.svelte';

	let cancelling_subscription = false;
	let removing_payment_method = false;

	function shortenCardType() {
		if ($sessionStore.default_payment_method.type == '') {
			return '';
		}

		switch ($sessionStore.default_payment_method.type) {
			case 'visa':
				return 'VI';
				break;

			case 'mastercard':
				return 'MC';
				break;

			case 'discover':
				return 'DC';
				break;

			case 'amex':
				return 'AE';
				break;

			default:
				return 'CC';
		}
	}

	async function cancelSubscription() {
		cancelling_subscription = true;
		// we could require a reauth
		if ($sessionStore.subscription.status != 'Active') {
			alertStore.set({
				show: true,
				error: false,
				message: 'No Active Services/Subscriptions'
			});
			cancelling_subscription = false;
			return;
		}

		if ($sessionStore.subscription.id != '') {
			// post to firebase and stripe to cancelSubscription
			let server_response = await fetch('/client/api/stripe/cancelSubscription', {
				method: 'POST',
				body: JSON.stringify({ sub_id: $sessionStore.subscription.id }),
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
						title: 'Error Cancelling Subscription',
						account: $sessionStore.email,
						details: responseJson.code
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				});

				cancelling_subscription = false;

				return;
			}

			let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);
			let updatedUserDoc = await updateDoc(userDocReference, {
				'subscription.status': 'Cancelling',
				'service_log.events': arrayUnion({
					time: Timestamp.now(),
					description: $sessionStore.email + ' cancelled services.',
					type: 'billing'
				})
			});

			let sendEmail = fetch('/client/api/generateErrorEmail', {
				method: 'POST',
				body: JSON.stringify({
					title: 'Cancel Services/Subscription',
					account: $sessionStore.email,
					details:
						'Not an error, informational only. The account is requesting cancellation of services.'
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

		cancelling_subscription = false;
	}

	async function removeDefaultPaymentMethod() {
		removing_payment_method = true;
		// we could require a reauth

		// post to firebase and stripe to cancelSubscription
		let server_response = await fetch('/client/api/stripe/removePaymentMethod', {
			method: 'POST',
			body: JSON.stringify({ pm_id: $sessionStore.default_payment_method.id }),
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
					title: 'Error Removing Payment Method',
					account: $sessionStore.email,
					details: responseJson.code
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			removing_payment_method = false;
			return;
		}

		let empty_payment_method = {
			id: '',
			type: '',
			last_four: ''
		};

		let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);
		let updatedUserDoc = await updateDoc(userDocReference, {
			default_payment_method: empty_payment_method,
			'account_setup.billing_method.completed': false,
			'service_log.events': arrayUnion({
				time: Timestamp.now(),
				description: $sessionStore.email + ' removed payment method.',
				type: 'billing'
			})
		});

		removing_payment_method = false;
	}

	let latest_event = {
		time: '',
		description: '',
		type: 'billing',
		exists: false
	};

	let unsubCallback = sessionStore.subscribe((storeData) => {
		for (let i = 0; i < storeData.service_log.events.length; i++) {
			if (storeData.service_log.events[i].type == 'billing') {
				latest_event = storeData.service_log.events[i];
				latest_event.exists = true;
				return;
			}
		}
		// none found, set false
		latest_event.exists = false;
	});

	
	/**
	 * Overly complicated math to compute the next renewal date based on the stored 'dateAnchor' of the billing cycle
	 * @param {number} unixTimestamp - stored unix timestamp that = billing_cycle_anchor
	 * @returns {string} displayDate - sliced Date object to show day-month-year of upcoming due date
	  **/
	function parseRenewalDate(unixTimestamp) {
		let dateAnchor = new Date(unixTimestamp * 1000);
		let dayAnchor = dateAnchor.getDate();
		
		let today = new Date();
		let nextDueDate = new Date();
		if(today.getDate() < dayAnchor) {
			
			nextDueDate.setDate(dayAnchor);
		} else {
			
			nextDueDate.setMonth(today.getMonth() + 1, dayAnchor);
		}
		
		let displayDate = nextDueDate.toString();
		displayDate = displayDate.slice(0,15);
		
		return displayDate;
	}	

</script>

<div class="container">
	<section>
		<div class="information-row">
			<p class="label">Status:</p>

			<p class="data" class:active={$sessionStore.billing.status == "Active"}>{$sessionStore.billing.status}</p>
		</div>

		<div class="information-row">
			<p class="label">Name:</p>

			<p class="data">{$sessionStore.billing.name}</p>
		</div>

		<div class="information-row">
			<p class="label">Email:</p>

			<p class="data">{$sessionStore.billing.email}</p>
		</div>

		<div class="information-row address">
			<p class="label">Address:</p>

			<p class="data">
				{#if $sessionStore.address.line1 != ''}
					{$sessionStore.address.line1} <br />
					{$sessionStore.address.city}, {$sessionStore.address.state}
					{$sessionStore.address.postal_code}
				{/if}
			</p>
		</div>

		<div class="information-row payment">
			<p class="label">Default Payment Method:</p>

			{#if $sessionStore.default_payment_method.id != ''}
				<PaymentCard />
				<button class="remove-card" on:click={removeDefaultPaymentMethod}>
					{#if removing_payment_method}
						<span class="button-spinner" />
					{:else}
						Remove
					{/if}
				</button>
			{:else}
				<a href="/client/setup/billing_method" class="add-one-link"><div /></a>
			{/if}
		</div>

		<div class="information-row latest-event">
			<p class="label latest-event">Latest Event</p>

			{#if latest_event.exists}
				<Event
					time={latest_event.time}
					description={latest_event.description}
					type={latest_event.type}
				/>
			{:else}
				<p class="empty-placeholder" />
			{/if}
		</div>

		<div class="information-row subscription">
			<p class="label subscription">
				Services&nbsp;
				{#if $sessionStore.subscription.status != ''}
					<span class="subscription-status"> - {$sessionStore.subscription.status}</span>
				{/if}
			</p>

			{#if $sessionStore.subscription.message != ''}
				<p class="info-text">
					{$sessionStore.subscription.message}
				</p>
			{:else}
				<div class="subscription-row">
					<p class="label">Plan:</p>
					<p class='variable' >{$sessionStore.subscription.plan}</p>
				</div>
				<div class="subscription-row tab">
					<!-- <p class="label">Options:</p> -->
					<p class='variable' >{$sessionStore.subscription.options}</p>
				</div>
				<div class="subscription-row">
					<p class="label">Amount:</p>
					<p class='variable' >{$sessionStore.subscription.monthly} USD / Month</p>
				</div>
				<div class="subscription-row">
					<p class="label">Renewal:</p>
					<p class='variable' >{parseRenewalDate($sessionStore.subscription.renewal)}</p>
				</div>
			{/if}
		</div>

		<div class="information-row documents">
			<p class="label documents">Documents</p>

			<div class='documents-container'>
			{#if $sessionStore.billing.documents.length == 0}
				<p class="info-text">Billing documents will be uploaded here for viewing/download.</p>
			{:else}
				{#each $sessionStore.billing.documents as file (file.filename)}
					
					<Document file={file} />
				{/each}
			{/if}
			</div>
		</div>

		<button
			class="text-link"
			on:click={() => {
				// set the navigation returns etc
				$sessionStore.navigation = {
					returnBack: true,
					returnTo: '/client/portal/billing'
				};
				// go to /client/setup/billing_method
				let getThere = goto('/client/setup/billing_address');
			}}
		>
			{#if $sessionStore.address.line1 == ''}
				Add Billing
			{:else}
				Update Billing
			{/if}
			Info
		</button>

		<button
			class="text-link"
			on:click={() => {
				// set the navigation returns etc
				$sessionStore.navigation = {
					returnBack: true,
					returnTo: '/client/portal/billing'
				};
				// go to /client/setup/billing_method
				let getThere = goto('/client/setup/billing_method');
			}}
		>
			{#if $sessionStore.default_payment_method.id == ''}
				Add a
			{:else}
				Change
			{/if}
			Payment Method
		</button>

		<button
			class="text-link"
			on:click={() => {
				// set the navigation returns etc
				$sessionStore.navigation = {
					returnBack: true,
					returnTo: '/client/portal/billing'
				};
				// go to /client/setup/billing_method
				let getThere = goto('/client/setup/subscription_service');
			}}
		>
			{#if $sessionStore.subscription.status == ''}
				Request
			{:else}
				Change
			{/if}
			Service/Subscription</button
		>

		<button
			class="text-link cancel"
			class:active={$sessionStore.subscription.status == 'Active'}
			on:click={cancelSubscription}
			>Cancel Service/Subscription

			{#if cancelling_subscription}
				<span class="text-link-spinner" />
			{/if}
		</button>
	</section>
</div>

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
	.information-row.address {
		align-items: flex-start;
	}
	.information-row.subscription
	 {
		flex-direction: column;
		align-items: flex-start;
	}
	.information-row.latest-event, .information-row.documents {
		flex-direction: column;
		align-items: center;
	}
	.documents-container {
		width: 100%;
		max-height: 200px;
		overflow-y: scroll;
	}
	.information-row.payment {
		justify-content: space-between;
	}
	.remove-card {
		margin: 0;
		width: 80px;
		padding: 5px 0;
		font-size: 12px;
		height: fit-content;
		background-color: var(--button-light-blue);
	}
	.subscription-row {
		display: flex;

		margin: 5px 5px 5px 25px;
	}
	.subscription-row.tab {
		margin-top: -5px;
		margin-left: 40px;
	}
	.subscription-status {
		font-family: openSans-light;
		font-size: 12px;
	}
	.label {
		font-family: openSans-light;
		margin-right: 5px;
		font-size: 16px;
		position: relative;
	}
	.label.subscription
	 {
		font-family: openSans-regular;
		display: flex;
		align-items: center;
	}
	.label.latest-event, .label.documents {
		font-family: openSans-regular;
		align-self: flex-start;
	}
	p.variable {
		font-family: openSans-regular;
		margin-right: 5px;
		font-size: 14px;
		position: relative;
		line-height: 24px;
	}
	.empty-placeholder {
		height: 40px;
	}
	.info-text {
		font-family: openSans-medium;
		font-size: 14px;
		margin: 10px 20px;
	}
	.data {
		font-family: openSans-medium;
		font-size: 16px;
	}
	.data.active {
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
	.text-link.cancel {
		filter: opacity(0.5);
	}
	.text-link.cancel.active {
		filter: none;
	}
	.add-one-link {
		position: relative;
		content: '';
		display: flex;
		align-items: center;
		margin-left: 5px;
	}
	.add-one-link div {
		content: '';
		border-radius: 50%;
		background-color: var(--global-green);
		color: white;
		font-family: openSans-bold;
		width: 20px;
		height: 20px;
		position: relative;
		box-shadow: var(--box-shadow);
	}
	.add-one-link div::before,
	.add-one-link div::after {
		content: '';
		background-color: white;
		width: 10px;
		height: 2px;
		position: absolute;
		left: 5px;
		top: 9px;
	}
	.add-one-link div::after {
		transform: rotate(90deg);
	}

	.text-link-spinner,
	.button-spinner {
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
	.button-spinner {
		border-top: 2px solid white;
		margin-left: 0;
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
