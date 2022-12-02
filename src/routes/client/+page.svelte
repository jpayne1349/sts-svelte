<script>

    import { goto } from '$app/navigation';

</script>

<svelte:head>
	<title>
		Client Portal | SouthTexas.Software
	</title>
	<meta name='description' 
	content="Become a client today! Request and track services, manage payment methods, download receipts and more.">
</svelte:head>

<section class="container">
	<h3>What's this?</h3>
	<p>
		A way for us and our clients to store and view projects and information. You can request
		services, manage payment methods, subscriptions, download documents, view latest service events,
		access preview links, check out your codebase, etc.
	</p>

	<button class='create' on:click={()=>{goto('/client/create-account');}}>Create an Account</button>

	<button on:click={()=>{goto('/client/sign-in');}}>Sign In</button>

	<p>
		This is a new evolving section of services we provide to make our clients experience smoother.
		Please drop us a comment with your feedback and suggestions! Thank you.
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
