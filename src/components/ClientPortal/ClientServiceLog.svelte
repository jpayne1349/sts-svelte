<script>
	import ClientEventBanner from './ClientEventBanner.svelte';
	import { getContext, onMount } from 'svelte';

	let session_store = getContext('session_store');
	let session_data = {};
	let session_data_populated = false;


	let unsubscribe = session_store.subscribe((data) => {
			
		session_data = data;

		session_data_populated = true;

	});

	// if session data updated, we need to append the new event to the top of the list and render it in..
	

</script>

<div id="client-servicelog-container">
	<div id="title">Service Log</div>

	<div id='service-events-hide-scroll'>
	<div id="events-container">

		{#if session_data_populated}
			{#each session_data.live_event_list as event_object}
			{#if event_object.category == 'Service'}
				<ClientEventBanner {event_object} on:event_banner_click />
			{/if}
				{/each}
		{/if}
	</div>
	</div>
</div>

<style>
	#client-servicelog-container {
		height: 35vh;
		flex-grow: 1;
		background-color: var(--box-color);
		border-radius: var(--box-border-radius);
		margin: 1vh 3vw;
		padding: 0 0 3vh 0;
		box-shadow: var(--box-shadow);
		color: black;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		transition: all 1s;
	}
	#title {
		font-family: openSans-boldItalic;
		color: #394b67;
		font-size: 2vw;
	}
	#service-events-hide-scroll{
		width: 85%;
		height:100%;
		overflow: hidden;
	}
	#events-container {
		margin-top: 15px;
		width: 100%;
		overflow-y: scroll;
		padding-right: 17px;
		box-sizing: content-box;
	}

	@media only screen and (max-width: 615px) {
	}
</style>
