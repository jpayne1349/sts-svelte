<script>

import { onMount } from 'svelte';
import { fly } from 'svelte/transition';

let show = false;

onMount(()=>{
    show = true;
});

export let data;

let pageMessage = "We're cancelling the account associated and will prevent any future usage.";

if(data.error) {
    pageMessage = 'Something went wrong decoding your email link.';
}

</script>

{#if show}
<section in:fly={{y:-100}}>
    <h3>Thanks for reporting this email!</h3>

    <p> { pageMessage } </p>

    {#if data.error}
        <p> We've notified our team to look into it, we appreciate your understanding.</p>
    {/if}

</section>
{/if}

<style>
    
    section {
    background-color: rgba(255, 255, 255, 0.837);
    padding: 15px;
    border-radius: 15px;
    box-shadow: 0px 1px 2px rgb(71, 71, 71);
    align-self: center;
    display: flex;
    flex-direction: column;
    color: #122745;
    width: 500px;
    height: 500px;
    align-items: center;
    justify-content: center;
    margin: auto 0;
    }
    h3 {
        font-family: openSans-semibold;
        font-size: 30px;
        
    }
    p {
        font-family: openSans-regular;
        font-size: 20px;
        text-align: center;
        margin-top: 50px;
    }

    @media only screen and (max-width: 500px) {
        section {
            width: 90vw;
            height: 50vh;
        }
        h3 {
            font-size: 5vw;
            text-align: center;
            padding: 0;
        }
        p {
            font-size: 4vw;
            padding: 0 25px;
        }
    }

</style>