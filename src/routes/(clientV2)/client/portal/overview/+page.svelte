<script>
	import { sessionStore, fbStore } from '../../stores';


    function shortenCardType() {
        if($sessionStore.default_payment_method.type == '') {
            return '';
        }

        switch ($sessionStore.default_payment_method.type) {

            case 'visa':
                return 'VI';
                break

            case 'mastercard':
                return 'MC';
                break

            case 'discover':
                return 'DC';
                break

            case 'amex':
                return 'AE';
                break

            default:
                return 'CC'

        }

    }


</script>

<section class="container"  >
	<div class="overview-section">
		<h3 class="section-title">Profile</h3>

		{#if $sessionStore.company_is_seperate}
			<p class="section-info">
				<span class="info-label">Company:</span>{$sessionStore.company_name}
			</p>
		{/if}
		<p class="section-info"><span class="info-label">Name:</span>{$sessionStore.fullname}</p>
		<p class="section-info"><span class="info-label">Account Email:</span>{$sessionStore.email}</p>
	</div>

	<div class="overview-section">
		<h3 class="section-title billing">
			Billing
			{#if $sessionStore.billing.status != ''}
				<span class="billing-status" class:active={$sessionStore.billing.status == 'active'}>{$sessionStore.billing.status}</span>
			{/if}
		</h3>

		<p class="section-info payment-method">
			<span class="info-label">Payment Method:</span>
			{#if $sessionStore.default_payment_method.id != ''}
				<div class="card-icon">
					<div class="card-last-four">{$sessionStore.default_payment_method.last_four}</div>
					<div class="card-type">{shortenCardType()}</div>
				</div>
			{:else}
				Not Added
			{/if}
		</p>

		<p class="section-info">
			<span class="info-label">Services:</span>{$sessionStore.subscription.status}
		</p>
		<p class="section-info address">
			<span class="info-label">Address:</span>
            {#if $sessionStore.address.line != ''}
            {$sessionStore.address.line1} <br />
			{$sessionStore.address.city}, {$sessionStore.address.state} {$sessionStore.address.postal_code}
            {/if}
		</p>
	</div>

	<div class="overview-section last">
		<h3 class="section-title">Service Log</h3>

		<p class="section-info">
			<span class="info-label">Active Links:</span>
			{#each $sessionStore.service_log.active_links as link}
				<a href={link}>{link}</a> |
			{/each}
		</p>
		<p class="section-info">
			<span class="info-label">Code Repo:</span>{$sessionStore.service_log.code_repo}
		</p>
		<p class="section-info">
			<span class="info-label">Latest Event:</span>{$sessionStore.service_log.latest_event}
		</p>
	</div>
</section>

<style>
	.container {
		margin-bottom: 4vh;
		box-shadow: var(--box-shadow);
	}
	.overview-section {
		padding: 15px 0;
		border-bottom: 1px solid var(--bar-blue);
	}
	.overview-section.last {
		border: none;
	}
	.section-title {
		font-family: openSans-semibold;
		font-size: 18px;
		margin-bottom: 5px;
	}
	.section-title.billing {
		display: flex;
	}
	.section-info {
		font-family: openSans-medium;
		font-size: 16px;
		margin-bottom: 6px;
		display: flex;
	}
	.section-info.payment-method {
		align-items: flex-end;
		margin-top: 0px;
	}
	.info-label {
		font-family: openSans-light;
		margin-right: 5px;
        text-align: end;
	}

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
	.card-last-four {
		position: absolute;
		font-size: 8px;
		left: 3px;
		bottom: 3px;
	}
	.card-type {
		position: absolute;
		font-size: 10px;
		right: 2px;
		top: 0px;
	}
	.billing-status {
		font-family: openSans-light;
		font-size: 8px;
		margin-left: 5px;
		padding: 2px 4px;
		border-radius: 5px;
		border: 1px solid var(--alert-orange);
		color: var(--alert-orange);
		background-color: #d3ba9b1c;
		align-self: flex-start;
	}
	.billing-status.active {
		border: 1px solid var(--global-green);
		color: var(--global-green);
		background-color: #7aa66f19;
	}

	@media only screen and (max-width: 500px) {
		.container {
			padding-bottom: 25px;
		}
        .billing-status {
            font-size: 8px;
            
        }
	}
</style>
