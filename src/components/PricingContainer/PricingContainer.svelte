<script>
	import BackgroundOval from './BackgroundOval.svelte';
</script>

<div id="pricing-container">
	<div id="left-section">
		<div id="pricing-title">Pricing</div>
        <div id='one' class='par-wrapper'>
		<div class="par-title">Fixed</div>
		<div class="par-body">
			Set build budget quoted <br /> Monthly plan based on projected maintenance  <br /> Additional rate $50/hour
		</div>
    </div>
    <div id='two' class='par-wrapper'>
		<div class="par-title">Value</div>
		<div class="par-body">
			Retained monthly minimum <br /> starting at $100/month <br /> Commission based on value creation
		</div>
    </div>
	</div>

	<div id="right-section">
		<div class="details">
			Every project is different. Simple static websites and landing pages average a $200-$500 build
			fee. This includes a graphic design meeting and pre-deployment satisfaction guarantee. All
			web-related software requires third-party hosting and domain/url name subscriptions that
			average us $5/month. Most customers prefer a simple $30/month plan that includes
			hosting/domain management and up to four hours of maintenance. Additional change requests are
			billed at $50/hour.

			<div id="small-detail">Traffic based plans start when exceeding 5,000 users/day.</div>
		</div>
		<div class="details">
			Larger web-related projects typically fall into the $3k-$5k build fee range. Examples include
			inventory management systems, customer order handling, web applications, etc. If applicable, a
			commission-based contract is proposed. Providing incentive and building an environment to
			increase revenue.
		</div>
	</div>

	<div id="oval-wrapper">
		<BackgroundOval />
	</div>
</div>

<style>
	#pricing-container {
		display: flex;
		flex-wrap: wrap;
		position: absolute;
		top: 270vh;
		width: 80vw;
		margin-left: 10vw;
        color: #BBBEC5;
        justify-content: space-between;
	}
    #left-section {
        display: flex;
        flex-direction: column;
        width: 40vw;
    }
    #pricing-title {
        font-family: openSans-bolditalic;
        font-size: 4vw;
        text-align: left;
    }
    .par-wrapper {
        margin-top: 10vh;
        width: 20vw;
    }
    #two.par-wrapper {
        margin-left: 10vw;
    }
    .par-title {
        font-family: openSans-medium;
        font-size: 2.5vw;
        text-align: center;
    }
    .par-body {
        font-family: openSans-light;
        font-size: 1.5vw;
        text-align: center;
    }

    #right-section {
        width: 35vw;
        margin-top: 8vw;
    }
    .details {
        font-family: openSans-light;
        font-size: 1.3vw;
        text-align: center;
        
        margin-bottom: 8vh;
    }
    #small-detail {
        margin-top: 10px;
        font-size: 0.8vw;
    }
    #oval-wrapper {
        position: absolute;
        z-index: -1;
        width: 80vw;
        left: -40vw;
        top: -25vw;
    }

	@media only screen and (max-width: 775px) {
        #pricing-container {
            margin-left: 4vw;
            top: 290vh;
            width: 92vw;
        }
        #pricing-title {
            font-size: 8vw;
            width: 92vw;
        }
        #left-section{
            width: 92vw;
        }
        .par-title {
            font-size: 5.5vw;
        }
        .par-body {
            font-size: 4vw;
        }
        .par-wrapper {
            width: 50vw;
            margin-top: 6vw;
        }
        #right-section {
            width: 92vw;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-top: 25vw;
        }
        .details {
            font-size: 4.5vw;
            text-align: center;
        }
        #small-detail {
            font-size: 3vw;
        }
        #oval-wrapper {
            top: -3vh;
            left: -4vw;
            
        }
	}
</style>
