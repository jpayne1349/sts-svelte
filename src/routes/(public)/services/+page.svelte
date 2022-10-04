<svelte:head>
	<title>
		Our Services | SouthTexas.Software
	</title>
	<meta name='description' 
	content="Services include: Web development such as websites, web apps, and web servers. IT and Software Consulting such as task automation, scripting, local and cloud databases, local networking and security. Contact us for a free consultation or quote!">
</svelte:head>


<script>
	import ServicesContainer from '../../components/ServicesContainer/ServicesContainer.svelte';
</script>

<div id="services-page">
	<ServicesContainer />

	<div class="details">Continue to <a class='link' href='/pricing'>Pricing</a>.</div>
</div>

<style>

	.details {
		font-family: openSans-light;
		font-size: 1.3vw;
		text-align: center;
		width: 98vw;
        color: #bbbec5;
        margin: 3vh 0;
        transform:translateY(-25vh);
	}
    .link {
        text-decoration: none;
        color: #6A91D1;
        
    }
	@media only screen and (max-width: 615px) {
		.details {
			width: 100vw;
			font-size: 4.5vw;
			transform:translateY(-8vh)
		}
	}
</style>
