<script>
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();

    

</script>

<button id='save-info-button' on:click={(event)=>{dispatch('clicked', 'save');}} >
		<div class='save-icon-wrapper' ><div id="checkmark" /></div>
		<div class='save-button-text' >Save</div>
	</button>

<style>

    #save-info-button {
		z-index: 3;
		font-family: openSans-light;
		font-size: 0.8vw;
		display: flex;
		border-radius: 5px;
		/* background-color: grey; */
		/* box-shadow: 0 1px 2px rgb(49, 49, 49); */
		width: 3.8vw;
		height: 1.2vw;
		justify-content: space-evenly;
		align-items: center;
		position: absolute;
		left: 5vw;
		top: .8vw;
		cursor: pointer;
		user-select: none;
		transition: all 0.2s;
	}

	#save-info-button:hover {
		box-shadow: 0 1px 3px grey;
	}

	.save-icon-wrapper {
		height: 100%;
		display: flex;
		align-items: center;
	}

    #checkmark {
		content: '';
		height: 0.7vw;
		width: 0.3vw;
		/* position: absolute;
		top: 0.3vw;
		left: 0.7vw; */
		border-right: 0.2vw solid green;
		border-bottom: 0.2vw solid green;
		transform: rotate(45deg);
		opacity: 1;
		transition: all 0.2s;
	}

</style>