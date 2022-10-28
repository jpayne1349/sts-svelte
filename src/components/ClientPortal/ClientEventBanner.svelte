<script>
	// an object with data to be imported here
	export let event_object;

	import InvoiceIcon from "./InvoiceIcon.svelte";
	import ServiceIcon from "./ServiceIcon.svelte";

	import { createEventDispatcher } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	

	const dispatchEvent = createEventDispatcher();

	function open_modal() {

		dispatchEvent('event_banner_click', event_object);

	}

	let created_date;

	if ( event_object.created) {
	created_date = new Date(event_object.created.seconds * 1000);
	}

	if(event_object.upated) {
		// change the date string and prepend something like upd: to show that it's the updated timestamp, etc.
	}

	created_date = created_date.toDateString();

	let date_string = created_date.substring(0,15);

	// attempt to show different type of banner based on width
	let banner_width;
	let breakpoint = 15;
	let banner_shrink = false;

</script>



<button class="event-banner-container" on:click={open_modal} bind:clientWidth={banner_width} in:slide|local={{duration:1000}} >
	<div class="event-banner-icon">
		{#if event_object.category == 'Billing'}

			<InvoiceIcon />
		
		{:else if event_object.category == 'Service'}

			<ServiceIcon />

		{/if}

		</div>
		
	<div class="event-col first">
		<div class="event-info-row">
			<div class="italic-label">
				{event_object.type} Event -
			</div>
			
			<div class="event-title">
				{event_object.title}
			</div>
		</div>
		<div class="event-info-row status">
			<div class="italic-label">Status:</div>
			<div class="event-title">
				{event_object.status}
			</div>
		</div>
	</div>

	{#if banner_width > 475}
	<div class="event-col second" in:fade>
		<div class="event-info-row">
			<div class="italic-label">
				{event_object.custom_data[0].key}:
			</div>
			<div class="event-title">
				{event_object.custom_data[0].value}
			</div>
		</div>
		<div class="event-info-row">
			<div class='timestamp' >
				{date_string}
			</div>
		</div>
	</div>
	{/if}

</button>




<style>

    .event-banner-container {
        display: flex;
        position: relative;
        /* justify-content: space-between; */
		border-bottom: 2px solid #394b67;
		padding-bottom: 3px;
		user-select: none;
		cursor: pointer;
		width: 100%;
		transition: all 0.2s;
		background-color: var(--box-color);
	}

	.event-banner-container:hover {
		border-bottom: 2px solid #868585;
		background-color:#e3e3e3;
	}
    .event-banner-icon {
		/* width: 1.7vw; */
		padding: 6px 0;
		cursor: pointer;
		/* position: absolute; */
		display: flex;
		width: 1.6vw;
		
    }
	.event-col {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.event-col.first {
		/* margin-left: 2.5vw; */
		margin-left:5px;
	}
	.event-col.second {
		align-items: flex-end;
		margin-left: auto;
		
	}
    .event-info-row {
        display: flex;
		
    }
	.event-info-row.status {
		margin-left: 5px;
	}
    .italic-label {
        font-family: openSans-light;
        font-size: 0.8vw;
		margin-right: 5px;
    }
    .event-title {
        font-family: openSans-regular;
        font-size: 0.8vw;
    }
    .timestamp {
        font-family: openSans-semibold;
        font-size: 0.7vw;
		cursor:pointer;
		user-select: none;
    }
	@media only screen and (max-width: 615px) {
	}
</style>
