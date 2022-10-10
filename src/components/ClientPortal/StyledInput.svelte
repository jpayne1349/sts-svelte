<script>

    export let id;

    export let input_value;

    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();

    function inputListenForEnter(event) {
        if(event.keyCode === 13) {
            dispatch('enter','pressed');
        }
    }


</script>

<input type='text' id={id} bind:value={input_value} on:keypress={inputListenForEnter} />

<style>
    input {
        border: none;
        background-color: rgb(230, 230, 230);
        padding: 0 5px;
        height: 1.8vw;
        border-radius: 8px;
        font-size: 1vw; 
        border: 1px solid rgb(193, 193, 193);
        transition: all 0.5s;
        font-family: openSans-light;
        box-shadow: 0px 1px 2px rgb(201, 201, 201);
    }
    input:hover {
        box-shadow: 0px 1px 2px rgb(164, 164, 164);
    }
    input:focus {
        outline: none;
        box-shadow: 0px 1px 2px rgb(164, 164, 164);
    }

</style>