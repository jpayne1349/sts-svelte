<script>
	import { fade, fly } from 'svelte/transition';
	import { alertStore, fbStore } from '../stores';
	import { EmailAuthCredential, signInWithCustomToken } from 'firebase/auth';
	import NewPassword from './NewPassword.svelte';

	let sendingEmail = false;
	let emailEntered;
	let tokenEntered;
    let showPasswordChangeModal = false;
	let emailSent = false;

	// so what we can do, generate a token here in the browser, send that to the api
	// api uses that and a secret token on the server to encrypt a key

	function submitForm() {
		if (emailSent) {
			verifyToken();
		} else {
			sendTokenEmail();
		}
	}

	async function sendTokenEmail() {
		if (sendingEmail) {
			return;
		}
		sendingEmail = true;

		let serverRequest = await fetch('/client/api/resetPassword', {
			method: 'POST',
			body: JSON.stringify({
				email: emailEntered
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		let response = await serverRequest.json();

		//console.log(response);
		if (response.error) {
			alertStore.set({
				show: true,
				error: true,
				message: response.code
			});

			emailEntered = '';
		}

		if (response.sent) {
			// trigger alert?
			alertStore.set({
				show: true,
				error: false,
				message: 'Email Sent!'
			});

			emailSent = true;
		}

		sendingEmail = false;
	}

	async function verifyToken() {
		try {
			let userCredential = await signInWithCustomToken($fbStore.auth, tokenEntered);
			// access to userCredential.user.uid
            // or $fbStore.auth.currentUser
            showPasswordChangeModal = true;

		} catch (e) {
			alertStore.set({
				show: true,
				error: true,
				message: e.code
			});

		}
	}

</script>

<section class="container">
	<h1 class="container-title">
        {#if emailSent}
        Verify Token
        {:else}
        Login via Email Token
        {/if}
    
    </h1>

	<form method="POST" id="resetPasswordForm" on:submit|preventDefault={submitForm}>
		{#if !emailSent}
			<label for="email-label" class="label" in:fly={{ duration: 300, y: -20 }}>Email</label>
			<input
				name="email"
				id="email-input"
				class="input"
				type="email"
				required
				autocomplete="email"
				bind:value={emailEntered}
				in:fly={{ duration: 300, y: -20 }}
			/>
		{/if}

		{#if emailSent}
			<label for="token-label" class="label" in:fly={{ duration: 300, y: -20 }}>Token</label>
			<input
				name="token"
				id="token-input"
				class="input"
				type="password"
				required
				in:fly={{ duration: 300, y: -20 }}
				bind:value={tokenEntered}
			/>
		{/if}

        {#if emailSent}
            <p in:fade>Check your email for a secure token and input it above. Remember to check all your email folders before requesting a new token. Thank you.</p>
        {:else}
		<p in:fade>
			This will generate a one-time token that will be sent to your account email. Verify the token
			here to update your password.
		</p>
        {/if}

		<button type="submit" for="resetPasswordForm">
			{#if !sendingEmail && !emailSent}
				Send
			{:else if sendingEmail && !emailSent}
				<span class="button-spinner" in:fade />
			{:else}
				Verify Token
			{/if}
		</button>
	</form>
    <div class='existing-token'>
        <button class='link-format' on:click={()=>{emailSent = !emailSent;}} >
           {#if emailSent}
                Resend Email
            {:else}
            I have a token already
            {/if}
        </button>
    </div>
    

</section>

{#if showPasswordChangeModal}
<NewPassword />
{/if}

<style>
	.container {
		min-height: 40vh;
	}
	form {
		display: flex;
		flex-direction: column;
		color: var(--bg);
	}
	.label {
		font-family: openSans-semibold;
		margin-bottom: 1vh;
	}
	input {
		margin-bottom: 2vh;
	}
	p {
		font-family: openSans-regular;
		margin-bottom: 2vh;
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
    .link-format {
        background-color: transparent;
        box-shadow: none;
        color: var(--button-light-blue);
        text-decoration: underline;
        font-size: 12px;
        margin: 0;
    }
    .existing-token {
        text-align: center;
        width: 100%;
    }

	@media only screen and (max-width: 500px) {
		input {
			margin-bottom: 4vh;
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
