<script>

    import { onMount } from 'svelte';
    import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";

    const dispatchEvent = createEventDispatcher();
    
    export let open_modal_object;


</script>

<!-- modal popup for more details on events -->
<div id="page-blur" />

<div id="event-modal" in:fly="{{delay: 0, duration: 400, x: 0, y: 100, opacity: 0}}">

	<div id="close-modal" on:click={()=>{dispatchEvent('modal_close_click', open_modal_object.eid)}}>
		<img src="./X_svg.svg" alt="Close Button" />
	</div>

	<div id="modal-title">
		{open_modal_object.title}
	</div>

	<div id="modal-body">
		<div id="modal-info" class="column">
			<div id="event-type" class="info-row">
				<div id="type-label" class="label">Event Type:</div>
				<div id="type-variable" class="variable">{open_modal_object.type}</div>
			</div>

			<div id="event-status" class="info-row">
				<div id="status-label" class="label">Event Status:</div>
				<div id="status-variable" class="variable">{open_modal_object.status}</div>
			</div>

			<!-- loop through any other custom attributes -->
			{#each open_modal_object.custom_attributes as attribute}
				<div class="info-row">
					<div class="label">{attribute.title}:</div>
					<div class="variable">{attribute.value}</div>
				</div>
			{/each}
		</div>

		<div id="modal-attachment" class="column">
			<!-- TODO: file attachment screenshot, etc. click to show in seperate window for download? -->
			<div id="image-placeholder">
            </div>
		</div>

	</div>

    <div id='modal-footer' >

        <div id='modal-id' class='footer-row'>
            <div id='id-label'>Event ID:</div>
            <div id='eid'>{open_modal_object.eid}</div>
        </div>
        <div id='timestamp' class='footer-row'>
            <div id='timestamp-label'>Timestamp:</div>
            <div id='timestamp-full'>{open_modal_object.timestamp_full}</div>
        </div>


    </div>

</div>

<style>
	#page-blur {
		position: absolute;
		width: 79.3vw;
		height: 99.8vh;
		left: 20.7vw;
		top: 0;

		backdrop-filter: brightness(50%);
		-webkit-backdrop-filter: brightness(50%);
	}

	#event-modal {
		width: 50vw;
		height: 35vw;
		background-color: var(--box-color);
		border-radius: 15px;
		box-shadow: var(--box-shadow);
		color: black;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		left: 35vw;
		align-self: center;
		transition: all 1s;
	}

    #close-modal {
        position: absolute;
        right: 1vw;
        top: 1vw;
        cursor: pointer;
        user-select: none;
    }

    #modal-title {
        font-family: openSans-medium;
        font-size: 2vw;
        text-decoration: underline;
        margin-top: 1vh;
        user-select: none;
    }

    #modal-body {
        display: flex;
        width: 100%;
        justify-content: space-around;
        margin: 3vh 0;
        flex-grow: 2;
        user-select: none;
    }
    .column {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-evenly;
        padding: 5vh 0;
        align-items: center;
    }
    .info-row {
        display: flex;
        width: 100%;
        justify-content: space-between;
    }
    .label, #id-label {
        font-family: openSans-lightitalic;
        font-size: 1.2vw;
    }
    .variable, #eid {
        font-family: openSans-regular;
        font-size: 1.2vw;
        margin-left: 10px;
    }
    #modal-attachment {
        height: 100%;
        width: 17.7vw;
        padding: 2vw 2vw;
       
    }
    #image-placeholder {
        height: 100%;
        width: 100%;
        background-color: rgb(187, 187, 187);
        border-radius: 5px;
    }
    #modal-footer {
        width: 100%;
        align-items: center;
        display: flex;
        flex-direction: column;
        user-select: none;
    }
    .footer-row {
        display: flex;
    }
    #timestamp {
        margin-bottom: 10px;
    }
    #timestamp-label {
        font-family: openSans-lightitalic;
        font-size: 0.9vw;
    }
    #timestamp {
        font-family: openSans-regular;
        font-size: 0.9vw;
        margin-left: 10px;
    }

    @media only screen and (max-width: 615px) {
	}


</style>
