<svelte:head>
	<title>
		Project Pricing | SouthTexas.Software
	</title>
	<meta name='description' 
	content="How much does a custom website cost? Read about our general pricing and what we base it off of. All pricing is custom fit to your project size and requirements! Contact us for a free quote!">
</svelte:head>


<script>
import PricingContainer from "../../../components/PricingContainer/PricingContainer.svelte";



</script>


<div id='pricing-page'>
<PricingContainer />

<div class='details'>
    Let us know what your thinking. <a href='/contact-us' class='link' >Contact Us</a>.
</div>

</div>

<style >
    #pricing-page {
        min-height: 90vw;
        margin-top: 3vh;
        
    }
    .details {
		font-family: openSans-light;
		font-size: 1.3vw;
		text-align: center;
		width: 98vw;
		transform: translateY(25vh);
        color: #bbbec5;
	}
    .link {
        text-decoration: none;
        color: #6A91D1;
        
    }
    @media only screen and (max-width: 615px) {
		#pricing-page {
            margin-bottom: 5vh;
        }
        .details {
			width: 100vw;
			font-size: 4.5vw;
			transform: translateY(-4vh);
		}
    }
</style>