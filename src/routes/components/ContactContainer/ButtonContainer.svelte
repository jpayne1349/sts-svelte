<script>

import { createEventDispatcher } from 'svelte';
export let validation;
const dispatch = createEventDispatcher();

// validate form first..
function dispatchClick(type) {
    dispatch(
        'message',
        { type: type},
    );

}

function validateAndSend() {
    if(validation) {
        dispatchClick('send');
    }
}

</script>



<button on:click={()=>dispatchClick('clear')} id='clear-button' class='button' >Clear</button>

<button class:active={validation} on:click={validateAndSend} id='send-button' class='button' >Send</button>


<style>

.button {
	width: 85px;
	font-family: openSans-light;
	box-shadow: 0 1px 2px 0 rgba(0,0,0,0.50);
	color: white;
	border-radius: 8px;
	margin: 0 10px;
	text-align: center;
	height: 24px;
	line-height: 24px;
	cursor: pointer;
	font-size: 16px;
	user-select: none;
}
    #clear-button {
        background: #5F6878;
    }
    #clear-button:hover {
        background: #5f6878ea;
    }
    #send-button {
        background: #93a5c2;
        color: grey;
        transition: all 0.5s;
        cursor: default;
    }
    #send-button.active {
        background: #6A91D1;
        color: white;
        cursor: pointer;
    }
    #send-button.active:hover {
        background: #6a92d1e5;
    }
    @media only screen and (max-width: 615px) {
        .button {
            width: 20vw;
            height: 7vw;
            line-height: 7vw;
            font-size: 4vw;
        }
    }

</style>