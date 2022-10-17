

<script>

    import { getContext } from 'svelte';
    import ClientNavigation from './ClientNavigation.svelte';
    import ClientSignIn from './ClientSignIn.svelte';


    let session_store = getContext('session_store');
    
    let session_data = {};

    session_store.subscribe((data)=>{
        session_data = data;
    });


    export let auto_logging_in;

    // unused variable passed down from layout..
    // export let active_view;


</script>



<div id='client_nav_layout' >

    <a href='https://southtexas.software'>
    <img id='logo_img' src='/sts-icon-v3.svg' alt='STS Logo' />
    </a>

    <div id='client_portal'> Client Portal </div>
  
    {#if session_data.logged_in }
        <ClientNavigation  {session_store} />
    {:else}
        <ClientSignIn {auto_logging_in} />
    {/if}

</div>


<style>

#client_nav_layout {
    background-color: var(--box-color);
    width: 15vw;
    margin: 1vh 0 1vh 1vw;
    border-radius: var(--box-border-radius);
    box-shadow: var(--box-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
}

#logo_img {
    width: 6vw;
    margin-top: 2vw;
}
#client_portal {
    font-family: openSans-lightitalic;
    font-size: .9vw;

}



/* #client_links{
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    justify-content: flex-start;
    text-align: center;
    margin-top: 3vw;
} */


@media only screen and (max-width: 615px) {

	}
</style>