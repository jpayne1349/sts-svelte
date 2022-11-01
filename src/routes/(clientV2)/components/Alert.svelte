<script>

import { alertStore } from '../v2/client/stores.js';
import {fly, fade} from 'svelte/transition';



$: if($alertStore.show == true) {
    setTimeout(()=>{
            $alertStore.show = false;
        }, 4000);
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
    position: absolute;
    top: 16vh;
    border-radius: 5px;
    width: 30vw;
    height: 5vh;
    line-height: 3.5vh;
    padding: 1vh;
    background-color: var(--alert-blue);
    box-shadow: 0px 1px 2px rgb(185, 185, 185);
    font-family: openSans-bold;
    color: white;
    text-align: center;
    font-size: 1vw;
}
.alert.error {
    background-color: var(--alert-red);
}
.checkmark {
    position: absolute;
    content: '';
    width: 1vh;
    height: 2vh;
    border-bottom: 4px solid white;
    border-right: 4px solid white;
    left: 1vw;
    top: 1.5vh;
    transform: rotate(35deg);
}
.exclamation {
    position: absolute;
    font-family: openSans-extrabold;
    left: 1.5vw;
    top: 0.8vh;
    color: white;
    font-size: 2vh;
}


@media only screen and (max-width: 500px) {
    .alert {
        width: 90vw;
        top: 10vh;
        font-size: 4vw;
        line-height: 3vh;
    }
    .checkmark {
        left: 5vw;

    }
    .exclamation {
        font-size: 5vw;
        left: 4vw;
        top: 1vh;
    }
}

</style>