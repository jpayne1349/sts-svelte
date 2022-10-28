<script>
	import { getContext, onMount } from 'svelte';

	let session_data = {};
	let session_store = getContext('session_store');

	let unsubscribe = session_store.subscribe((data) => {
		session_data = data;
	});

	let showing_company_data = false;
	// check the company type and then set this.
	if(session_data.company.profile.type == 'seperate') {
	showing_company_data = true;
	}

	let show_more_info = false;

</script>

<div id="client-profile-container">
	<div id="title">Profile</div>

	<div id="client-profile-body">
		<div id="client-contact-col" class="col">
			<div class="profile-col-title">Contact Info</div>

			<div id="details-data-select">
				<button
					id="company-details-button"
					class="button"
					class:active={showing_company_data}
					on:click={() => {
						showing_company_data = true;
					}}>Company</button
				>
				<button
					id="user-details-button"
					class="button"
					class:active={!showing_company_data}
					on:click={() => {
						showing_company_data = false;
					}}>User</button
				>
			</div>

			<div id="company-email" class="info-row">
				<div class="label">E-Mail:</div>
				<div id="email" class="variable">
					{#if showing_company_data}
						{#if session_data.company.profile.email != ''}
							{session_data.company.profile.email}
						{:else}
							<div class='no-data'>none</div>
						{/if}
					{:else if session_data.user.email != ''}
						{session_data.user.email}
					{:else}
						<div class='no-data'>none</div>
					{/if}
				</div>
			</div>

			<div id="company-phone" class="info-row">
				<div class="label">Phone:</div>
				<div id="phone" class="variable">
					{#if showing_company_data}
						{#if session_data.company.profile.phone != ''}
							{session_data.company.profile.phone}
						{:else}
							<div class='no-data'>none</div>
						{/if}
					{:else if session_data.user.phone != ''}
						{session_data.user.phone}
					{:else}
						<div class='no-data'>none</div>
					{/if}
				</div>
			</div>

			<div id="client-password" class="info-row">
				<div id="password-change">Change Password</div>
			</div>

			{#if show_more_info}
				<div id="client-uid" class="info-row">
					<div id="userid-label" class="label">Unique ID:</div>
					<div id="userid" class="variable uid">
						{#if showing_company_data}
							{#if session_data.user.cuid != ''}
								{session_data.user.cuid}
							{:else}
								<div class='no-data'>none</div>
							{/if}
						{:else if session_data.user.auid != ''}
							{session_data.user.auid}
						{:else}
							<div class='no-data'>none</div>
						{/if}
					</div>
				</div>
			{/if}

						<button id='more-info-button' on:click={()=> { show_more_info = !show_more_info; }}> 
				{#if show_more_info}
					Less info
				{:else}
					More info
				{/if}
			</button>

		</div>

		<div id="client-plan-col" class="col">
			<div class="profile-col-title">Plan Details</div>

			
				<div id="client-plan" class="info-row">
					<div id="plan-label" class="label">Plan Type:</div>
					<div id="plan" class="variable">
						{#if session_data.company.profile.plan != ''}
						{session_data.company.profile.plan}
						{:else}
						<div class='no-data'>none</div>
						{/if}
					</div>
				</div>
				<div id="client-planDesc" class="info-row">
					<div id="planDesc-label" class="label">Description:</div>
					<div id="planDesc" class="variable">
						{#if session_data.company.profile.plan_description != ''}{session_data.company.profile.plan_description}{/if}
					</div>
				</div>
				<div id="client-links" class="info-row">
					<div id="links-label" class="label">Active Links:</div>
					<a id="links" target="_blank" href="https://www.southtexas.software" class="variable"
						>{#if session_data.company.profile.active_links != ''}
						{session_data.company.profile.active_links}
						{:else}
						<div class='no-data'>none</div>
						{/if}
						</a>
				</div>
			
		</div>
	</div>
</div>

<style>
	#client-profile-container {
		flex-basis: 78vw;
		min-height: 35vh;
		background-color: var(--box-color);
		border-radius: var(--box-border-radius);
		margin: 1vh 3vw 5vh 3vw;
		padding: 0 0 5vh 0;
		box-shadow: var(--box-shadow);
		color: black;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		align-self: center;
		transition: all 1s;
	}

	#title {
		font-family: openSans-boldItalic;
		color: #394b67;
		font-size: 2vw;
		/* text-decoration: underline; */
	}

	#client-profile-body {
		display: flex;
		width: 80%;
		justify-content: space-around;
	}
	.col {
		display: flex;
		flex-direction: column;
		flex-basis: 23vw;
	}
	.profile-col-title {
		font-family: openSans-semibold;
		text-align: center;
		color: #394b67;
		text-decoration: underline;
	}
	#details-data-select {
		display: flex;
		justify-content: space-around;
		margin: 5px 0;
	}
	.button {
		font-size: 0.8vw;
		width: 6vw;
		text-align: center;
		font-family: openSans-semiBold;
		border-radius: 5px;
		box-shadow: 0px 1px 2px #6f798e;
		transition: all 0.2s;
		cursor: pointer;
		user-select: none;
		position: relative;
	}
	.button.active {
		box-shadow: 0px 0px 0px #464d5b;
		background-color: #38609db2;
		color: white;
	}

	#links {
		text-decoration: none;
		color: #020d1fe8;
	}
	.details-col {
		display: flex;
		flex-direction: column;
		width: 25%;
		justify-content: flex-start;
	}
	.label {
		font-family: openSans-light;
		font-size: 0.9vw;
		width: 5.5vw;
		text-align: left;
	}
	.info-row {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-top: 1.5vh;
	}
	.variable {
		font-family: openSans-regular;
		font-size: 1vw;
	}
	#planDesc {
		text-align: left;
		margin-left: 1vw;
	}
	#password-change {
		font-family: openSans-regular;
		font-size: 0.8vw;
		user-select: none;
		cursor: pointer;
		text-decoration: underline;
	}
	#more-info-button {
		font-family: openSans-light;
		text-align: left;
		margin-top: 2vh;
		text-decoration: underline;
		user-select: none;
		cursor: pointer;
		background: none;
	}


	@media only screen and (max-width: 615px) {
	}
</style>
