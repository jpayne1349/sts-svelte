<script>
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { getContext } from 'svelte';

	import StyledInput from './StyledInput.svelte';

	let session_data = {};
	let session_store = getContext('session_store');

	let unsubscribe = session_store.subscribe((data) => {
		session_data = data;
	});

	let verifying_sign_in = false; // bool prevents a double sign in attempt on accident additional button clicks
	let email_input;
	let password_input;
	let show_error_message = false;
	let show_spinner = false;

    export let auto_logging_in;

    $: {
        show_spinner = auto_logging_in;
    }

	let error_message = 'Incorrect Email/Password';

	function resetErrorMessage() {
		show_error_message = false;
	}

	// verifying sign in true/false set
	async function handleSignInAttempt() {
		if (!verifying_sign_in) {
			verifying_sign_in = true;

			show_spinner = true;
			try {
				const credential = await signInWithEmailAndPassword(
					session_data.auth_data,
					email_input,
					password_input
				);
				verifying_sign_in = false;
			} catch (error) {
				console.log(error.code);
				show_error_message = true;
				show_spinner = false;
				verifying_sign_in = false;
			}
		}
	}

	function listenForEnter(event) {
		if (event.keyCode === 13) {
			handleSignInAttempt();
		}
	}
</script>

<div id="sign-in-container">
	<div class="input-group">
		<div id="username-label" class="label">Email</div>
		<input id="username-input" bind:value={email_input} on:input={resetErrorMessage} />
	</div>

	<div class="input-group">
		<div id="password-label" class="label">Password</div>
		<input
			id="password-input"
			type="password"
			bind:value={password_input}
			on:input={resetErrorMessage}
			on:keypress={listenForEnter}
		/>
	</div>

	<div id="email-password-signin">
		<div id="error-message" class:active={show_error_message}>{error_message}</div>
		<button id="sign-in-button" on:click={handleSignInAttempt}>
			<span id="button-text" class:active={!show_spinner}>Sign In</span>
			<div id="spinner" class:active={show_spinner} />
		</button>
	</div>

	<div id="google-signin" />

	<div id="facebook-signin" />
</div>

<style>
	#sign-in-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 10vh;
	}
	.input-group {
		margin-bottom: 2vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 0 2vw;
	}
	.label {
		font-family: openSans-light;
		font-size: 1.2vw;
		margin-left: 5px;
	}

	#email-password-signin {
		width: 100%;
		padding: 0 3vw;
		display: flex;
		justify-content: center;
		position: relative;
		flex-direction: column;
	}
	#sign-in-button {
		width: 100%;
		font-size: 1.1vw;
		line-height: 1.8vw;
		text-align: center;
		font-family: openSans-semiBold;
		color: white;
		background-color: #526889;
		border-radius: 5px;
		height: 1.8vw;
		box-shadow: 0px 1px 2px #464d5b;
		transition: all 0.2s;
		cursor: pointer;
		user-select: none;
		position: relative;
	}
	#sign-in-button:hover {
		background-color: #3c4f70;
	}
	#button-text {
		opacity: 0;
		transition: all 0.2s;
	}
	#button-text.active {
		opacity: 1;
	}
	#error-message {
		font-family: openSans-boldItalic;
		font-size: 0.7vw;
		text-align: center;
		color: #db8787;
		opacity: 0;
		user-select: none;
		transition: all 0.5s;
	}
	#error-message.active {
		opacity: 1;
	}
	input {
		border: none;
		background-color: rgb(230, 230, 230);
		padding: 0 5px;
		height: 1.8vw;
		border-radius: 8px;
		font-size: 1vw;
		border: 1px solid rgb(193, 193, 193);
		transition: all 0.5s;
		font-family: openSans-light;
		box-shadow: 0px 1px 2px rgb(201, 201, 201);
	}
	input:hover {
		box-shadow: 0px 1px 2px rgb(164, 164, 164);
	}
	input:focus {
		outline: none;
	}
	#spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid white;
		border-right: 2px solid transparent;
		width: 1vw;
		height: 1vw;
		top: 0.4vw;
		left: 3.8vw;
		animation-name: s-glWFwOjWat37-spinning;
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
</style>
