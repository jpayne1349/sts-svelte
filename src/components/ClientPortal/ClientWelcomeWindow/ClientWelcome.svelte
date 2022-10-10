<script>
	import StyledInput from '../StyledInput.svelte';
	import CompanyQuestions from './CompanyQuestions.svelte';
	import HowToCreate from './HowToCreate.svelte';
	import InitialView from './InitialView.svelte';
	import { fade } from 'svelte/transition';

	let welcome_view_object = {
		in_initial_view: true,
		in_company_questions: false,
		in_how_to_create: false,
		in_user_details: false
	};

	// passed up from the companyQuestions
	let company_info;

	function handleInitialCreateClick(event) {
		welcome_view_object.in_initial_view = false;

		welcome_view_object.in_company_questions = true;
	}

	function handleCompanyForm(event) {
		company_info = event.detail;
        console.log(company_info);
		welcome_view_object.in_company_questions = false;
        welcome_view_object.in_how_to_create = true;
	}
</script>

<div id="client-welcome-container">
	<div id="welcome-title">Welcome to our Client Portal!</div>

	<div id="welcome-body">
		{#if welcome_view_object.in_initial_view}
			
				<InitialView on:validated_click={handleInitialCreateClick} />
		
		{:else if welcome_view_object.in_company_questions}
	
				<CompanyQuestions on:completed={handleCompanyForm} />
	
		{:else if welcome_view_object.in_how_to_create}
			<HowToCreate {company_info} />

		{/if}
	</div>

	<div id="form-nav-row">
		<div class="button back">
			<img class="rotate" src="./enter_arrow_svg.svg" alt="Back" />
		</div>
		<div id="steps-container">
			<div class="step" />
			<div class="step" />
			<div class="step" />
		</div>
		<div class="button fwd">
			<img src="./enter_arrow_svg.svg" alt="Forward" />
		</div>
	</div>

	<div id="welcome-footer">
		<div id="footer-text">
			This site is currently under development as we work to provide a more seamless experience to
			our clients and partners. If you encounter any issues or have suggestions for features, please
			drop us an email at <a href="mailto:development@southtexas.software" id="email-text"
				>development@southtexas.software</a
			>
			or just fill out the contact card at
			<a id="link" href="https://southtexas.software/contact-us">southtexas.software/contact-us</a>
		</div>
	</div>
</div>

<style>
	#client-welcome-container {
		flex-basis: 75vw;
		min-height: 70vh;
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
	#welcome-title {
		font-family: openSans-boldItalic;
		font-size: 3.5vw;
		color: #526889;
		margin-top: 2vh;
		user-select: none;
	}
	#welcome-body {
		display: flex;
		flex-direction: column;
		flex-grow: 4;
		align-items: center;
	}
	.view-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.view-wrapper.center-vert {
		margin: auto;
	}

	#form-nav-row {
		display: flex;
		/* width: 40%; */
		justify-content: space-around;
		margin-bottom: 1vh;
	}
	#steps-container {
		display: flex;
		width: 4vw;
		justify-content: space-evenly;
		align-items: center;
	}
	.step {
		width: 0.6vw;
		height: 0.6vw;
		border-radius: 50%;
		border: 1px solid #878787;
		content: '';
		position: relative;
		background-color: #e6e6e6;
	}
	.step.active {
		background-color: #526889;
	}
	.button {
		height: 1.6vw;
		width: 1.8vw;
		vertical-align: top;
		transition: all 0.5s;
		cursor: pointer;
		position: relative;
	}
	img {
		position: absolute;
		width: 1vw;
		height: 1vw;
		left: 0.4vw;
		top: 0.3vw;
	}
	img.rotate {
		transform: rotate(180deg);
	}
	#welcome-footer {
		width: 80%;
		text-align: center;
		font-family: openSans-light;
		font-size: 1vw;
		user-select: none;
	}
	#email-text {
		text-decoration: none;
		color: black;
	}
	#link {
		text-decoration: none;
		color: #6b88b3;
	}
</style>
