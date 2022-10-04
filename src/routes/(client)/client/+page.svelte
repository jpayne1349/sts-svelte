
<svelte:head>
	<title>
		Client Portal | SouthTexas.Software
	</title>
	<meta name='description' 
	content="Client access to manage profile, billing, services, and secure messaging.">
</svelte:head>

<script>

	import ClientProfile from '../../../components/ClientPortal/ClientProfile.svelte';
	import ClientBilling from '../../../components/ClientPortal/ClientBilling.svelte';
	import ClientServiceLog from '../../../components/ClientPortal/ClientServiceLog.svelte';
	import ClientEventModal from '../../../components/ClientPortal/ClientEventModal.svelte';

	let modal_open_bool = false;
	let modal_event_id = undefined;

	let open_modal_object;


	function openModal(event) {
		// grab the event object here that's been passed up on the event
		open_modal_object = event.detail;

		modal_open_bool = true;

	}

</script>


<div id="client-page">

	<ClientProfile />
	<ClientBilling on:event_banner_click={openModal} />
	<ClientServiceLog on:event_banner_click={openModal} />

	{#if modal_open_bool}
		<ClientEventModal {open_modal_object} on:modal_close_click={()=>modal_open_bool = false} />
	{/if}

</div>


<style>
	#client-page {
		display: flex;
		width: 80vw;
		flex-wrap: wrap;
		color: #bbbec5;
		max-height: 100vh;
	}

	@media only screen and (max-width: 615px) {

	}
</style>
