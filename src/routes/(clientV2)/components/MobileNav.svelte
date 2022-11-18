<script>

import { fly } from 'svelte/transition';
import { sessionStore } from '../client/stores';
import { page } from '$app/stores';
import { onMount } from 'svelte';


let show_nav = false;
let fix_menu = false;
let menu_icon;

let unsub_listener = page.subscribe((storeData)=>{
    show_nav = false;
});


</script>




<div class="logo-wrapper">
		<a href="https://southtexas.software" alt="South Texas Sofware Homepage"
			><img src="/../sts-logo-regular.svg" alt="STS Logo" /></a
		>
</div>

<nav class='menu-bar' >
<button class='menu-icon-container' on:click={()=>{show_nav = !show_nav}} class:fixed={fix_menu} bind:this={menu_icon}  >
    {#if !show_nav}
    <div class='menu-icon-bar one' transition:fly={{y:8}}/>
    {/if}
    <div class='menu-icon-bar two'/>
    {#if !show_nav}
    <div class='menu-icon-bar three' transition:fly={{y:-8}}/>
    {/if} 
</button>
</nav>

<div class='divider-bar'></div>

{#if show_nav }
<div class='nav-links' transition:fly={{y:-200}}>

    <div class='link-group'>
        <a class='head' href="/" alt="Home">Home</a>
        <a href="/services" alt="Services">Services</a>
        <a href="/pricing" alt="Pricing">Pricing</a>
        <a href="/contact-us" alt="Contact Us">Contact</a>
    </div>
    <div class='link-group'>
        <a class='head' href="/client" alt="Client Portal">Client Portal</a>
        {#if $sessionStore.logged_in }
            <a href="/client/portal/overview" alt="Overview">Overview</a>
            <a href="/client/portal/profile" alt="profile">Profile</a>
            <a href="/client/portal/billing" alt="billing">Billing</a>
            <a href="/client/portal/development" alt="development">Development</a>
        {:else}
            <a href="/client/sign-in" alt="Sign In">Sign In</a>
            <a href="/client/create-account" alt="Create Account">Create Account</a>
        {/if}
        
    </div>

</div>
{/if}


<style>
    

    @media only screen and (max-width: 500px) {

        .logo-wrapper {
            position: absolute;
            z-index: 22;
            top: -20px;
            
        }
        .logo-wrapper a img{
            height: 125px;
        }
        .menu-bar {
            display: flex;
            width: 100vw;
            height: 50px;
            background-color: white;
            border-radius: 0;
            top: 0;
            margin-top: 20px;
            margin-bottom: 0px;
            padding-bottom: 0px;
            justify-content: flex-end;
            user-select: none;
            z-index: 15;
            position: sticky;
            position: -webkit-sticky;
            box-sizing: content-box;
        }
        .menu-icon-container {
            position: relative;
            width: 25px;
            background-color: transparent;
            margin: 0;
            box-shadow: none;
            margin-right: 5vw;
        }
        .divider-bar {
            width: 100vw;
            height: 1px;
            /* box-shadow: 0px 1px 1px lightgray; */
            /* margin-top: 20px; */
            position: sticky;
            position: -webkit-sticky;
            top: 50px;
        }

        .menu-icon-bar{
            position: absolute;
            content: '';
            width: 100%;
            height: 3px;
            background-color: var(--dark-blue);
            border-radius: 5px;
            transition: all 0.5s;
        }
        .menu-icon-bar.one {
            transform: translateY(-8px);
        }
        .menu-icon-bar.three {
            transform: translateY(8px);
        }
        .nav-links {
            position: fixed;
            width:95vw;
            background-color: white;
            box-shadow: var(--box-shadow);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            min-height: 55vh;
            top: 75px;
            z-index: 25;
        }
        .link-group {
            display: flex;
            flex-direction: column;
            width: 100%;
        }
        .link-group a.head {
            padding-left: 20px;
            background-color: #12274508;
        }
        .link-group a {
            font-family: openSans-bold;
            font-size: 18px;
            padding: 15px 50px;
            border-bottom: 1px solid #1227452f;
            width: 100%;
            color: var(--dark-blue);
        }


    }

</style>