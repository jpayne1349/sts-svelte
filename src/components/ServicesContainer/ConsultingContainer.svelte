<script>
	import ConsultingCloud from './ConsultingCloud.svelte';
</script>

<div id="consulting-container">
	<div id="main-content">
		<div id="title">I.T. and Software Consulting</div>
		<div id="sub-titles">
			<p class="st">Task Automation & Scripting</p>
			<p class="st">Local/Cloud Databases</p>
			<p class="st">Local Networking & Security</p>
		</div>
		<div id="cloud">
			<ConsultingCloud />
		</div>
	</div>

	<div id="details">
		<p class="text">Automate data entry, computer tasks, file organization, etc.</p>
		<p class="text">Organize and store your data with a custom interface for managing.</p>
		<p class="text">
			Setup your home or business with modern infrastructure and security. 
            <a
				id="contact-link"
				href="#contact-form">Contact Us</a
			> for a free quote.
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
		height: 32vw;
	}
	#details {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		width: 32vw;
		margin-right: 3vw;
		padding-top: 10vh;
		padding-bottom: 3vh;
	}
	.text {
		font-family: openSans-light;
		font-size: 1.5vw;
	}
	#title {
		font-family: openSans-medium;
		font-size: 2.2vw;
		margin-top: 8vw;
	}
	.st {
		font-family: openSans-light;
		font-size: 1.8vw;
		line-height: 5vw;
	}
	#main-content {
		position: relative;
		width: 45vw;
		display: flex;
		flex-direction: column;
	}
	#cloud {
		position: absolute;
		top: 0;
		left: -2vw;
		z-index: -1;
	}
    #contact-link {
		color: #9bb0d3;
		text-decoration: none;
	}

	@media only screen and (max-width: 775px) {
		#consulting-container {
			flex-direction: row;
			flex-wrap: wrap;
			margin-top: 10vh;
		}
		#main-content {
			width: 80vw;
		}
		#title {
			padding: 0 5vw;
			font-size: 5.4vw;
			margin-top: 13vw;
			text-align: center;
		}
		.st {
			font-size: 4.5vw;
            line-height: 10vw;
		}
		#details {
			width: 80vw;
			height: 40vh;
			padding-top: 5vh;
			margin: 0;
		}
		.text {
			font-size: 4.2vw;
		}
		#cloud {
			width: 96vw;
			overflow-x: hidden;
			transform: translateX(-8vw);
			left: 0;
		}
	}
</style>
