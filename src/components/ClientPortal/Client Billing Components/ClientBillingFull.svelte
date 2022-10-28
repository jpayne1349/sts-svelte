<script>
	import { getContext, createEventDispatcher } from 'svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import CancelEditButton from '../CancelEditButton.svelte';
	import EditInfoButton from '../EditInfoButton.svelte';
	import SaveEditButton from '../SaveEditButton.svelte';
	import StyledInput from '../StyledInput.svelte';
	import BillingEvents from './BillingEvents.svelte';
	import PaymentMethods from './PaymentMethods.svelte';
	import ManageSubscription from './ManageSubscription.svelte';
	import { doc, updateDoc, Timestamp, collection, addDoc } from 'firebase/firestore';

	let session_store = getContext('session_store');
	let dispatch = createEventDispatcher();

	export let show_full_view;

	let session_data = {};
	let event_list = [];
	let show_spinner = false;
	let first_billing_event_index = 0;
	let billing_event_exists = false;
	let show_description = false;
	let show_payment_methods = false;
	let show_subscription_options = false;
	let in_edit_view = false;
	let show_edit_inputs = false;


	let unsubscribe = session_store.subscribe((data) => {
		session_data = data;
		event_list = session_data.live_event_list;

		if (event_list) {
			event_list.forEach((event) => {
				if (event.category == 'Billing') {
					billing_event_exists = true;
					first_billing_event_index = firstBillingEventIndex(event_list);
				}
			});
		}
	});

	function firstBillingEventIndex(event_list) {
		for (let i = 0; i < event_list.length; i++) {
			if (event_list[i].category === 'Billing') {
				return i;
			}
		}
	}

	function getNextBillDueDate() {
		let billing_date = session_data.company.billing.due_date;

		if (billing_date == 0) {
			return '';
		}

		let date_output = new Date();

		let today = date_output.getDay();

		if (today > billing_date) {
			date_output.setMonth(date_output.getMonth() + 1);
			date_output.setDate(billing_date);

			let date_string = date_output.toString();
			date_string = date_string.substring(0, 15);

			return date_string;
		}

		date_output.setDate(billing_date);

		let date_string = date_output.toString();
		date_string = date_string.substring(0, 15);

		return date_string;
	}

	// object that is written to when in 'edit' mode. to compare/set new info
	let updated_billing = {
		name: session_data.company.billing.name,
		email: session_data.company.billing.email,
		address: {
			street: session_data.company.billing.address.street,
			zipcode: session_data.company.billing.address.zipcode,
			city: session_data.company.billing.address.city,
			state: session_data.company.billing.address.state
		}
	};

	function showEditView(event) {
		// set the updated_billing to match what's in session_data

		updated_billing.name = session_data.company.billing.name;
		updated_billing.address = session_data.company.billing.address;
		updated_billing.email = session_data.company.billing.email;

		in_edit_view = !in_edit_view;
	}
	function cancelEdit(event) {
		// discard temp object with changes.. etc.
		in_edit_view = false;
	}

	// saves data to session, to firestore, and creates and posts new event, calls validateBillingInfo
	async function saveEdit(event) {
		show_spinner = true;
		const companyDocRef = doc(session_data.firebaseDb, 'client-company', session_data.user.cuid);

		try {
			const updatedCompany = await updateDoc(companyDocRef, {
				'billing.name': updated_billing.name,
				'billing.address': updated_billing.address,
				'billing.email': updated_billing.email
			});

			session_store.update((existing_data) => {
				existing_data.company.billing.name = updated_billing.name;
				existing_data.company.billing.address = updated_billing.address;
				existing_data.company.billing.email = updated_billing.email;

				return existing_data;
			});

			// event should trigger
			let json_event_data = {
				category: 'Billing',
				created: Timestamp.now(),
				cuid: companyDocRef.id,
				custom_data: [{ key: 'Type', value: 'Saved Data' }],
				status: 'Completed',
				title: 'Update Account',
				description:
					'Your company/owner billing information (name, address, or e-mail) was modified via an authenticated user.',
				type: 'User',
				updated: null
			};

			// create reference to new subcollection
			const company_event_subcollection = collection(companyDocRef, 'events');
			const eventDocRef = await addDoc(company_event_subcollection, json_event_data);

			// now calls validateBillingInfo to proceed on
			validateBillingInfo();
		} catch (e) {
			console.warn('Error updating billing information: ', e);
			return;
		}

		// animation should trigger
		show_spinner = false;
		in_edit_view = false;
	}

	// this will evaluate current session_data and determine need for stripe Customer creation/updating, and billing.status updating
	function validateBillingInfo() {
		// check all required fields
		if (requiredFieldsFilled) {
			
            // this should handle the update case as well
            createNewStripeCustomer();

		}
	}

	// TODO: dispay error popup if trying to empty a previously filled field. and dispatch an event to cancel any subscriptions if they are setup, etc.
    function requiredFieldsFilled() {
		if (updated_billing.name == '') {
			return false;
		}
		if (updated_billing.email == '') {
			return false;
		}
		if (updated_billing.address.street == '') {
			return false;
		}
		if (updated_billing.address.zipcode == '') {
			return false;
		}
		if (updated_billing.address.city == '') {
			return false;
		}
		if (updated_billing.address.state == '') {
			return false;
		}

		return true;
	}

	// post request to server to perform the customer creation with the stripe api
	async function createNewStripeCustomer() {
		// add cuid to the validated field data
		updated_billing.cuid = session_data.user.cuid;
		updated_billing.auid = session_data.user.auid;

		let server_response = await fetch('/client/stripe/createCustomer', {
			method: 'POST',
			body: JSON.stringify(updated_billing),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// returns bools - error, created, updated
		let responseJson = await server_response.json();

		// grab this for updating the db with the new information
		const companyDocRef = doc(session_data.firebaseDb, 'client-company', session_data.user.cuid);

		// handle error, or next step. ie, prompt to add payment method if not already done.
		if (responseJson.error) {
			session_store.update((existing_data) => {
				existing_data.company.billing.status.message = 'Account Error';
				existing_data.company.billing.status.color = 'red';

                return existing_data;
			});

			const updatedDoc = await updateDoc(companyDocRef, {
				'billing.status.message': 'Account Error',
				'billing.stauts.color': 'red'
			});

		} else {
            // no payment method added yet.
			if (!session_data.company.billing.status.payment_method) {
				session_store.update((existing_data) => {
					existing_data.company.billing.status.customer = true;
					existing_data.company.billing.status.message = 'Payment Method Required';
					existing_data.company.billing.status.color = 'yellow';

                    return existing_data;
				});

				const updatedDoc = await updateDoc(companyDocRef, {
					'billing.status.customer': true,
					'billing.status.message': 'Payment Method Required',
					'billing.stauts.color': 'yellow'
				});
			}
		}
	}


</script>

<!-- ************************************************ -->
<!-- TODO: make edit view an always on thing, with a listener for change that will prompt the cancel/save option, with a warning message  -->
<!-- TODO: I think I want to move all events to the service log, except invoices, payments, and receipts == billing -->

<div
	id="client-billing-container"
	class:edit={in_edit_view}
	class:fullview={show_full_view}
	transition:fade={{ duration: 200 }}
>
	<div id="container-background" />
	<div id="spinner" class:active={show_spinner} />

	<div id="title">
		Billing
		<button
			on:click={() => {
				show_description = !show_description;
			}}
			class:active={show_description}
			id="show-description"
			class="info-icon">i</button
		>
	</div>
	{#if show_description}
		<div id="description" transition:fly={{ duration: 400, x: -20, y: 5 }}>
			This information is used alongside your payment method to create invoices, process payments,
			and send receipts. It may or may not match your user/company contact information.
		</div>
	{/if}

	<button
		id="show-fullview"
		on:click={() => {
			dispatch('hide', 'billing-full-view');
		}}
	>
		<img class="button-arrow toggle-full" src="./blue_arrow_svg.svg" alt="To full view" />
	</button>

	{#if show_full_view}
		{#if in_edit_view}
			<CancelEditButton on:clicked={cancelEdit} />
			<SaveEditButton on:clicked={saveEdit} />
		{:else}
			<EditInfoButton on:clicked={showEditView} />
		{/if}
	{/if}

	<div id="fullview-body">
		<div id="billing-details" class="details-table">
			<div class="details-col">
				<div id="billing-name" class="info-row">
					<div class="required-asterisk" class:needed={updated_billing.name == ''}>*</div>
					<div id="name-label" class="label">Name:</div>
					{#if in_edit_view}
						<input
							in:fade={{ delay: 0 }}
							class="edit-info-input"
							id="billing-name-input"
							bind:value={updated_billing.name}
						/>
					{:else}
						<div id="name" class="variable" in:fade={{ delay: 0 }}>
							{#if session_data.company.billing.name != ''}
								{session_data.company.billing.name}
							{:else}
								<div class="no-data">none</div>
							{/if}
						</div>
					{/if}
				</div>
				<div id="billing-email" class="info-row">
					<div class="required-asterisk" class:needed={updated_billing.email == ''}>*</div>
					<div class="label">E-Mail:</div>

					{#if in_edit_view}
						<input
							in:fade={{ delay: 0 }}
							class="edit-info-input"
							id="billing-email-input"
							bind:value={updated_billing.email}
						/>
					{:else}
						<div id="email" class="variable" in:fade={{ delay: 0 }}>
							{#if session_data.company.billing.email != ''}
								{session_data.company.billing.email}
							{:else}
								<div class="no-data">none</div>
							{/if}
						</div>
					{/if}
				</div>
				{#if show_full_view}
					<div class="info-row">
						<div class="required-asterisk" class:needed={updated_billing.address.street == ''}>
							*
						</div>
						<div class="label">Address:</div>
						{#if in_edit_view}
							<input
								in:fade={{ delay: 0 }}
								class="edit-info-input"
								bind:value={updated_billing.address.street}
							/>
						{:else}
							<div id="street" class="variable" in:fade={{ delay: 0 }}>
								{#if session_data.company.billing.address.street != ''}
									{session_data.company.billing.address.street}
								{:else}
									<div class="no-data">none</div>
								{/if}
							</div>
						{/if}
					</div>
					<div class="info-row">
						<div class="required-asterisk" class:needed={updated_billing.address.zipcode == ''}>
							*
						</div>
						<div class="label">Zipcode:</div>
						{#if in_edit_view}
							<input
								in:fade={{ delay: 0 }}
								class="edit-info-input"
								bind:value={updated_billing.address.zipcode}
							/>
						{:else}
							<div id="zipcode" class="variable" in:fade={{ delay: 0 }}>
								{#if session_data.company.billing.address.zipcode != ''}
									{session_data.company.billing.address.zipcode}
								{:else}
									<div class="no-data">none</div>
								{/if}
							</div>
						{/if}
					</div>
					<div class="info-row">
						<div class="required-asterisk" class:needed={updated_billing.address.city == ''}>*</div>
						<div class="label">City:</div>
						{#if in_edit_view}
							<input
								in:fade={{ delay: 0 }}
								class="edit-info-input"
								bind:value={updated_billing.address.city}
							/>
						{:else}
							<div id="city" class="variable" in:fade={{ delay: 0 }}>
								{#if session_data.company.billing.address.city != ''}
									{session_data.company.billing.address.city}
								{:else}
									<div class="no-data">none</div>
								{/if}
							</div>
						{/if}
					</div>
					<div class="info-row">
						<div class="required-asterisk" class:needed={updated_billing.address.state == ''}>
							*
						</div>
						<div class="label">State:</div>
						{#if in_edit_view}
							<input
								in:fade={{ delay: 0 }}
								class="edit-info-input"
								bind:value={updated_billing.address.state}
							/>
						{:else}
							<div id="state" class="variable" in:fade={{ delay: 0 }}>
								{#if session_data.company.billing.address.state != ''}
									{session_data.company.billing.address.state}
								{:else}
									<div class="no-data">none</div>
								{/if}
							</div>
						{/if}
					</div>
				{:else}
					<!-- not in full view -->
					<div class="info-row">
						<div id="address-label" class="label">Address:</div>
						<div id="address" class="variable" in:fade={{ delay: 0 }}>
							{#if session_data.company.billing.address.street != ''}
								{session_data.company.billing.address.street}
							{:else}
								<div class="no-data">none</div>
							{/if}
						</div>
					</div>
				{/if}

				<div id="billing-due-date" class="info-row">
					<div id="due-date-label" class="label">Next Due:</div>
					<div id="due-date" class="variable">
						{getNextBillDueDate()}
					</div>
				</div>
				<div id="billing-autopay" class="info-row">
					<div id="autopay-label" class="label">Autopay:</div>
					<div class="status-bubble" />
					<div id="autopay" class="variable" class:green={session_data.company.billing.autopay}>
						{#if session_data.company.billing.autopay}
							On
						{:else}
							Off
						{/if}
					</div>
				</div>

				<!-- TODO: all the items below need work -->
				<div id="billing-status" class="info-row">
					<div id="status-label" class="label">Status:</div>
					<!-- TODO: this should be based on the state of the variable status.color-->
					<div class="status-bubble" />
					<div id="status" class="variable">{session_data.company.billing.status.message}</div>
				</div>
			</div>
		</div>

		<div id="right-column">
			<PaymentMethods />
			<ManageSubscription />
		</div>
	</div>

	<BillingEvents on:event_banner_click {show_full_view} />
</div>

<style>
	#client-billing-container {
		height: 35vh;
		min-height: 255px;
		flex-basis: 40vw;
		margin: 1vh 3vw;
		padding: 0 0 14vh 0;
		color: black;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		transition: all 1s;
		z-index: 1;
	}

	#client-billing-container.fullview {
		position: absolute;
		height: 81.5vh;
		width: 78.1vw;
		margin: 6.4vh 3vw;
		opacity: 1;
	}
	#client-billing-container.edit {
		flex-basis: 50vw;
	}
	#container-background {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: var(--box-color);
		border-radius: var(--box-border-radius);
		/* box-shadow: var(--box-shadow); */
		box-shadow: 0px 1px 3px rgb(82, 82, 82);
	}
	#title {
		font-family: openSans-boldItalic;
		color: #394b67;
		font-size: 2vw;
		z-index: 6;
		position: relative;
	}
	#description {
		z-index: 4;
		font-family: openSans-regular;
		position: absolute;
		height: 13vh;
		font-size: 0.7vw;
		left: 25vw;
		top: -11vh;
		background-color: var(--box-color);
		border-radius: 20px 20px 20px 0;
		padding: 10px 10px 10px 15px;
		text-align: left;
		box-shadow: 0px 1px 3px rgb(114, 114, 114);
	}
	#client-billing-container.fullview #description {
		top: -4vh;
		left: 44vw;
		height: 6vh;
	}
	#show-description {
		z-index: 4;
		font-family: openSans-lightitalic;
		border-radius: 50%;
		border: 1px solid rgb(122, 122, 122);
		width: 1vw;
		height: 1vw;
		position: absolute;
		top: 1vh;
		right: -1.4vw;
		transition: all 0.2s;
		cursor: pointer;
		color: black;
		box-shadow: 0 1px 1px rgb(120, 120, 120);
	}
	#show-description:hover,
	#show-description.active {
		box-shadow: 0 2px 4px rgb(120, 120, 120);
	}
	#fullview-body {
		display: flex;
		width: 80%;
	}
	.details-table {
		display: flex;
		width: 80%;
		justify-content: space-around;
	}
	#client-billing-container.fullview .details-table {
		flex-direction: column;
		width: 50%;
	}
	#right-column {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 50%;
		z-index: 1;
	}
	.details-col {
		display: flex;
		flex-direction: column;
		z-index: 1;
		width: 50%;
	}
	.label {
		font-family: openSans-light;
		font-size: 0.9vw;
		margin-right: 5px;
		/* width: 4.3vw; */
	}
	.required-asterisk {
		color: #8654547f;
		position: absolute;
		font-size: 1vw;
		left: -0.6vw;
		opacity: 0;
		user-select: none;
		transition: 1s all;
	}
	.required-asterisk.needed {
		opacity: 1;
	}
	.info-row {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-top: 1vh;
		border-bottom: 1px solid #80808029;
		margin-bottom: 1vh;
		background-color: var(--box-color);
		position: relative;
	}
	.variable {
		font-family: openSans-regular;
		font-size: 1vw;
	}

	.variable.green {
		color: #3c7040;
	}

	.button-arrow {
		width: 1.5vw;
		user-select: none;
		cursor: pointer;
		transition: all 0.3s;
		align-self: center;
		z-index: 2;
		position: absolute;
		right: 15px;
		top: 15px;
		transform: rotate(135deg);
	}
	.button-arrow:hover {
		transform: rotate(135deg) translate(5px);
	}

	input {
		border: none;
		background-color: rgb(255 255 255 / 0%);
		font-size: 1vw;
		transition: all 0.5s;
		font-family: 'openSans-regular';
	}
	input:hover {
		box-shadow: 0px 1px 2px rgb(164, 164, 164);
	}
	input:focus {
		outline: none;
		box-shadow: 0px 1px 2px rgb(164, 164, 164);
	}
	#spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid #394b67;
		border-right: 2px solid transparent;
		width: 1vw;
		height: 1vw;
		bottom: 1vw;
		left: 1vw;
		animation-name: s-glWFwOjWat37-spinning;
		animation-duration: 0.8s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		position: absolute;
		opacity: 0;
		transition: all 0.2s;
		z-index: 10;
	}
	#spinner.active {
		opacity: 1;
	}
	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
	@media only screen and (max-width: 615px) {
	}
</style>
