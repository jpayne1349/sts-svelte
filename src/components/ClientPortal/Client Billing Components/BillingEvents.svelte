<script>
	import ClientEventBanner from '../ClientEventBanner.svelte';

	import { getContext } from 'svelte';
	import { flip } from 'svelte/animate';

	let session_store = getContext('session_store');

	let session_data = {};
	let event_list = [];
	let first_billing_event_index = 0;
	let billing_event_exists = false;

	let unsubscribe = session_store.subscribe((data) => {
		session_data = data;
	});

	// toggle showing all events

	let billing_events_focus = false;
	export let show_full_view;

	if (show_full_view) {
		billing_events_focus = true;
	}
</script>

<div id="billing-events-container">
	<div id="event-title-row">Billing Events</div>
	<div id="events-list-hide-scroll">
		<div id="billing-events-list" class:focus={billing_events_focus}>
			{#each session_data.live_event_list as event_object (event_object.eid)}
				<div animate:flip>
					{#if event_object.category == 'Billing'}
						<ClientEventBanner {event_object} on:event_banner_click />
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<button
		id="billing-events-focus-toggle"
		on:click={() => (billing_events_focus = !billing_events_focus)}
	>
		<img
			class:down={billing_events_focus}
			id="arrow-svg"
			class="up"
			src="./blue_arrow_svg.svg"
			alt="Arrow to all billing events"
		/>
	</button>
</div>

<style>
	#billing-events-container {
		width: 80%;
		bottom: 2vh;
		position: absolute;
		background-color: var(--box-color);
		z-index: 5;
	}
	#events-list-hide-scroll {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	#billing-events-list {
		display: flex;
		flex-direction: column;
		width: 100%;
		transition: all 1s;
		height: 5vh;
		overflow-y: scroll;
		padding-right: 17px;
		box-sizing: content-box;
		transition: all 1s;
		background-color: var(--box-color);
	}
	#billing-events-list.focus {
		height: 22vh;
	}
	#billing-events-focus-toggle {
		width: 100%;
		display: flex;
		justify-content: center;
		background-color: var(--box-color);
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

		user-select: none;
		cursor: pointer;
		color: black;
		transition: all 1s;
	}
	#arrow-svg.up {
		transform: rotate(-90deg);
	}
	#arrow-svg.down {
		transform: rotate(90deg);
	}
</style>
