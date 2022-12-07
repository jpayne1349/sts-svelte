<script>
	import BackgroundOval from './BackgroundOval.svelte';

	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

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

	let showWebDevDetails = false;
	let showConsultingDetails = false;

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
				Build budget quoted <br /> Service plans from $30 <br /> Hourly rate $30-$50
			</div>
		</div>
		<div id="two" class="par-wrapper" bind:this={id_two} class:show={two_class}>
			<div class="par-title">Value</div>
			<div class="par-body">
				Commission based on value creation <br /> Flat rate retainer <br />
			</div>
		</div>
	</div>

	<div id="right-section" bind:this={right_section} class:show={right_class}>
		<div id="pricing-cont">Cont.</div>
		<div class="details">
			Every project is different and most quotes will reflect that. Whether you need a quick script
			to improve your workflow or a maintained web application, we can provide a quote and an
			explanation.

			<button
				on:click={() => {
					showWebDevDetails = !showWebDevDetails;
				}}
				><h4 class="details-header">More on Web Development</h4>
				<div class:active={showWebDevDetails} class="details-arrow" /></button
			>
			<button
				on:click={() => {
					showConsultingDetails = !showConsultingDetails;
				}}
				><h4 class="details-header">More on Software Consulting</h4>
				<div class:active={showConsultingDetails} class="details-arrow" /></button
			>
		</div>
		<div class="details" />
	</div>

	{#if showWebDevDetails}
		<div class="details-pullover" transition:fly={{ x: 300 }}>
			<button
				on:click={() => {
					showWebDevDetails = !showWebDevDetails;
				}}
				class="pullover"
				><div
					class:active={showWebDevDetails}
					class="details-arrow pullover"
					in:fade={{ delay: 500 }}
				/></button
			>
			<h4 class="details-header">Web Dev Pricing Explained</h4>
			<p class="details-sub-paragraph">
				Anything web related requires monthly upkeep that you can manage, or you can pay us to
				manage. This ranges from domain name fees to web server hosting. The driver behind you
				seeing this information is a physical device! Even if it's located at Cloud Drive or Server
				Lane.
			</p>

			<p class="details-sub-paragraph">
				Simple static websites and landing pages average a $300-$500 build fee. This includes a
				graphic design meeting and pre-deployment satisfaction guarantee. We start our service plans
				at $30/month and include any work necessary to keep your site up and running free of charge.
				Change requests that involve modification and/or new code are billed at $50/hour. Periodic
				content updates are handled on a case by case basis, for a much smaller fee.
			</p>

			<p class="details-sub-paragraph">
				Looking to manage your own content? Sell products or services online? These typically fall
				into the $3k-$5k build fee range. Examples include inventory management systems, customer
				order handling, high traffic/turnover blogs, etc. If applicable, a commission-based contract
				is proposed. We refer to this as a 'value' oriented service plan, where our earnings are
				based on the value that we provide to you.
			</p>

			<p class="details-sub-paragraph">
				Unique and well-performing software isn't written in a day, and your website shouldn't be
				either. Feel free to cruise around our small site here and assess it's performance and
				usability. We don't claim to be the best, but we do strive to use modern techniques and
				sound engineering to produce high quality results. If you're interested in a quote, feel
				free to <a href="/contact-us">contact us</a>, or
				<a href="/client">create an account</a> to complete a services request form. Thanks!
			</p>
		</div>
	{/if}

	{#if showConsultingDetails}
		<div class="details-pullover" transition:fly={{ x: 300 }}>
			<button
				on:click={() => {
					showConsultingDetails = !showConsultingDetails;
				}}
				class="pullover"
				><div
					class:active={showConsultingDetails}
					class="details-arrow pullover"
					in:fade={{ delay: 500 }}
				/></button
			>
			<h4 class="details-header">Consulting Pricing Explained</h4>
			<p class="details-sub-paragraph">
				An hourly rate is determined based on the type of work and extent of the scope. A quote can
				then be generated based on an estimated timeframe. Hourly rates tend to vary from $30-$50
				dependent on the complexity and nature of the job. Designing an in-house inventory
				management system and scraping web data are very different tasks.
			</p>

			<p class="details-sub-paragraph">
				We have experience with mechanical hardware of all sizes as well as embedded systems.
				Nothing is out of the question! If you're interested in a quote, feel free to <a
					href="/contact-us">contact us</a
				>, or
				<a href="/client">create an account</a> to complete a services request form. Thanks!
			</p>
		</div>
	{/if}

	<div id="oval-wrapper">
		<BackgroundOval />
	</div>
</div>

<style>
	a {
		color: #9bb0d3;
		text-decoration: none;
	}
	button {
		background-color: transparent;
		box-shadow: none;
		margin: 100px 0 5px 0;
		color: inherit;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	#pricing-container {
		display: flex;
		flex-wrap: wrap;
		width: 100vw;
		margin-left: 15vw;
		color: #bbbec5;
		/* color: white; */
		justify-content: flex-start;
		position: relative;
		margin-top: 100px;
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
		margin-top: 90px;
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
		transform: translateY(40px);
		transition: all 1s;
		margin-left: 10vw;
		width: 35vw;
		margin-top: 100px;
	}
	#right-section.show {
		transform: translateY(0);
		opacity: 1;
	}
	.par-title {
		font-family: openSans-medium;
		font-size: 24px;
		text-align: center;
	}
	.par-body {
		font-family: openSans-light;
		font-size: 16px;
		text-align: center;
	}
	.details-pullover {
		position: fixed;
		height: 100vh;
		color: #bbbec5;
		right: 0;
		top: 0;
		padding: 75px 50px 25px 75px;
		z-index: 999;
		background-color: var(--bg);
		font-family: openSans-regular;
		font-size: 18px;
		line-height: 30px;
		width: 600px;
		overflow: scroll;
	}
	.details {
		font-family: openSans-regular;
		font-size: 16px;
		text-align: center;

		margin-bottom: 80px;
	}
	.details-header {
		text-align: left;
		font-size: 20px;
		font-family: openSans-medium;
	}
	.details-arrow {
		content: '';
		width: 50px;
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	button.pullover {
		position: fixed;
		right: 550px;
		height: 100%;
		top: 0;
	}
	.details-arrow.pullover {
		position: fixed;
		right: 550px;
		height: 100%;
		top: 0;
	}
	.details-arrow::before {
		content: '';
		width: 8px;
		height: 8px;
		border-bottom: 2px solid #bbbec5;
		border-right: 2px solid #bbbec5;
		transform: rotate3d(0, 0, 1, -45deg);
		transition: all 0.3s;
	}
	.details-arrow.active::before {
		transform: rotate3d(0, 0, 1, -45deg) rotate3d(1, -1, 0, 180deg);
	}
	.details-sub-paragraph {
		margin: 40px 0;
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
			width: 100vw;
			margin-top: 50px;
			margin-left: 0;
		}
		#pricing-title {
			font-size: 8vw;
			width: 100vw;
			padding-left: 4vw;
			margin-top: 60px;
			margin-bottom: 0px;
		}
		#pricing-cont {
			display: block;
			font-family: openSans-bolditalic;
			font-size: 7vw;
			margin-bottom: 20px;
		}
		#left-section {
			width: 100vw;
			height: 470px;

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
			width: 100vw;
			display: flex;
			flex-direction: column;
			justify-content: center;
			
			scroll-snap-align: start;
			margin-left: 0;
			padding: 20px;
		}
		.details {
			font-size: 4.5vw;
			text-align: center;
		}
		.details-pullover {
			padding: 50px 25px 150px 45px;
			width: 95vw;
		}
		button {
			margin-top: 25px;
		}
		button.pullover {
			position: fixed;
			right: 550px;
			height: 100%;
			top: 0;
		}
		.details-arrow.pullover {
			position: fixed;
			left: 5vw;
			height: 100%;
			top: 0;
		}

		#oval-wrapper {
			top: 0px;
			left: -8vw;
			width: 100vw;
		}
	}
</style>
