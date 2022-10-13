<script>
	import ClientEventBanner from './ClientEventBanner.svelte';
	import { getContext, onMount } from 'svelte';

	let session_store = getContext('session_store');
	let session_data = {};
	let event_list = [];


	let unsubscribe = session_store.subscribe((data) => {
			session_data = data;
			event_list = session_data.company_data.event_list;
	});

</script>

<div id="client-servicelog-container">
	<div id="title">Service Log</div>

	<div id="events-container">

		{#if session_data.company_data.event_list}
			{#each event_list as event_object}
				{#if event_object.category == 'service'}
					<ClientEventBanner {event_object} on:event_banner_click />
				{/if}
			{/each}
		{/if}

	</div>
</div>

<style>
	#client-servicelog-container {
		height: 35vh;
		flex-grow: 1;
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
		text-decoration: underline;
	}
	#events-container {
		margin-top: 15px;
		width: 80%;
	}

	@media only screen and (max-width: 615px) {
	}
</style>
