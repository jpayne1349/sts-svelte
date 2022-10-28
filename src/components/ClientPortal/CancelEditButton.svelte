
<script>
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();

    

</script>

<button id='cancel-info-button' on:click={(event)=>{dispatch('clicked', 'cancel');}}>
		<div class='cancel-icon-wrapper' >X</div>
		<div class='cancel-button-text' >Cancel</div>
	</button>

<style>

    #cancel-info-button {
		z-index: 3;
		font-family: openSans-light;
		font-size: 0.8vw;
		display: flex;
		border-radius: 5px;
		/* background-color: grey; */
		/* box-shadow: 0 1px 2px rgb(49, 49, 49); */
		width: 4vw;
		height: 1.2vw;
		justify-content: space-evenly;
		align-items: center;
		position: absolute;
		left: .5vw;
		top: .8vw;
		cursor: pointer;
		user-select: none;
		transition: all 0.2s;
	}

	#cancel-info-button:hover {
		box-shadow: 0 1px 3px grey;
	}

	.cancel-icon-wrapper {
		height: 100%;
		display: flex;
		align-items: center;
        font-family: openSans-semibold;
        color: red;
	}
</style>