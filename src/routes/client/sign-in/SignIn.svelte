<script>
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';
	import { alertStore, fbStore, loadingStore, sessionStore } from '../stores.js';
	import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'firebase/auth';
	import { fade } from 'svelte/transition';

	let submitting_form = false;
	let form_element;

	async function signInAttempt(event) {
		submitting_form = true;

		let data = new FormData(form_element);

		let email = data.get('email');
		let password = data.get('password');
		
		// either 'on' or null
		let remember = data.get('remember');
		
		try {
			if(remember != 'on') {
				setPersistence($fbStore.auth,browserSessionPersistence); 
			}
			
			let attempt = await signInWithEmailAndPassword($fbStore.auth, email, password);

			// this should trigger an authstatechange , which would trigger our callbacks in layout..
		} catch (e) {
			alertStore.set({
				message: 'Incorrect Email/Password',
				error: true,
				show: true
			});

			submitting_form = false;
		}

		return;
	}
</script>

<section class="container" id="sign-in-container">
	<h1 class="container-title">Sign in to your account</h1>

	<form
		method="POST"
		id="sign-in-form"
		on:submit|preventDefault={signInAttempt}
		bind:this={form_element}
	>
		<label for="email-label" class="label">Email</label>
		<input name="email" id="email-input" class="input" type="email" required autocomplete="email" />

		<label for="password-label" class="label">Password</label>
		<input
			name="password"
			id="password-input"
			class="input"
			type="password"
			required
			autocomplete="current-password"
		/>

		<div class="checkbox-container">
			<input name="remember" type="checkbox" id="remember-check" class="checkbox" />
			<label id="remember-label" for="remember-check" class="checkbox-label">Remember me</label>
		</div>
		<button id="submit-sign-in" type="submit" for="sign-in-form">
			{#if !submitting_form}
				Continue
			{:else}
				<span class="button-spinner" in:fade />
			{/if}
		</button>
	</form>

	<p class='center-link' >
	<a href="/client/password-reset" class="forgot-password">Forgot Password?</a>
	</p>

	<div class="grey-question">
		Don't have an account? <a href="/client/create-account" class="question-link">Create one</a>
	</div>
</section>

<style>
	.container {
		min-height: 400px;
	}
	form {
		display: flex;
		flex-direction: column;
		color: var(--bg);
	}
	.label {
		font-family: openSans-semibold;
		margin-bottom: 10px;
	}
	input,
	.checkbox-container {
		margin-bottom: 20px;
	}
	.checkbox-container {
		display: flex;
		align-items: center;
		font-family: openSans-semibold;
		color: var(--bg);
		margin-bottom: 20px;
		user-select: none;
	}
	p.center-link {
		text-align: center;
	}
	.forgot-password {
		font-family: openSans-semibold;
		color: var(--link);
		font-size: 14px;
		text-align: center;
		user-select: none;
		align-self: center;
	}
	.grey-question {
		margin-top: 30px;
		
	}
	button {
		cursor: pointer;
		user-select: none;
	}
	.button-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid white;
		border-right: 2px solid transparent;
		width: 20px;
		height: 20px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin-left: 10px;
	}

	@media only screen and (max-width: 500px) {
		input,
		.checkbox-container {
			margin-bottom: 30px;
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
