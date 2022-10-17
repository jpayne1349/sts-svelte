<script>
	import StyledInput from '../StyledInput.svelte';
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();

	const z = "f406aa1a14c4e822c55d4e7b641bf670f581070bdfa69031c7a1bf0dfb4fa8cd390e0d4c0251709be011b9542ffcc1887e8962970a7fd302c77ffb76e6bdd1a8";

	// temporary for TESTING
	let passcode = 12345;
	let key_input_value = '';

	let validation_message_bool = false;
	let validation_in_progress_bool = false;
	let otp_validated_bool = false;

	function dispatchCreate() {
		if (otp_validated_bool) {
			dispatch('validated_click', 'create_account');
		}
	}

	async function validateKey() {
		if(key_input_value == '') {
			return;
		}
		validation_message_bool = false;
		validation_in_progress_bool = true;

		let serverResponse = await fetch('/client/key_validation', {
			method: 'POST',
			body: JSON.stringify({ key: key_input_value }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		serverResponse = await serverResponse.json();

		if(serverResponse.key == z) {
			otp_validated_bool = true;
			validation_in_progress_bool = false;
		} else {
			key_input_value = '';
			validation_message_bool = true;
			validation_in_progress_bool = false;
			}

	}

	// do a db fetch for a temporary passcode set up somewhere
	function deprecatedValidateKey() {
		validation_in_progress_bool = true;

		if (validation_message_bool == true) {
			validation_message_bool = false;
		}

		// TODO: this will be given to a new client, probably via text/or whatever
		// we want these to be verifiable by the firebase client connection...
		// so we could store the passcode on there, and then just do a document read. that would be non-auth, non-verifiable,
		// we wouldn't really want someone to be able to just read the value from firebase, because then there would be no point,
		// so we could set the value to be read only if auth, and then work through our server to verify the enteredpasscode
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
		<button id="button" on:click={dispatchCreate} class:available={otp_validated_bool}>
			Create Account
		</button>
	</div>
	<div id="otp-statement">Account creation requires a One-Time Key issued by our team.</div>

	<div id="input-group">
		<div id="otp-label">Key</div>
		<StyledInput id={'otp-input'} bind:input_value={key_input_value} on:enter={validateKey} />
		<button id="submit-button" on:click={validateKey} class:disable={otp_validated_bool}>
			<img
				src="./enter_arrow_svg.svg"
				alt="Submit"
				class:hide={validation_in_progress_bool || otp_validated_bool}
			/>
			<div id="spinner" class:active={validation_in_progress_bool} />
			<div id="checkmark" class:active={otp_validated_bool} />
		</button>

		<div id="incorrect-passcode" class:active={validation_message_bool}>Key Incorrect</div>
	</div>
</div>

<style>
	#initial-wrapper {
		margin: auto;
		display: flex;
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
		top: 0.35vw;
		left: 0.33vw;
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
