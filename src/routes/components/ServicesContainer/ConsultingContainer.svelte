<script>
	import ConsultingCloud from './ConsultingCloud.svelte';

	// *** Intersection Observer boilerplate ***
	// css needed: transform: translateY(4vh);
	//				opacity: 0;
	//				transition: all 1s;

	//				transform: translateY(0);
	//				opacity: 1;

	import { onMount } from 'svelte';

	let component; // bind:this={component}
	let intersected; //class:show={intersected}

	onMount(setupObserver);

	// threshold = amount of screen crossing element top
	let intersectOptions = {
		threshold: 0.15
	};

	function setupObserver() {
		let observer = new IntersectionObserver(intersectCallback, intersectOptions);
		observer.observe(component);
	}

	// runs every time the intersection happens
	function intersectCallback(observerEvent) {
		if (observerEvent[0].isIntersecting) {
			intersected ? '' : (intersected = true);
		}
	}

	// *** end of intersection observer  ***
</script>

<div id="consulting-container" bind:this={component} class:show={intersected}>
	<div id="main-content">
		<div id="title">I.T. and Software Consulting</div>
		<div id="sub-titles">
			<p class="st">Task Automation & Scripting</p>
			<p class="st">Local/Cloud Databases</p>
			<p class="st">Local Networking & Security</p>
		</div>
	</div>
	<div id="cloud">
		<ConsultingCloud />
	</div>
	<div id="details">
		<p class="text">Automate data entry, computer tasks, file organization, etc.</p>
		<p class="text">Organize and store your data with a custom interface for management.</p>
		<p class="text">
			Setup your home or business with modern infrastructure and security.
			<a id="contact-link" href="/contact-us">Contact us</a> or
			<a id="contact-link" href="/client">create an account</a> for a free quote.
		</p>
	</div>
</div>

<style>
	#consulting-container {
		display: flex;
		flex-direction: row-reverse;
		flex-wrap: wrap;
		color: #bbbec5;
		text-align: center;
		margin-top: 5vh;
		margin-bottom: 50vh;
		justify-content: space-between;
		position: relative;
		transform: translateY(4vh);
		opacity: 0;
		transition: all 1s;
	}
	#consulting-container.show {
		transform: translateY(0);
		opacity: 1;
	}
	#details {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		width: 30vw;

		padding-top: 6vh;
	}
	.text {
		font-family: openSans-light;
		font-size: 1.2vw;
	}
	#title {
		font-family: openSans-medium;
		font-size: 2vw;
		margin-top: 5vw;
		width: 25vw;
		text-align: center;
	}
	.st {
		font-family: openSans-light;
		font-size: 1.5vw;
		line-height: 4vw;
	}
	#main-content {
		position: relative;
		width: 32vw;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	#cloud {
		position: absolute;
		right: -2vw;
		z-index: -1;
	}
	#contact-link {
		color: #9bb0d3;
		text-decoration: none;
	}

	@media only screen and (max-width: 615px) {
		#consulting-container {
			flex-direction: column;
			flex-wrap: nowrap;
			margin-top: 0;
			height: 600px;
			margin-bottom: 0;
			align-items: center;
			justify-content: flex-start;
			scroll-snap-align: start;
			scroll-margin-top: 10vh;
		}
		#main-content {
			width: 100%;
		}
		#title {
			padding: 0 5vw;
			font-size: 5.4vw;
			margin-top: 13vw;
			text-align: center;
			width: 70vw;
		}
		.st {
			font-size: 4.5vw;
			line-height: 10vw;
		}
		#details {
			width: 92vw;
			padding-top: 40px;
		}
		.text {
			font-size: 4.2vw;
			margin-bottom: 40px;
		}
		#cloud {
			width: 92vw;
			left: 0;
		}
	}
</style>
