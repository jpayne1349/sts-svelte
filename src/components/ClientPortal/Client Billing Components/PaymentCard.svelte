<script>
    import { slide } from 'svelte/transition';

    export let payment_method;

    let card_info = payment_method.type + ' *' + payment_method.last_four

</script>

<div class='payment-card' transition:slide>
    <div class='center-img'>
        <img class='card' src='payment-card-icon.svg' alt='Card Icon' >
    </div>
    <div class='center-img'>
        {#if payment_method.default }
        <img src='default-tag-icon.svg' alt='Default'>
        {/if}
    </div>
    <div class='card-label'>
        {card_info}
    </div>

</div>



<style>
    .payment-card {
        width: 10vw;
        height: 4vh;
        line-height: 4vh;
        margin: 10px 0;
        padding: 0 10px;
        display: flex;
        position: relative;
        justify-content: space-between;
        box-shadow: 0px 1px 3px grey;
        border-radius: 10px;
        font-family: openSans-regular;
        font-size: 0.8vw;
        cursor:pointer;
    }
    .center-img {
        display: flex;
        align-items: center;
    }
    img.card {
        width: 1.5vw;
        }
    img {
        width:2.5vw;
    }


</style>