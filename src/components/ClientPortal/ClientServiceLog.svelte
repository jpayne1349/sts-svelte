<script>
	import ClientEventBanner from "./ClientEventBanner.svelte";
	import { getContext } from 'svelte';


    let context_object = getContext('client_object');
    let client_object = context_object.client_object;
    let event_list = client_object.event_list;

</script>



<div id='client-servicelog-container' >


	<div id='title' >Service Log</div>

	<div id='events-container' >

	{#each event_list as event_object }
		{#if event_object.category == 'service' }
			<ClientEventBanner {event_object} on:event_banner_click />
		{/if}
	{/each}

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