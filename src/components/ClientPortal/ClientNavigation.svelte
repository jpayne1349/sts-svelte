<script>
	export let session_store;

    let session_data = {};

    session_store.subscribe((data)=>{
        session_data = data;
    });

</script>



<div id="company_name">
	{session_data.company_data.company_info.name}
</div>
<div id="user_name">
	<!-- to be logged in user? not sure how I want to handle this yet.. -->
	{session_data.user_data.name}
</div>

<div id="client_links">
	<!-- 
        <div class:active={active_view=='home'} class='links_group' id='home' > Home </div>
        <div class:active={active_view=='profile'} class='links_group' id='profile' > Profile </div>
        <div class:active={active_view=='billing'} class='links_group' id='billing'> Billing </div>
        <div class:active={active_view=='service_log'} class='links_group' id='service_log' > Service Log </div>
 -->
</div>

<style>
	#company_name {
		font-family: openSans-medium;
		font-size: 1.5vw;
		text-align: center;
		margin-top: 3vw;
	}
	#user_name {
		font-family: openSans-light;
		font-size: 0.8vw;
	}

	/* .links_group {
		font-family: openSans-light;
		font-size: 1vw;
		margin: 1vw 0;
		user-select: none;
		cursor: pointer;
	}
	.links_group:hover {
		text-decoration: underline;
	}
	.links_group.active {
		text-decoration: underline;
	} */
</style>
