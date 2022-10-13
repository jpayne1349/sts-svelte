<script>
    import FacebookIcon from "./FacebookIcon.svelte";
    import GoogleIcon from "./GoogleIcon.svelte";
    import StsIcon from "./StsIcon.svelte";
    import { createEventDispatcher } from "svelte";
    
    let dispatch = createEventDispatcher();

    function handleUsernameClick(event) {
       
        dispatch('sts_account','username_password');
    }

	export let company_data;


</script>

<div id="title">How would you like to create your user account?</div>

<div on:click={handleUsernameClick} id="username-method" class="button-container">
	<div class="logo">
		<StsIcon />
	</div>
	<div class="button-text">Username & Password</div>
</div>

<div id="google-method" class="button-container">
	<div class="logo">
        <GoogleIcon />
    </div>
	<div class="button-text">Continue with Google</div>
</div>

<div id="facebook-method" class="button-container">
	<div class="logo" >
        <FacebookIcon />
    </div>
	<div class="button-text">Continue with Facebook</div>
</div>

{#if company_data.company_name_entered }
<div id='company-line'>
    <div id='company-label'>Company:</div>
    <div id='company-variable'>{company_data.company_name}</div>
</div>
{/if}

<style>

#title {
    font-family: openSans-regular;
    font-size: 1.8vw;
    margin-top: 3vh;
}

.button-container {
    display: flex;
    width: 19vw;
    font-family: openSans-regular;
    font-size: 1.3vw;
    background-color: white;
    border-radius: 1vw;
    justify-content: space-between;
    box-shadow: 0px 1px 4px rgb(165, 165, 165);
    height: 3vw;
    align-items: center;
    margin-top: 3vh;
    cursor: pointer;
    transition: all 0.2s;
}
.button-container:hover {
    box-shadow: 0px 1px 2px rgb(165, 165, 165);
}
.logo {
    width: 2vw;
    margin: 1vh;
    display: flex;
}
.button-text {
    margin-right: 1vh;
    width: 15vw;
    text-align: center;
}

#company-line {
    display: flex;
    justify-content: center;
    margin-top: auto;
    margin-bottom: 1vh;
}
#company-label {
    font-family: openSans-lightitalic;
    font-size: 1.4vw;
}
#company-variable {
    font-family: openSans-regular;
    font-size: 1.4vw;
    margin-left: 0.5vw;
}

</style>
