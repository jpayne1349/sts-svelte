<script>
	import { fly } from 'svelte/transition';
	import { subscriptionSetupStore } from '../../stores';
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();

	export let price;
	export let title;
	export let details;
	export let value;
	export let hourly;

	let selected = false;
</script>

<button
	class="service-plan"
	on:click={() => {
		selected = !selected;
		dispatch('clicked', selected);
	}}
	class:selected
	in:fly={{ y: -20 }}
>
	<div class="service-plan-price">
		{#if hourly}
		    {hourly}
		{:else}
			${price} USD
			{#if value}
				<br />
				<span class="value-percentage">+ 3% / transaction</span>
			{/if}
		{/if}
	</div>

	<div class="border-bar" />

	<div class="service-plan-info">
		<h5 class="service-plan-title">{title}</h5>
		<p class="service-plan-details">{details}</p>
	</div>
</button>

<style>
	.service-plan {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		position: relative;
		box-shadow: 0px 1px 2px grey;
		border-radius: 15px;
		padding: 6px 0;
		cursor: pointer;
		align-self: flex-end;
		color: var(--main);
		background-color: white;
		height: fit-content;
		transition: 0.3s all;
		border: 2px solid transparent;
	}
	.service-plan.selected {
		border: 2px solid var(--global-green);
	}

	.service-plan-price {
		font-family: openSans-regular;
		font-size: 14px;
		flex-basis: 100px;
		text-align: center;
	}
	.value-percentage {
		font-size: 11px;
	}
	.border-bar {
		height: 50px;
		border-right: 1px solid var(--bar-color);
	}
	.service-plan-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-basis: 250px;
	}
	.service-plan-title {
		font-family: openSans-regular;
		font-size: 15px;
		color: var(--main);
	}
	.service-plan-details {
		font-family: openSans-light;
		font-size: 12px;
		color: var(--main);
		text-align: center;
	}

	@media only screen and (max-width: 500px) {
		.service-plan {
			padding: 15px 10px;
		}
		.service-plan-price {
			flex-basis: 15vw;
		}
		.service-plan-info {
			flex-basis: 45vw;
		}
		.border-bar {
			height: 20vw;
			border-right: 1px solid var(--bar-color);
		}
	}
</style>
