<script>
	import DesktopOutline from './DesktopOutline.svelte';
</script>

<div id="webdev-container">
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
	

	@media only screen and (max-width: 775px) {
		#webdev-container {
            height: 75vh;
			margin-top: 10vw;
            flex-direction: column;
            justify-content: flex-start;
			scroll-snap-align: start;
			scroll-margin-top: 17vh;
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
