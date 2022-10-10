<script>
	import ClientEventBanner from './ClientEventBanner.svelte';
    import { getContext } from 'svelte';


    let context_object = getContext('client_object');
    let client_object = context_object.client_object;
    let event_list = client_object.event_list;


    function firstBillingEventIndex() {
        for(let i=0; i<event_list.length; i++) {
            if(event_list[i].category === 'billing') {
                return i;
            }
        }
    }   
    let first_billing_event_index = firstBillingEventIndex();
    
	// toggle showing all events

	let billing_events_focus = false;
	let billing_details_focus = false;

	function getNextBillDueDate() {
		let billing_date = client_object.company_info.billing_info.billing_due_date;
		
		let date_output = new Date();

		let today = date_output.getDay();
		
		if(today > billing_date) {

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

<div
	id="client-billing-container"
	class:events={billing_events_focus}
	class:details={billing_details_focus}
>
	<div id="title">Billing</div>

	<div id="billing-details" class="details-col">
		<div id="billing-name" class="info-row">
			<div id="name-label" class="label">Name:</div>
			<div id="name" class="variable">
				{client_object.company_info.billing_info.billing_name}
			</div>
		</div>
		<div id="billing-address" class="info-row">
			<div id="address-label" class="label">Address:</div>
			<div id="address" class="variable">
				{client_object.company_info.billing_info.billing_address}
			</div>
		</div>
		<div id="billing-due-date" class="info-row">
			<div id="due-date-label" class="label">Next Due:</div>
			<div id="due-date" class="variable">
				{#if client_object.company_info.billing_info.billing_due_date > 0 }
					{getNextBillDueDate()}
				{/if}
			</div>
		</div>
	</div>

	<div id="event-title-row">
		Events
	</div>
	<div id="billing-events">

            {#if billing_events_focus}
                {#each event_list as event_object}
                    {#if event_object.category == 'billing' }
                        <ClientEventBanner {event_object} on:event_banner_click />
                    {/if}
                {/each}
            {:else}
                <ClientEventBanner event_object={event_list[first_billing_event_index]} on:event_banner_click/>
            {/if}
	</div>

	<div
		id="billing-events-focus-toggle"
		on:click={() => (billing_events_focus = !billing_events_focus)}
	>
		<img id="arrow-svg" src="./blue_arrow_svg.svg" alt="Arrow to all billing events" />
	</div>
</div>

<style>
	#client-billing-container {
		height: 35vh;
		flex-grow: 2;
		background-color: var(--box-color);
		border-radius: var(--box-border-radius);
		margin: 1vh 3vw;
		padding: 0 0 5vh 0;
		box-shadow: var(--box-shadow);
		color: black;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		transition: all 1s;
	}
	#title {
		font-family: openSans-medium;
		font-size: 2vw;
		width: 100%;
		text-align: center;
		text-decoration: underline;
	}
	#client-billing-container.events > #billing-details {
		height: 0;
		opacity: 0;
	}

	.details-col {
		display: flex;
		flex-direction: column;
		width: 80%;
		justify-content: space-evenly;
	}
	.label {
		font-family: openSans-lightitalic;
		font-size: 0.8vw;
		width: 4vw;
	}
	.info-row {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-top: 1.5vh;
		
	}
	.variable {
		font-family: openSans-light;
		font-size: 1vw;
		
	}

	#billing-events {
		display: flex;
		flex-direction: column;
		width: 80%;
		transition: all 1s;
	}
	#client-billing-container.events > #billing-events {
		overflow-y: scroll;
	}

	#billing-events-focus-toggle {
		width: 80%;
		display: flex;
		justify-content: center;
	}
	#event-title-row {
		margin-top: auto;
		margin-bottom: 1vh;
        font-family: openSans-medium;
		text-decoration: underline;
		font-size: 1vw;
		user-select: none;
		cursor: pointer;
        text-align: left;
        width: 80%;
	}

	#arrow-svg {
		width: 1vw;
		margin-top: 1vh;
		transform: rotate(-90deg);
		user-select: none;
		cursor: pointer;
		color: black;
		transition: all 1s;
	}
	#client-billing-container.events > #billing-events-focus-toggle > #arrow-svg {
		transform: rotate(90deg);
	}
	@media only screen and (max-width: 615px) {
	}
</style>
