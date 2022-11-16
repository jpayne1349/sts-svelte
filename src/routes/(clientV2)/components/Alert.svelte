<script>

import { alertStore } from '../client/stores.js';
import {fly, fade} from 'svelte/transition';



$: if($alertStore.show == true) {
    setTimeout(()=>{
            $alertStore.show = false;
        }, 8000);
}


</script>

{#if $alertStore.show}

<div class='alert' class:error={$alertStore.error} in:fly={{duration:500, y:-150}} out:fade>

    {#if !$alertStore.error}
        <span class='checkmark'></span>
    {:else}
        <span class='exclamation'>!</span>
    {/if}

    {$alertStore.message}
</div>

{/if}

<style>

.alert {
    position: fixed;
    top: 20vh;
    border-radius: 5px;
    width: 400px;
    height: 50px;
    line-height: 30px;
    padding: 10px;
    background-color: var(--alert-blue);
    box-shadow: var(--box-shadow);
    font-family: openSans-bold;
    color: white;
    text-align: center;
    font-size: 18px;
    z-index: 100;
}
.alert.error {
    background-color: var(--alert-red);
}
.checkmark {
    position: absolute;
    content: '';
    width: 10px;
    height: 20px;
    border-bottom: 4px solid white;
    border-right: 4px solid white;
    left: 20px;
    top: 13px;
    transform: rotate(35deg);
}
.exclamation {
    position: absolute;
    font-family: openSans-extrabold;
    left: 20px;
    top: 10px;
    color: white;
    font-size: 25px;
}


@media only screen and (max-width: 500px) {
    .alert {
        top: unset;
        bottom: 15px;
    }
}

</style>