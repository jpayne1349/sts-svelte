<script>
	import { onMount } from 'svelte';

	import DesktopOutline from './DesktopOutline.svelte';

	// *** Intersection Observer boilerplate ***
	// css needed: transform: translateY(4vh);
	//				opacity: 0;
	//				transition: all 1s;

	//				transform: translateY(0);
	//				opacity: 1;

	let component; // bind:this={component}
	let intersected; //class:show={intersected}

	onMount(setupObserver);

	// threshold = amount of screen crossing element top
	let intersectOptions = {
		threshold: 0.25
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

<div id="webdev-container" bind:this={component} class:show={intersected}>
	<div id="left-section">
		<div id="shifted-outline">
			<DesktopOutline />
		</div>
		<DesktopOutline text="true" />
	</div>

	<div id="right-section">
		<p class="details">
			From static landing pages to owner managed e-commerce. We can help you put your vision on the
			web.
		</p>
		<p class="details">
			Mobile friendly, in-house design, hand written software, google optimization, traffic
			analytics, secure hosting, and the list goes on!
		</p>
	</div>
</div>

<style>
	#webdev-container {
		display: flex;
		margin-top: 5vw;
		flex-wrap: wrap;
		justify-content: space-evenly;
		transform: translateY(4vh);
		opacity: 0;
		transition: all 1s;
	}
	#webdev-container.show {
		transform: translateY(0);
		opacity: 1;
	}
	#left-section {
		position: relative;
	}
	#shifted-outline {
		position: absolute;
		transform: translate(-2vw, -3vw);
		z-index: -1;
	}
	#right-section {
		font-family: openSans-light;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		text-align: center;
		color: #bbbec5;
		width: 30vw;
		font-size: 1.2vw;
	}

	@media only screen and (max-width: 615px) {
		#webdev-container {
			height: 75vh;
			margin-top: 10vw;
			flex-direction: column;
			justify-content: flex-start;
			scroll-snap-align: start;
			scroll-margin-top: 17vh;
			flex-wrap: nowrap;
		}

		#shifted-outline {
			transform: translate(-3vw, -5vw);
			width: 100%;
		}
		#left-section {
			width: 100%;
		}
		#right-section {
			width: 100%;
			font-size: 4.2vw;
			height: 40vh;
		}
	}
</style>
