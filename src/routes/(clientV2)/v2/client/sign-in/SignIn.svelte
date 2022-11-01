<script>
	import '../../../../../client_app.css';
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';
	import { alertStore, fbStore } from '../stores.js';
	import { signInWithEmailAndPassword } from 'firebase/auth';

    

	// using sveltekit's 'enhance' feature to just pull the form data out currently
	async function signInAttempt({ form, data, action, cancel }) {
		// display spinner
        
        let email = data.get('email');
		let password = data.get('password');
		let remember = data.get('remember');

        try{
        
            let attempt = await signInWithEmailAndPassword($fbStore.auth, email, password);

        }catch(e) {

            alertStore.set({
                message: 'Incorrect Email/Password',
                error: true,
                show:true
            });

        }


		// like preventDefault..
		cancel();

		return;
	}


</script>

<div class="container" id="sign-in-container">
	<div class="title">Sign in to your account</div>

	<form method="POST" id="sign-in-form" use:enhance={signInAttempt}>
		<label for="email-label" class="label">Email</label>
		<input name="email" id="email-input" class="input" type="email" required />

		<label for="password-label" class="label">Password</label>
		<input name="password" id="password-input" class="input" type="password" required />

		<div class="checkbox-container">
			<input name="remember" type="checkbox" id="remember-check" checked />
			<label id="remember-label" for="remember-check">Remember me</label>
		</div>
		<button id="submit-sign-in" type="submit" for="sign-in-form">Continue</button>
	</form>

	<div class="grey-question">
		Don't have an account? <a href="/v2/client/create-account" class="question-link">Create one</a>
	</div>
</div>

<style>
    .container {
        min-height: 40vh;
    }
	form {
		display: flex;
		flex-direction: column;
		color: var(--dark-blue);
	}
	.title {
		font-family: openSans-Bold;
		color: var(--dark-blue);
		font-size: 1.3vw;
		margin-bottom: 3vh;
	}
	.label {
		font-family: openSans-semibold;
		margin-bottom: 1vh;
	}
	input {
		margin-bottom: 2vh;
	}
	.checkbox-container {
		display: flex;
		align-items: center;
		font-family: openSans-semibold;
		color: var(--dark-blue);
		margin-bottom: 2vh;
		user-select: none;
	}
	#remember-check {
		appearance: none;
		height: 2vh;
		width: 2vh;
		margin-bottom: 0;
		margin-right: 5px;
		cursor: pointer;
		position: relative;
	}
	#remember-check:checked {
		background-color: var(--button-blue);
	}
	#remember-check:checked:after {
		content: '';
		position: absolute;
		width: 0.3vh;
		height: 0.8vh;
		left: 0.6vh;
		top: 0.2vh;
		transform: rotate(35deg);
		border-bottom: 0.3vh solid white;
		border-right: 0.3vh solid white;
	}
	.grey-question {
		margin-top: 5vh;
	}

	@media only screen and (max-width: 500px) {
		.title {
			font-size: 5vw;
		}
		input,
		.checkbox-container {
			margin-bottom: 4vh;
		}

		#remember-check {
			height: 2.5vh;
			width: 2.5vh;
			margin-right: 10px;
		}
		#remember-check:checked:after {
			width: 0.3vh;
			height: 1.1vh;
			left: 0.9vh;
			top: 0.4vh;
			transform: rotate(35deg);
			border-bottom: 0.4vh solid white;
			border-right: 0.4vh solid white;
		}
	}
</style>
