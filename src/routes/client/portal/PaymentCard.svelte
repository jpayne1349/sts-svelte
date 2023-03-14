<script>
	import { sessionStore } from '../stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let shortened_card_type = '';
	let loaded = false;

	let visa = false;
	let mast = false;
	let disc = false;
	let amex = false;
	let appl = false;
	let goog = false;

	onMount(() => {
		shortened_card_type = shortenCardType();
		loaded = true;
	});

	function shortenCardType() {
		if ($sessionStore.default_payment_method.type == '') {
			return '';
		}

		switch ($sessionStore.default_payment_method.type) {
			case 'visa':
				visa = true;
				return 'visa';
				break;

			case 'mastercard':
				mast = true;
				return 'mast';
				break;

			case 'discover':
				disc = true;
				return 'disc';
				break;

			case 'amex':
				amex = true;
				return 'amex';
				break;

			default:
				return 'cc';
		}
	}
</script>

<div
	class="card-icon"
	class:appl
	class:goog
	class:visa
	class:amex
	class:disc
	class:mast
	in:fly={{ x: -20 }}
>
	<div class="chip" />
	<div class="card-last-four">{$sessionStore.default_payment_method.last_four}</div>

	<div class="card-type">{shortened_card_type}</div>
</div>

<style>
	.card-icon {
		background-color: rgb(245, 245, 245);
		width: 50px;
		height: 30px;
		border-radius: 5px;
		color: #002295;
		position: relative;
		box-shadow: 0 1px 1px grey;
		margin-bottom: 4px;
	}
	.card-icon.visa {
		background-color: #dadada;
		color: #162c96;
	}
	.card-icon.amex {
		background-color: #447cc7;
		color: white;
	}
	.card-icon.disc {
		background-color: #d8d8d8;
		color: #ec6e00;
	}
	.card-icon.mast {
		background-color: #6477ad;
		color: white;
	}
	.card-icon.appl {
		background-color: white;
		border: 1px solid black;
		color: black;
	}
	.card-icon.goog {
		background-color: white;
		color: #5f6368;
	}
	.card-last-four {
		position: absolute;
		font-size: 6px;
		left: 5px;
		bottom: 8px;
	}
	.card-type {
		font-family: monospace;
		position: absolute;
		font-size: 8px;
		right: 2px;
		bottom: 2px;
	}
	.chip {
		width: 5px;
		height: 5px;
		position: absolute;
		left: 5px;
		top: 7px;
		background-color: rgb(202, 202, 202);
		border-radius: 1px;
	}
	@media only screen and (max-width: 500px) {
	}
</style>
