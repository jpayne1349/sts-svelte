<script>

import { fly } from 'svelte/transition';
import { sessionStore } from '/src/routes/client/stores.js';
import { page } from '$app/stores';
import { onMount, createEventDispatcher } from 'svelte';


let show_nav = false;
let fix_menu = false;
let menu_icon;

let unsub_listener = page.subscribe((storeData)=>{
    show_nav = false;
});


</script>


<button class='menu-icon-container' on:click={()=>{show_nav = !show_nav}} class:fixed={fix_menu} bind:this={menu_icon}  >
    {#if !show_nav}
    <div class='menu-icon-bar one' transition:fly={{y:8}}/>
    {/if}
    <div class='menu-icon-bar two'/>
    {#if !show_nav}
    <div class='menu-icon-bar three' transition:fly={{y:-8}}/>
    {/if} 
</button>

{#if show_nav }

<div class='nav-links' in:fly={{y:-200}}>

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

        .menu-icon-container {
            position: absolute;
            right: 40px;
            width: 20px;
            background-color: transparent;
            margin: 0;
            box-shadow: none;
            padding: 20px;
        }

        .menu-icon-bar{
            position: absolute;
            content: '';
            width: 25px;
            height: 3px;
            background-color: var(--text);
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
            top: 60px;
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
            color: #020d1f;
        }


    }

</style>