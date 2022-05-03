<script>
	import { fly } from 'svelte/transition';

	let windowWidth = 0;
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div id="MainPitch">

    <div id="line1" transition:fly>Develop your ideas</div>
	<div id="line2" transition:fly>Let us take care of the tech</div>
</div>

<style>
	#MainPitch {
		color: #bbbec5;
		font-size: 5vw;
		font-family: openSans-extrabolditalic;
		margin-top: 30px;
		margin-left: 10vw;
		max-width: 80vw;
	}

	@media only screen and (max-width: 775px) {
		#MainPitch {
			font-size: 9.6vw;
            text-align: center;
			margin-left: 4vw;
			max-width: 92vw;
			margin-top: 10px;
		}
		#line2 {
			font-size: 5vw;
            font-family: openSans-regular;

		}
	}
</style>
