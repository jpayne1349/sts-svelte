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
	

</script>

<nav class="portal-navbar">
	<a href="./overview" class:active={$page.url.pathname == '/client/portal/overview'}>Overview</a>
	<a href="./profile" class:active={$page.url.pathname == '/client/portal/profile'}>Profile</a>
	<a href="./billing" class:active={$page.url.pathname == '/client/portal/billing'}>Billing</a>
	<a href="./service-log" class:active={$page.url.pathname == '/client/portal/service-log'}
		>Service Log</a
	>
</nav>

<slot />

<div class="account-setup-progress">
	<h5 class="setup-progress-title">Account Setup Links</h5>

	<!-- TODO: icons should be dependent on the status of the sessionStore -->
	<div class="setup-progress-links">
		<a href="/client/setup/billing_address" class="setup-link left">
			<div
				class="setup-icon"
				class:completed={$sessionStore.account_setup.billing_address.completed}
				class:seen={$sessionStore.account_setup.billing_address.seen}
			/>
			<p class="setup-link-label">Billing Address</p>
		</a>

		<a href="/client/setup/billing_method" class="setup-link">
			<div
				class="setup-icon"
				class:completed={$sessionStore.account_setup.billing_method.completed}
				class:seen={$sessionStore.account_setup.billing_method.seen}
			/>
			<p class="setup-link-label">Payment Method</p>
		</a>

		<a href="/client/setup/subscription_service" class="setup-link right">
			<div
				class="setup-icon"
				class:completed={$sessionStore.account_setup.subscription_service.completed}
				class:seen={$sessionStore.account_setup.subscription_service.seen}
			/>
			<p class="setup-link-label">Services</p>
		</a>
	</div>
</div>

<style>
	.portal-navbar {
		width: 500px;
		box-shadow: var(--box-shadow);
		border-radius: 5px;
		background-color: white;
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-family: openSans-semibold;
		color: var(--dark-blue);
		height: 45px;
		transition: all 0.5s;
		margin: 15px 0;
		padding: 0 15px;
	}
	.portal-navbar a {
		font-size: 16px;
		transition: all 0.2s;
	}
	.portal-navbar a.active {
		font-size: 20px;
	}

	.account-setup-progress {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 500px;
		box-shadow: var(--box-shadow);
		background-color: white;
		font-family: openSans-semibold;
		color: var(--dark-blue);
		height: 100px;
		border-radius: 5px;
	}
	.setup-progress-title {
		text-align: center;
		font-size: 16px;
	}
	.setup-progress-links {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 15px;
	}
	.setup-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0;
		background-color: transparent;
		box-shadow: none;
		color: var(--dark-blue);
		font-family: openSans-regular;
		font-size: 13px;
	}
	.left,
	.right {
		flex-grow: 1;
		flex-basis: 0;
	}
	.setup-icon {
		height: 20px;
        width: 20px;
        border-radius: 50%;
        margin-bottom: 5px;
        position: relative;
	}
    .setup-icon.seen {
        background-color: var(--button-light-blue);
    }
    .setup-icon.seen::before {
        content: '';
        position: absolute;
        width: 10px;
        height: 2px;
        background-color: white;
        left: 5px;
        top: 9px;
    }
    .setup-icon.completed, .setup-icon.seen.completed {
        background-color: var(--dark-blue);
    }
    .setup-icon.completed::before, .setup-icon.seen.completed::before {
        content: '';
        position: absolute;
        width: 3px;
        height: 8px;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
        background-color: transparent;
        left: 7.5px;
        top: 4px;
        transform: rotate(30deg);
    }

	@media only screen and (max-width: 500px) {
		.portal-navbar {
			width: 90vw;
		}
		.portal-navbar a {
			font-size: 14px;
		}
		.portal-navbar a.active {
			font-size: 18px;
		}
		.account-setup-progress {
			width: 90vw;
		}
	}
</style>
