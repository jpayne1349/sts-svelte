<script>
	import StyledInput from '../StyledInput.svelte';
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();

	// temporary for TESTING
	let passcode = 12345;
	let otp_input;

	let validation_message_bool = false;
	let validation_in_progress_bool = false;
	let otp_validated_bool = false;

	function dispatchCreate() {
		if (otp_validated_bool) {
			dispatch('validated_click', 'create_account');
		}
	}

	// do a db fetch for a temporary passcode set up somewhere
	function validatePasscode() {
		validation_in_progress_bool = true;

		if (validation_message_bool == true) {
			validation_message_bool = false;
		}

		// this promise sort of simulates the Fetch/promise associated with checking the db value
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				validation_in_progress_bool = false;

				if (otp_input == passcode) {
					otp_validated_bool = true;
					resolve();
				} else {
					validation_message_bool = true;
				}
			}, 1000);
		});
	}
</script>

<div id="initial-wrapper">
	<div id="create-account">
		<div id="button" on:click={dispatchCreate} class:available={otp_validated_bool}>
			Create Account
		</div>
	</div>
	<div id="otp-statement">Account creation requires a One-Time Passcode issued by our team.</div>

	<div id="input-group">
		<div id="otp-label">OTP</div>
		<StyledInput id={'otp-input'} bind:input_value={otp_input} on:enter={validatePasscode} />
		<div id="submit-button" on:click={validatePasscode} class:disable={otp_validated_bool}>
			<img
				src="./enter_arrow_svg.svg"
				alt="Submit"
				class:hide={validation_in_progress_bool || otp_validated_bool}
			/>
			<div id="spinner" class:active={validation_in_progress_bool} />
			<div id="checkmark" class:active={otp_validated_bool} />
		</div>

		<div id="incorrect-passcode" class:active={validation_message_bool}>Incorrect Passcode</div>
	</div>
</div>

<style>
    #initial-wrapper {
        margin:auto;
        display:flex;
        flex-direction: column;
        align-items: center;
    }
	#create-account {
		width: 12vw;
	}
	#button {
		width: 100%;
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
		pointer-events: none;
		user-select: none;
	}
	#button.available {
		background-color: #3c7040;
		cursor: pointer;
		pointer-events: all;
	}
	#button.available:hover {
		background-color: #356739;
	}
	#otp-statement {
		font-family: openSans-lightitalic;
		font-size: 0.9vw;
		margin: 1vh 0 4vh 0;
		user-select: none;
	}
	#otp-label {
		font-family: openSans-light;
		font-size: 1vw;
		text-align: center;
		margin-left: 5px;
		user-select: none;
	}
	#submit-button {
		display: inline-block;
		position: absolute;
		height: 1.8vw;
		width: 1.8vw;
		border: 1px solid rgb(193, 193, 193);
		border-radius: 8px;
		box-shadow: 0px 1px 2px rgb(201, 201, 201);
		vertical-align: top;
		background-color: rgb(230, 230, 230);
		transition: all 0.5s;
	}
	#submit-button:hover {
		cursor: pointer;
		background-color: rgb(225, 225, 225);
		box-shadow: 0px 2px 4px rgb(201, 201, 201);
	}
	#submit-button.disable {
		cursor: default;
		user-select: none;
		pointer-events: none;
	}
	img {
		margin-left: 20%;
		width: 60%;
		height: 100%;
		opacity: 1;
		transition: all 0.2s;
	}
	img.hide {
		opacity: 0;
	}
	#incorrect-passcode {
		font-family: openSans-boldItalic;
		font-size: 0.7vw;
		text-align: center;
		color: #db8787;
		opacity: 0;
		user-select: none;
		transition: 0.5s;
	}
	#incorrect-passcode.active {
		opacity: 1;
	}
	#spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid grey;
		border-right: 2px solid transparent;
		width: 1vw;
		height: 1vw;
		top: 0.4vw;
		left: 0.4vw;
		animation-name: spinning;
		animation-duration: 0.8s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		position: absolute;
		opacity: 0;
		transition: all 0.2s;
	}
	#spinner.active {
		opacity: 1;
	}
	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
	#checkmark {
		content: '';
		height: 0.9vw;
		width: 0.4vw;
		position: absolute;
		top: 0.3vw;
		left: 0.7vw;
		border-right: 0.2vw solid green;
		border-bottom: 0.2vw solid green;
		transform: rotate(45deg);
		opacity: 0;
		transition: all 0.2s;
	}
	#checkmark.active {
		opacity: 1;
	}
</style>
