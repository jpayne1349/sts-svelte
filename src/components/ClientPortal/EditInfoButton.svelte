<script>
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();

    

</script>

<button id='edit-info-button' on:click={(event)=>{dispatch('clicked', 'edit');}}>
		<div class='pencil-icon-wrapper' ><img class='pencil-icon' src='./edit_pencil_icon.svg' alt='Edit Icon' ></div>
		<div class='edit-button-text' >Edit</div>
	</button>

<style>

    #edit-info-button {
		z-index: 3;
		font-family: openSans-light;
		font-size: 0.8vw;
		display: flex;
		border-radius: 5px;
		/* background-color: grey; */
		/* box-shadow: 0 1px 2px rgb(49, 49, 49); */
		width: 3.3vw;
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

	#edit-info-button:hover {
		box-shadow: 0 1px 3px grey;
	}

	.pencil-icon-wrapper {
		height: 100%;
		display: flex;
		align-items: center;
	}

	.pencil-icon {
		width: 0.8vw;
	}

</style>