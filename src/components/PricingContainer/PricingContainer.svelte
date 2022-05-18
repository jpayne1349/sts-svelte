<script>
	import BackgroundOval from './BackgroundOval.svelte';

	import { onMount } from 'svelte';

	// *** Intersection Observer boilerplate ***
	// css needed: transform: translateY(4vh);
	//				opacity: 0;
	//				transition: all 1s;

	//				transform: translateY(0);
	//				opacity: 1;

	let id_one; // bind:this={component}
	let id_two;
	let right_section;
	let one_class; //class:show={intersected}
	let two_class;
	let right_class;

	onMount(setupObserver);

	// threshold = amount of screen crossing element top
	let intersectOptions = {
		threshold: 0.15
	};

	function setupObserver() {
		let observer = new IntersectionObserver(intersectCallback, intersectOptions);
		observer.observe(id_one);
		observer.observe(id_two);
		observer.observe(right_section);
	}

	// runs every time the intersection happens
	function intersectCallback(observerEventList) {
		observerEventList.forEach((eventEntry) => {
			if (eventEntry.isIntersecting) {
				eventEntry.target.id == 'one' ? (one_class = true) : '';
				eventEntry.target.id == 'two' ? (two_class = true) : '';
				eventEntry.target.id == 'right-section' ? (right_class = true) : '';
			}
		});
	}
	// *** end of intersection observer  ***
</script>

<div id="pricing-container">
	<div id="left-section">
		<a href="/pricing" id="pricing-title">Pricing</a>
		<div id="one" class="par-wrapper" bind:this={id_one} class:show={one_class}>
			<div class="par-title">Fixed</div>
			<div class="par-body">
				Set build budget quoted <br /> Monthly plan based on projected maintenance <br /> Additional
				rate $50/hour
			</div>
		</div>
		<div id="two" class="par-wrapper" bind:this={id_two} class:show={two_class}>
			<div class="par-title">Value</div>
			<div class="par-body">
				Retained monthly minimum <br /> starting at $100/month <br /> Commission based on value creation
			</div>
		</div>
	</div>

	<div id="right-section" bind:this={right_section} class:show={right_class}>
		<div id="pricing-cont">Cont.</div>
		<div class="details">
			Every project is different. Simple static websites and landing pages average a $200-$500 build
			fee. This includes a graphic design meeting and pre-deployment satisfaction guarantee. All
			web-related software requires third-party hosting and domain/url name subscriptions that
			average us $5/month. We offer a simple $30/month plan that includes hosting/domain management
			and up to four hours of maintenance. Additional change requests are billed at $50/hour.

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
		width: 70vw;
		margin-left: 15vw;
		color: #bbbec5;
		justify-content: space-between;
		position: relative;
		margin-top: 10vh;
	}
	#left-section {
		display: flex;
		flex-direction: column;
		width: 35vw;
	}
	#pricing-title {
		font-family: openSans-bolditalic;
		font-size: 3vw;
		text-align: left;
		text-decoration: none;
		color: #bbbec5;
	}
	#pricing-cont {
		display: none;
	}
	.par-wrapper {
		margin-top: 10vh;
		width: 25vw;
	}
	#two.par-wrapper {
		margin-left: 10vw;
	}
	#one,
	#two {
		opacity: 0;
		transform: translateX(-4vw);
		transition: all 1s;
	}
	#one.show,
	#two.show {
		transform: translateY(0);
		opacity: 1;
	}
	#right-section {
		opacity: 0;
		transform: translateY(4vh);
		transition: all 1s;
	}
	#right-section.show {
		transform: translateY(0);
		opacity: 1;
	}
	.par-title {
		font-family: openSans-medium;
		font-size: 2vw;
		text-align: center;
	}
	.par-body {
		font-family: openSans-light;
		font-size: 1.2vw;
		text-align: center;
	}

	#right-section {
		width: 35vw;
		margin-top: 18vh;
	}
	.details {
		font-family: openSans-light;
		font-size: 1.1vw;
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
		left: -45vw;
		top: -25vw;
	}

	@media only screen and (max-width: 615px) {
		#pricing-container {
			margin-left: 4vw;
			width: 92vw;
			margin-top: 0;
		}
		#pricing-title {
			font-size: 8vw;
			width: 92vw;
		}
		#pricing-cont {
			display: block;
			font-family: openSans-bolditalic;
			font-size: 7vw;
			margin-bottom: 2vh;
		}
		#left-section {
			width: 92vw;
			height: 50vh;
			scroll-snap-align: start;
			scroll-margin-top: 25vh;
		}
		.par-title {
			font-size: 5.5vw;
		}
		.par-body {
			font-size: 4vw;
		}
		.par-wrapper {
			width: 70vw;
			margin-top: 15vw;
		}
		#right-section {
			width: 92vw;
			display: flex;
			flex-direction: column;
			justify-content: center;
			height: 84vh;
			scroll-snap-align: start;
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
			width: 100vw;
		}
	}
</style>
