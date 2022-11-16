<script>
	import { fly } from 'svelte/transition';
	import { subscriptionSetupStore } from '../../stores';
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();

	export let price;
	export let title;
	export let details;
    export let animation_delay

	let selected = false;
</script>





<button
	class="plan-option"
	on:click={() => {
		selected = !selected;
		dispatch('clicked', selected);
	}}
	class:selected
	in:fly={{ y: -20, delay:animation_delay, duration:800 }}
>

<img class="dropdown-90" src="../../dropdown-90.svg" alt="arrow" />

	<div class="plan-option-price">+ ${price} USD</div>

	<div class="border-bar" />

	<div class="plan-option-info">
		<h5 class="plan-option-title">{title}</h5>
		<p class="plan-option-details">{details}</p>
	</div>
</button>




<style>

    .dropdown-90 {
        position: absolute;
        height: 22px;
        left: -25px;
        bottom: 45%;
    }
	.plan-option {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 90%;
		position: relative;
		box-shadow: 0px 1px 2px grey;
		border-radius: 15px;
		padding: 6px 0;
		cursor: pointer;
		align-self: flex-end;
		color: var(--dark-blue);
		background-color: white;
		height: fit-content;
		transition: 0.3s all;
        margin-top: -20px;
        border: 2px solid transparent;
	}
	.plan-option.selected {
		/* box-shadow: 0px 1px 6px var(--global-green); */
        border: 2px solid var(--global-green);
        
	}

	.plan-option-price {
		font-family: openSans-regular;
		font-size: 14px;
		flex-basis: 100px;
		text-align: center;
	}
	.border-bar {
		height: 40px;
		border-right: 1px solid var(--bar-blue);
	}
	.plan-option-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-basis: 250px;
	}
	.plan-option-title {
		font-family: openSans-regular;
		font-size: 13px;
		color: var(--dark-blue);
	}
	.plan-option-details {
		font-family: openSans-light;
		font-size: 12px;
		color: var(--dark-blue);
		text-align: center;
	}

	@media only screen and (max-width: 500px) {
		.plan-option {
			width: 70vw;
			padding: 8px 10px;
            margin-top: -10px;
		}
        .plan-option-title {
            font-size: 13px;
        }
		.plan-option-price {
			flex-basis: 20vw;
		}
		.plan-option-info {
			flex-basis: 40vw;
		}
		.border-bar {
			height: 10vw;
			border-right: 1px solid var(--bar-blue);
		}
	}
</style>
