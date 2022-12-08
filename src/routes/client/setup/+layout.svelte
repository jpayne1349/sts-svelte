<script>
	import { page } from '$app/stores';
	import { sessionStore, fbStore } from '../stores';
	import { beforeUpdate } from 'svelte';
	import { goto } from '$app/navigation';

	beforeUpdate(async ()=>{
		if($fbStore.auth.currentUser == null) {
			let redirect = await goto('/client/sign-in');
			
		}
	});

	// this is for completion
	let completed_account_info = false;
	let completed_billing_address = false;
	let completed_billing_method = false;
	let completed_subscription = false;

	// this is for viewing..
	let viewing_account_info = false;
	let viewing_billing_address = false;
	let viewing_billing_method = false;
	let viewing_subscription = false;
</script>

<slot />

<section class="setup-steps">
	<div class="step-container">
		<!-- can be empty, viewing, or completed - empty is normal -->
		<div
			class="step-icon previous"
			id="account_info-step"
			class:viewing={$page.url.pathname == '/client/setup/account_info'}
			class:completed={$sessionStore.account_setup.account_info.completed}
		/>
		<label for="account_info-step" class="step-label">Account Info</label>
	</div>

	<div class="step-link" />

	<div class="step-container">
		<!-- can be empty, viewing, or completed - empty is normal -->
		<div
			class="step-icon previous"
			id="billing_address-step"
			class:viewing={$page.url.pathname == '/client/setup/billing_address'}
            class:seen={$sessionStore.account_setup.billing_address.seen}
			class:completed={$sessionStore.account_setup.billing_address.completed}
		/>
		<label for="billing_address-step" class="step-label">Billing Address</label>
	</div>

	<div class="step-link" />

	<div class="step-container">
		<!-- can be empty, viewing, or completed - empty is normal -->
		<div
			class="step-icon previous"
			id="billing_method-step"
			class:viewing={$page.url.pathname == '/client/setup/billing_method'}
            class:seen={$sessionStore.account_setup.billing_method.seen}
			class:completed={$sessionStore.account_setup.billing_method.completed}
		/>
		<label for="billing_method-step" class="step-label">Billing Method</label>
	</div>

	<div class="step-link" />

	<div class="step-container">
		<!-- can be empty, viewing, or completed - empty is normal -->
		<div
			class="step-icon"
			id="subscription-step"
			class:viewing={$page.url.pathname == '/client/setup/services'}
            class:seen={$sessionStore.account_setup.subscription_service.seen}
			class:completed={$sessionStore.account_setup.subscription_service.completed}
		/>
		<label for="subscription-step" class="step-label">Services</label>
	</div>
</section>

<style>
	.setup-steps {
		box-shadow: 0px 1px 2px rgb(177, 177, 177);
		width: 450px;
		height: 50px;
		border-radius: 5px;
		background-color: white;
		margin-top: 15px;
		display: flex;
		padding: 0 25px;
		align-items: center;
		justify-content: center;
	}
	.step-container {
		display: flex;
		flex-direction: column;
		font-family: openSans-semibold;
		font-size: 10px;
		align-items: center;
		width: 100px;
	}
	.step-icon {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: solid 2px var(--bar-color);
		position: relative;
	}

	.step-icon.viewing, .step-icon.completed.viewing, .step-icon.seen.viewing, .step-icon.seen.completed.viewing {
		background-color: var(--bar-color);
	}
	.step-icon.completed, .step-icon.completed.seen {
		background-color: var(--main);
	}
    .step-icon.seen {
        background-color: var(--button-light-blue);
    }

	.step-icon.previous:after {
		content: '';
		position: absolute;
		height: 2px;
		background-color: transparent;
		left: 18px;
		top: 7px;
		width: 0px;
		transition: all 2s;
	}
	.step-icon.previous.completed:after, .step-icon.previous.seen:after {
		width: 80px;
		background-color: var(--main);
	}
	.step-label {
		margin-top: 4px;
	}

	@media only screen and (max-width: 500px) {
		.setup-steps {
			width: 90vw;
			height: 6vh;
			padding: 0;
		}
		.step-container {
			font-size: 9px;
			width: 20vw;
		}
		.step-icon.previous:after {
			width: 15.4vw;
		}
		.step-icon.previous.completed:after, .step-icon.previous.seen:after {
			width: 15.4vw;
			background-color: var(--main);
		}
	}
</style>
