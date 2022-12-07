<script>
	import { fade } from 'svelte/transition';
	import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
	import { fbStore, sessionStore, alertStore } from '../stores';
	import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();

	let form_element;

	let submitting_form = false;

    let password_value;

	async function reauthAttempt() {
		submitting_form = true;
		try {
            let credential = EmailAuthProvider.credential($sessionStore.email, password_value);

            let reauthTry = await reauthenticateWithCredential($fbStore.auth.currentUser, credential);

            // will catch error if password incorrect,

            dispatch('success', 'reauthenticated');
			submitting_form = false;

        } catch(e) {
            let alertMessage = 'Unable to Reauthenticate';
            if(e.code == 'auth/wrong-password') {
                alertMessage = 'Incorrect Password';
                password_value = '';
            }
            alertStore.set({
                show: true,
                error: true,
                message: alertMessage
            });
			submitting_form = false;

        }

	}


</script>

<div class="blur-backdrop" />

<div class="modal-container">
	<h3 class="title">Password Required</h3>
	<h4 class="subtitle">Please reauthenticate to make these changes.</h4>

	<form
		method="POST"
		id="sign-in-form"
		on:submit|preventDefault={reauthAttempt}
		bind:this={form_element}
	>
		<label for="password-label" class="label">Password</label>
		<input
			name="password"
			id="password-input"
			class="input"
			type="password"
			required
			autocomplete="current-password"
            bind:value={password_value}
		/>

		<button id="submit-sign-in" type="submit" for="sign-in-form">
			{#if !submitting_form}
				Continue
			{:else}
				<span class="button-spinner" in:fade />
			{/if}
		</button>
	</form>

	<p class="note">
		To protect your account, certain actions require that we verify your credentials if you have not
		manually logged in recently.
	</p>
</div>

<style>
	.blur-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100%;
		pointer-events: none;
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
		z-index: 10;
	}

	.modal-container {
		position: absolute;
		top: 25vh;
		width: 350px;
		background-color: white;
		border-radius: 5px;
		box-shadow: var(--box-shadow);
		padding: 50px;
		display: flex;
		flex-direction: column;
		z-index: 15;
	}

	form {
		display: flex;
		flex-direction: column;
		color: var(--main);
	}
	.label {
		font-family: openSans-semibold;
		margin-bottom: 1vh;
	}
	input {
		margin-bottom: 50px;
	}

	h3,
	h4 {
		font-family: openSans-medium;
		color: var(--main);
		text-align: center;
		font-size: 20px;
		margin-bottom: 5px;
	}
	h4 {
		font-size: 15px;
		margin-bottom: 20px;
	}
	.note {
		font-family: openSans-light;
		font-size: 12px;
		color: var(--main);
		text-align: center;
		margin-bottom: -15px;
	}
	.button-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid white;
		border-right: 2px solid transparent;
		width: 15px;
		height: 15px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 10px;
	}

	@media only screen and (max-width: 500px) {
		.modal-container {
			width: 90vw;
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
