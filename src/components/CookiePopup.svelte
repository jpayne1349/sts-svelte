<script>

import { afterNavigate } from '$app/navigation';

afterNavigate(( { from })=>{
    // checks if this is first visit of session
    if(from === null) {
        setTimeout(toggleActive, 500);
    }

})

let active = false;

function toggleActive() {
    active = !active;
}

</script>


<div class='cookie-popup' class:active>

    <div class='row'>This website uses cookies to analyze traffic and improve security.</div>
    <div class='row buttons'>
        <a on:click={toggleActive} href='/cookie-policy' class='button policy'>Policy</a>
        <div on:click={toggleActive} class='button okay'>Okay</div>
    </div>


</div>

<style>

.cookie-popup {
    font-family: openSans-light;
    color: #bbbec5;
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 4vh;
    right: 5vw;
    width: 20vw;
    text-align: center;
    padding: 15px;
    background-color: #303F54;
    opacity: .87;
    border-radius: 10px;
    /* making invisible to view and clicks */
    opacity: 0;
    pointer-events: none;
    transform: translateY(3vh);
    transition: all 0.4s;
}
.cookie-popup.active {
    opacity: 1;
    pointer-events: all;
    transform: translateY(0);
}

.buttons {
    display: flex;
    width: 100%;
    justify-content: space-around;
    margin-top: 1vh;
}

.button {
    width: 35%;
    height: 3vh;
    line-height: 3vh;
    border-radius:5px;
    color: white;
    cursor: pointer;
    text-decoration: none;
}
.button.policy {
    background-color: #79808d;
}
.button.okay {
    background-color: #6A91D1;
}

@media only screen and (max-width: 615px) {
    .cookie-popup {
        width: 90vw;
        bottom: 2vh;
        flex-direction: row;
    }
    .buttons {
        margin-top: 0;
        align-items: center;
    }
    .button {
        width: 40%;
        height: 6vh;
        line-height: 6vh;
    }
}

</style>