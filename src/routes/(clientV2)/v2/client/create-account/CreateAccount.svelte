<script>

import {alertStore, fbStore, stripeStore} from '../stores.js';
import { enhance } from '$app/forms';
import { createUserWithEmailAndPassword } from 'firebase/auth';

let password_validating = false;
let password_validated = false;

// called on each input in the password field
function checkPassword(event) {
    console.log(event.target.value);
    if(event.target.value.length > 0) {
        password_validating = true;
    } else {
        password_validating = false;
        return 
    }

    if(event.target.value.length < 8) {
        password_validated = false;
        return 
    }

    if(validate_password_string(event.target.value)) {
        password_validated = true;
    } else {
        password_validated = false;
    }

}

function validate_password_string(str) {

    var pattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$');


    if (pattern.test(str)) {
        return true;
    }

    return false;
}

async function createAccount({ form, data, action, cancel }) {

    let email = data.get('email');
    let password = data.get('password');

    try {
        let firebaseAttempt = await createUserWithEmailAndPassword($fbStore.auth, email, password);
    } catch(e) {
        console.log(e.code);
        alertStore.set({
            message: e.code,
            error: true,
            show: true
        });
    }

}

</script>

<div class="container" id="sign-in-container">
	<div class="title">Create an account</div>

	<form method="POST" id="sign-in-form" use:enhance={createAccount}>

		<label for="email-label" id='email-label' class="label">Email</label>
		<input name="email" id="email-input" class="input" type="email" required />

        <div class='label-container'>
		<label for="password" class="label">Password </label>
        {#if password_validating == true && password_validated == false }
        <div class='validation-spinner'></div>
        {:else if password_validated == true && password_validating == true}
        <div class='validation-passed'></div>
        {/if}
        </div>
		<input name="password" id="password-input" class="input" type="password" required on:input={checkPassword}/>
        <div class='password-reqs' >min: 1 uppercase | 1 number | 1 special character | length > 7</div>

        <div class='label-container'>
		<label for="password-confirm" class="label">Password </label>
        <div class='validation-spinner' ></div>
        <div class='validation-passed'></div>
        </div>
		<input name="password-confirm" id="password-confirm" class="input" type="password" required />

		<button id="submit-sign-in" type="submit" for="sign-in-form">Continue</button>
	</form>

	<div class="grey-question">
		Already have an account? <a href="/v2/client/sign-in" class="question-link">Sign in</a>
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
    .label-container {
        display: flex;
        align-items: center;
        margin-bottom: 1vh;
    }
	.label {
		font-family: openSans-semibold;
		
        position: relative;
	}
    .label#email-label {
margin-bottom: 1vh;
    }
	input {
		margin-bottom: 2vh;
	}
    input#password-input {
        margin-bottom: 0;
    }
    .password-reqs {
        font-family: openSans-semibold;
        font-size: 0.5vw;
        color: var(--grey-text);
        margin-bottom: 1.8vh;
    }

	.grey-question {
		margin-top: 5vh;
	}
    button {
        margin-top: 3vh;
    }
    .validation-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid var(--dark-blue);
		border-right: 2px solid transparent;
		width: 1vh;
		height: 1vh;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
        margin-left: 5px;
	}
    .validation-passed {
        content: '';
        width: 0.6vh;
        height: 1.1vh;
        border-bottom: 3px solid var(--global-green);
        border-right: 3px solid var(--global-green);
        transform: rotate(35deg);
        margin-left: 5px;
        
    }

	@media only screen and (max-width: 500px) {
		.title {
			font-size: 5vw;
		}
		input {
			margin-bottom: 4vh;
		}
        .password-reqs {
            font-size: 2.5vw;
        }
         button {
        margin-top: 2vh;
    }
    .validation-spinner {
        width: 1.5vh;
        height: 1.5vh;
        border-top: 1px solid var(--dark-blue);
		border-right: 1px solid transparent;
    }
    .validation-passed {
        width: 0.8vh;
        height: 1.5vh;
        border-bottom: 3px solid var(--global-green);
        border-right: 3px solid var(--global-green);
    }
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