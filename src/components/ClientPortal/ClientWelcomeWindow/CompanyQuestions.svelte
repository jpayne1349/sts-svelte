<!-- TODO: Company ID lookup, verification, etc. will have to happen via post request to server.js file.. permissions issue with 
     client having access to database information
-->
<script>
	import StyledInput from '../StyledInput.svelte';
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();

	export let previously_filled_info;

	// dispatch the continue click with the company name info
	// TODO: this will eventually handle if the company ID has found a name, etc.
	function handleContinueClick() {
		dispatch('completed', form);
	}

	let form = {
		company_associated_answered: false,
		company_is_associated: false,
		company_system_answered: false,
		company_in_system: false,
		company_id: '',
		company_name_entered: false,
		company_name: ''
	};

	// this picks up info if the back button was pressed
	if (previously_filled_info != undefined) {
		form = previously_filled_info;
	}

	//TODO: provide a lookup if company id is entered?
	$: {
		if (form.company_name != '') {
			form.company_name_entered = true;
		} else {
			form.company_name_entered = false;
		}
	}

	function handleClickSystem(event) {
		form.company_system_answered = true;

		if (event.target.id == 'system-yes') {
			form.company_in_system = true;
		} else {
			form.company_in_system = false;
		}
	}

	function handleClickAssociated(event) {
		form.company_associated_answered = true;

		if (event.target.id == 'associated-yes') {
			form.company_is_associated = true;
		} else {
			form.company_is_associated = false;
			form.company_in_system = false;
			form.company_system_answered = false;
		}
	}
</script>

<div class="question-group-col" in:fly={{ delay: 0, duration: 400, x: 0, y: 20, opacity: 0 }}>
	<div class="question-text">Will your user account be associated with a company/business?</div>
	<div class="button-row">
		<button
			id="associated-yes"
			class="button yes"
			on:click={handleClickAssociated}
			class:selected={form.company_associated_answered && form.company_is_associated}
		>
			Yes
		</button>
		<button
			id="associated-no"
			class="button no"
			on:click={handleClickAssociated}
			class:selected={form.company_associated_answered && !form.company_is_associated}
		>
			No
		</button>
	</div>
</div>

{#if form.company_is_associated}
	<div class="question-group-col" in:fly={{ delay: 0, duration: 400, x: 0, y: 20, opacity: 0 }}>
		<div class="question-text">Is your company already in our system?</div>
		<div class="button-row">
			<button
				id="system-yes"
				class="button yes"
				on:click={handleClickSystem}
				class:selected={form.company_system_answered && form.company_in_system}
			>
				Yes
		</button>
			<button
				id="system-no"
				class="button no"
				on:click={handleClickSystem}
				class:selected={form.company_system_answered && !form.company_in_system}
			>
				No
	</button>
		</div>
	</div>
{/if}

{#if form.company_in_system}
	<div class="input-group-row" in:fly={{ delay: 0, duration: 400, x: 0, y: 20, opacity: 0 }}>
		<div class="input-label">Enter the unique ID associated with your company:</div>
		<StyledInput id={'company-id-input'} bind:input_value={form.company_id} />
		<span class='input-label' style='font-size:14px;'> *Coming Soon </span>
	</div>
{/if}

{#if form.company_system_answered && !form.company_in_system}
	<div class="input-group-row" in:fly={{ delay: 0, duration: 400, x: 0, y: 20, opacity: 0 }}>
		<div class="input-label">Please enter the legal name of your company/business:</div>
		<StyledInput id={'new-company-input'} bind:input_value={form.company_name} />
	</div>
{/if}

{#if form.company_name_entered || (form.company_associated_answered && !form.company_is_associated)}
	<button
		id="continue-button"
		in:fly={{ delay: 0, duration: 400, x: 0, y: 20, opacity: 0 }}
		on:click={handleContinueClick}
	>
		Continue
</button>
{/if}

<style>
	.question-group-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 4vh;
	}
	.question-text,
	.input-label {
		font-family: openSans-regular;
		font-size: 1.2vw;
	}
	.button-row {
		display: flex;
		width: 15vw;
		justify-content: space-around;
		margin-top: 1vh;
	}
	.button {
		width: 5vw;
		height: 1.5vw;
		line-height: 1.5vw;
		border-radius: 0.5vw;
		text-align: center;
		font-family: openSans-semibold;
		font-size: 0.9vw;
		color: rgb(255, 255, 255);
		box-shadow: 0px 1px 2px #b0b2b6;
		user-select: none;
		cursor: pointer;
		transition: all 0.5s;
	}
	.button.yes {
		background-color: #3d7d954f;
	}
	.button.yes:hover {
		background-color: #3d7d9567;
	}
	.button.yes.selected,
	.button.yes.selected:hover {
		background-color: #3d7d95;
	}
	.button.no {
		background-color: #43aaae3d;
	}
	.button.no.selected,
	.button.no.selected:hover {
		background-color: #43aaae;
	}
	.button.no:hover {
		background-color: #43aaae62;
	}

	.input-group-row {
		display: flex;
		margin-top: 4vh;
	}

	.input-label {
		margin-right: 2vw;
	}

	#continue-button {
		margin-top: 3vh;
		width: 10vw;
		font-size: 1.1vw;
		line-height: 1.8vw;
		text-align: center;
		font-family: openSans-semiBold;
		color: white;
		background-color: #3c704081;
		border-radius: 5px;
		height: 1.8vw;
		box-shadow: 0px 1px 2px #464d5b;
		transition: all 0.5s;
		user-select: none;
		cursor: pointer;
	}
	#continue-button:hover {
		background-color: #356739;
	}
</style>
