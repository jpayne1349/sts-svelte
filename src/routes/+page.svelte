<svelte:head>
	<title>Software Development and I.T. Consulting | SouthTexas.Software</title>
	<meta
		name="description"
		content="Helping small businesses, weddings, bloggers, etc. design, build, and manage custom websites. Real people, real service. We write custom software for task automation, scripting, databases, and more. Contact us today for a free consultation or quote!"
	/>
</svelte:head>


<!-- TODO: add COOKIE popup banner for legitimate consent of policy.. -->
<script>
	import ServicesContainer from '../components/ServicesContainer/ServicesContainer.svelte';
	import PricingContainer from '../components/PricingContainer/PricingContainer.svelte';
	import ContactContainer from '../components/ContactContainer/ContactContainer.svelte';
	import LandingContainer from '../components/LandingView/LandingContainer.svelte';
</script>

<!-- TODO: if firebase init fails, the contact container should error out. and the node server should contact us to fix.. -->

<!-- TODO: we should actually write a test to check if the form is working, and send an error some other way. -->

<!-- TODO: contact form hides bottom of letter on the from/subject lines -->


<LandingContainer />

<ServicesContainer />
<PricingContainer />
<ContactContainer />
