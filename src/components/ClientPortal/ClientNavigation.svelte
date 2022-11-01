<script>
    import { signOut } from 'firebase/auth';

export let session_store;

    let session_data = {};

    session_store.subscribe((data)=>{
        session_data = data;
    });

    function handleSignOut() {
        // call firebase function to sign out currentUser and then update the session_store
        signOut(session_data.auth_data);
        
    }

</script>



<div id="company_name">
	{session_data.company.profile.name}
</div>
<div id="user_name">
	<!-- to be logged in user? not sure how I want to handle this yet.. -->
	{session_data.user.name}
</div>
<div class='btn'>Daisy Button</div>
<div id="client_links">
	<!-- 
        <div class:active={active_view=='home'} class='links_group' id='home' > Home </div>
        <div class:active={active_view=='profile'} class='links_group' id='profile' > Profile </div>
        <div class:active={active_view=='billing'} class='links_group' id='billing'> Billing </div>
        <div class:active={active_view=='service_log'} class='links_group' id='service_log' > Service Log </div>
 -->
</div>

<button id='sign-out-container' on:click={handleSignOut} >
    <img src='./sign-out-icon.svg' alt='Sign Out Icon'>
    <div id='sign-out-text' >Sign Out</div>
</button>

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

    #sign-out-container {
		display: flex;
		margin-top: auto;
		margin-bottom: 4vh;
		font-family: 'openSans-regular';
        user-select: none;
        cursor: pointer;
		position: relative;
		align-items: center;
		transform: translateX(-0.8vw);
		background-color: var(--box-color);
	}
    #sign-out-text {
        margin-left: 0.5vw;
		font-size: 0.8vw;
    }
	img {
		height: 0.8vw;
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
