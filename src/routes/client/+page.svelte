<script>
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Client Portal | SouthTexas.Software</title>
	<meta
		name="description"
		content="Become a client today! Request and track services, manage payment methods, download receipts and more."
	/>
</svelte:head>

<section class="container">
	<h3>What's this?</h3>
	<p>
		Simple and secure access to track your projects. The portal helps us to stay organized by
		storing documents and managing administrative tasks. You can: View our breakdown of services and submit
		the interactive form to request a quote. Access PDF copies of quotes, invoices, and receipts.
		Add a default payment method for your recurring service fees. Access preview links and check on
		the latest status of your software.
	</p>

	<button
		class="create"
		on:click={() => {
			goto('/client/create-account');
		}}>Create an Account</button
	>

	<button
		on:click={() => {
			goto('/client/sign-in');
		}}>Sign In</button
	>

	<p>
		This is a new section of the services we created to improve the client experience.
		Please feel free drop a question or comment in the contact form. Thanks!
	</p>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
	}
	h3 {
		font-family: openSans-medium;
		font-size: 24px;
	}
	p {
		margin: 10px;
		font-family: openSans-regular;
	}
	button {
		width: 250px;
		align-self: center;
		margin-top: 30px;
	}
	button.create {
		background-color: var(--button-light-blue);
	}
</style>
