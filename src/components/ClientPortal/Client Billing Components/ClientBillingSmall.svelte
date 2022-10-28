<script>
	import { getContext, createEventDispatcher } from 'svelte';
	import { fly, fade } from 'svelte/transition';

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

	let session_data = {};
	let event_list = [];
	let first_billing_event_index = 0;
	let billing_event_exists = false;
	let show_description = false;

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

</script>

<div id="client-billing-container" >
	<div id="container-background" />
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

	<button id="show-fullview" on:click={()=>{dispatch('show','billing-full-view');}}>
		<img class="button-arrow" src="./blue_arrow_svg.svg" alt="To full view" />
	</button>

	<div id="billing-details" class="details-table">
		<div class="details-col">
			<div id="billing-name" class="info-row">
				<div id="name-label" class="label">Name:</div>

				<div id="name" class="variable" in:fade={{ delay: 0 }}>
					{#if session_data.company.billing.name != ''}
						{session_data.company.billing.name}
					{:else}
						<div class="no-data">none</div>
					{/if}
				</div>
			</div>
			<div id="billing-email" class="info-row">
				<div class="label">E-Mail:</div>

				<div id="email" class="variable" in:fade={{ delay: 0 }}>
					{#if session_data.company.billing.email != ''}
						{session_data.company.billing.email}
					{:else}
						<div class="no-data">none</div>
					{/if}
				</div>
			</div>
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

			
		</div>
		<div class="details-col">
			<div id="billing-autopay-status" class="info-row">
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
			<div id="billing-due-date" class="info-row">
				<div id="due-date-label" class="label">Next Due:</div>
				<div id="due-date" class="variable">
					{getNextBillDueDate()}
				</div>
			</div>

			<div id="billing-status" class="info-row">
				<div id="status-label" class="label">Status:</div>
				<!-- TODO: this should be based on the state of the variable status.color-->
				<div class="status-bubble" />
				
				<div id="status" class="variable">{session_data.company.billing.status.message}</div>
			</div>
		</div>
	</div>

	<BillingEvents on:event_banner_click />
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
		transform: rotate(-45deg);
	}
	.button-arrow:hover {
		transform: rotate(-45deg) translate(5px);
	}
	.details-table {
		display: flex;
		width: 80%;
		justify-content: space-around;
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
	.info-row {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-top: 1vh;

		background-color: var(--box-color);
	}
	.variable {
		font-family: openSans-regular;
		font-size: 1vw;
	}
	.variable.green {
		color: #3c7040;
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
