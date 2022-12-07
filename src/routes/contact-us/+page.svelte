
<svelte:head>
	<title>
		Contact Us | SouthTexas.Software
	</title>
	<meta name='description' 
	content="Interested in a new or updated website? What about local databases and employee portals? Contact us for a free consultation or quote!">
</svelte:head>

<script>
	import ContactForm from '../components/ContactContainer/ContactForm.svelte';
	import ContactTitle from '../components/ContactContainer/ContactTitle.svelte';
</script>

<div id="contact-page">
	<div id="title-wrapper"><ContactTitle /></div>
	<div class="details">
		We are a new family-owned business looking for clients! Feel free to reach out with your
		questions, proposals, etc. and we will promptly get back to you via your provided contact
		information.
	</div>
	<ContactForm autoSubject={'none'} />
	<div class="details">
		If you haven't already, please review our current <a class="link" href="/services">Services</a>
		and <a class="link" href="/pricing">Pricing</a>.
	</div>
</div>

<style>
	#contact-page {
		display: flex;
		/* min-height: 95vh; */
		width: 100vw;
		justify-content: flex-start;
		align-items: center;
		flex-direction: column;
		color: #bbbec5;
	}
    .link {
        text-decoration: none;
        color: #6A91D1;
    }
    .link:hover {
        color: #6a92d1e5;
    }
	.details {
		font-family: openSans-light;
		font-size: 20px;
		text-align: center;
		width: 70vw;
		margin: 3vh 0;
	}
	@media only screen and (max-width: 615px) {
		.details {
			width: 92vw;
			font-size: 4vw;
			margin: 1vh 0 3vh;
		}
	}
</style>
