<script>

    import { getContext } from 'svelte';


    let context_object = getContext('client_object');
    let client_object = context_object.client_object;

</script>

<div id="client-profile-container">
	<div id="title">Profile</div>

	<div id="details-titles-row">
		<div class="details-col-title">Contact Info</div>
		<div class="details-col-title">Plan Details</div>
	</div>

	<div id="details-flex-row">
		<div id="contact-details" class="details-col">
			<div id="client-email" class="info-row">
				<div id="email-label" class="label">E-Mail:</div>
				<div id="email" class="variable">{client_object.company_info.company_email}</div>
			</div>

			<div id="client-phone" class="info-row">
				<div id="phone-label" class="label">Phone:</div>
				<div id="phone" class="variable">{client_object.company_info.company_phone}</div>
			</div>

			<div id="client-userid" class="info-row">
				<div id="userid-label" class="label">User ID:</div>
				<div id="userid" class="variable">{client_object.user_list[0].uid}</div>
			</div>

			<div id="client-companyid" class="info-row">
				<div id="companyid-label" class="label">Company ID:</div>
				<div id="companyid" class="variable">{client_object.company_info.cid}</div>
			</div>

			<div id="client-password" class="info-row">
				<div id="password-change">Change Password</div>
			</div>
		</div>

		<div id="service-details" class="details-col">
			<div id="client-plan" class="info-row">
				<div id="plan-label" class="label">Plan Type:</div>
				<div id="plan" class="variable">{client_object.company_info.company_plan}</div>
			</div>
			<div id="client-planDesc" class="info-row">
				<div id="planDesc-label" class="label">Description:</div>
				<div id="planDesc" class="variable">{client_object.company_info.company_plan_description}</div>
			</div>
			<div id="client-links" class="info-row">
				<div id="links-label" class="label">Active Links:</div>
				<a id="links" target='_blank' href='https://www.southtexas.software' class="variable">{client_object.company_info.company_active_links}</a>
			</div>
		</div>
	</div>

</div>

<style>
	#client-profile-container {
		flex-basis: 75vw;
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
		font-family: openSans-medium;
		font-size: 2vw;
		text-decoration: underline;
	}


	#details-titles-row {
		display: flex;
		width: 100%;
		justify-content: space-around;
	}
	
	#details-flex-row {
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: space-around;
		flex-grow: 5;
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
	.details-col-title {
		text-align: center;
		text-decoration: underline;
		font-family: openSans-medium;
		font-size: 1.2vw;
	}
	.label {
		font-family: openSans-lightitalic;
		font-size: 0.8vw;
		width: 5vw;
	}
	.info-row {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-top: 1.5vh;
		
	}
	.variable {
		font-family: openSans-light;
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


	@media only screen and (max-width: 615px) {
	}
</style>
