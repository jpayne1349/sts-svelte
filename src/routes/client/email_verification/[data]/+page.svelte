<script>
	let status_message = 'Verifying email address link...';
	import {
		alertStore,
		email_verification,
		fbStore,
		sessionStore,
		loadingStore
	} from '../../stores';
	import { slide } from 'svelte/transition';
	import { updateDoc, doc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(verifyEmail);

	loadingStore.set({
		show: false
	});

	async function verifyEmail() {
		// populate the email verification store and set a flag to redirect? or no

		if ($sessionStore.email_verified) {
			alertStore.set({
				show: true,
				error: false,
				message: 'Email Already Verified...'
			});

			$email_verification.url = '';

			let redirect = goto('/client/portal/profile');

			return;
		}

		if ($email_verification.url == '') {
			$email_verification.url = $page.url.pathname;
		}

		let split_url = $email_verification.url.split('=');
		
		let token = split_url[1] + '=' + split_url[2];

		try {
			let server_response = await fetch('/client/api/email_verification', {
				method: 'POST',
				body: JSON.stringify({ token: token }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			let jsonResponse = await server_response.json();

			let user_from_link = jsonResponse.decryptedToken;
			

			if (user_from_link.email == $sessionStore.email) {
				status_message = 'Email Verified';
				
				let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);
				let updatedUserDoc = await updateDoc(userDocReference, {
					email_verified: true
				});

				$email_verification.url = '';

				alertStore.set({
					show: true,
					error: false,
					message: 'Email Verified!'
				});

				let redirect = goto('/client/portal/profile');
			}
		} catch (e) {
			//console.log(e);
			alertStore.set({
				show: true,
				error: true,
				message: 'Something went wrong'
			});

			let sendEmail = fetch('/client/api/generateErrorEmail', {
				method: 'POST',
				body: JSON.stringify({
					title: 'Error in Email Verification',
					account: $sessionStore.email,
					details: e
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	}
</script>

<section class="container">
	<div class="big-spinner" transition:slide />
	{#key status_message}
		<p class="status-message" transition:slide>
			{status_message}
		</p>
	{/key}
</section>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.big-spinner {
		content: '';
		border-radius: 50%;
		border-top: 4px solid var(--main);
		border-right: 4px solid transparent;
		width: 100px;
		height: 100px;
		animation-name: spinning;
		animation-duration: 2s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
		margin: 50px 0;
	}

	.status-message {
		font-family: openSans-regular;
		font-size: 20px;
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
