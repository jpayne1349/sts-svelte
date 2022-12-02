<script>
	import { alertStore } from '../stores.js';
	import { fly, fade } from 'svelte/transition';


	const unsubFromAlert = alertStore.subscribe((data) => {
		if (data.show == true) {
			// set to automatically close after 5 seconds
			setTimeout(() => {
            if($alertStore.show) {
				$alertStore.show = false;
                }
			}, 5000);
		}
        
	});


</script>

{#if $alertStore.show}
	<div class="alert" class:error={$alertStore.error} in:fly={{ duration: 500, y: -150 }} out:fade>
		{#if !$alertStore.error}
			<span class="checkmark" />
		{:else}
			<span class="exclamation">!</span>
		{/if}

		{$alertStore.message}

		<button
			class="close-alert"
			on:click={() => {
				$alertStore.show = false;
			}}></button
		>
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
	.close-alert {
		position: absolute;
		top: 13px;
		right: 26px;
		background-color: transparent;
		box-shadow: none;
		
	}
    .close-alert::before, .close-alert::after {
        position: absolute;
		content: '';
		width: 3px;
		height: 15px;
		background-color: white;
		transform: rotate(45deg);
    }
    .close-alert::after {
        transform: rotate(-45deg);
    }

	@media only screen and (max-width: 500px) {
		.alert {
			top: unset;
			bottom: 15px;
		}
        .close-alert {
            top: 5px;
		    right: 25px;
        }
	}
</style>
