<script>
	// an object with data to be imported here
	export let event_object;

	import InvoiceIcon from "./InvoiceIcon.svelte";
	import ServiceIcon from "./ServiceIcon.svelte";

	import { createEventDispatcher } from 'svelte';

	const dispatchEvent = createEventDispatcher();

	function open_modal() {

		dispatchEvent('event_banner_click', event_object);

	}


</script>



<div class="event-banner-container" on:click={open_modal} >
	<div class="event-banner-icon">
		{#if event_object.category == 'billing'}

			<InvoiceIcon />
		
		{:else if event_object.category == 'service'}

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

	<div class="event-col second">
		<div class="event-info-row">
			<div class="italic-label">
				{event_object.custom_attributes[0].title}
			</div>
			<div class="event-title">
				{event_object.custom_attributes[0].value}
			</div>
		</div>
		<div class="event-info-row">
			<div class='timestamp' >
				{event_object.timestamp_part}
			</div>
		</div>
	</div>

</div>




<style>

    .event-banner-container {
        display: flex;
        position: relative;
        justify-content: space-between;
		border-bottom: 2px solid #979797;
		padding-bottom: 3px;
		user-select: none;
		cursor: pointer;
		
	}

	.event-banner-container:hover {
		border-bottom: 2px solid #868585;
		background-color:#dddddd;
	}
    .event-banner-icon {
		/* width: 1.7vw; */
		padding: 6px 0;
		cursor: pointer;
		position: absolute;
		display: flex;

		height: 100%;
        left: 4px;
		
    }
	.event-col {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.event-col.first {
		margin-left: 2.5vw;
	}
	.event-col.second {
		align-items: flex-end;
	}
    .event-info-row {
        display: flex;
		
    }
	.event-info-row.status {
		margin-left: 5px;
	}
    .italic-label {
        font-family: openSans-lightItalic;
        font-size: 0.8vw;
		margin-right: 5px;
    }
    .event-title {
        font-family: openSans-regular;
        font-size: 0.8vw;
    }
    .timestamp {
        font-family: openSans-light;
        font-size: 0.5vw;
		cursor:pointer;
		user-select: none;
    }
	@media only screen and (max-width: 615px) {
	}
</style>
