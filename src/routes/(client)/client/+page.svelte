


<script>

	import ClientProfile from '../../../components/ClientPortal/ClientProfile.svelte';
	import ClientBillingSmall from '../../../components/ClientPortal/Client Billing Components/ClientBillingSmall.svelte';
	import ClientServiceLog from '../../../components/ClientPortal/ClientServiceLog.svelte';
	import ClientEventModal from '../../../components/ClientPortal/ClientEventModal.svelte';
	import ClientBillingFull from '../../../components/ClientPortal/Client Billing Components/ClientBillingFull.svelte';


	let modal_open_bool = false;
	let modal_event_id = undefined;

	let open_modal_object;

	// trying out different views 
	let billing_full = false;
	let profile_full = false;

	function openModal(event) {
		// grab the event object here that's been passed up on the event
		open_modal_object = event.detail;

		modal_open_bool = true;

	}

</script>


<div id="client-page">

	<ClientProfile />
	<ClientBillingSmall on:event_banner_click={openModal} on:show={()=>{billing_full = true;}}/>
	{#if billing_full}
	<ClientBillingFull on:event_banner_click={openModal} show_full_view={true} on:hide={()=>{billing_full = false;}}/>
	{/if}

	<ClientServiceLog on:event_banner_click={openModal} />

	{#if modal_open_bool}
		<ClientEventModal {open_modal_object} on:modal_close_click={()=>modal_open_bool = false} />
	{/if}

</div>


<style>
	#client-page {
		display: flex;
		width: 85vw;
		flex-wrap: wrap;
		color: #bbbec5;
		max-height: 100vh;
	}

	@media only screen and (max-width: 615px) {

	}
</style>
