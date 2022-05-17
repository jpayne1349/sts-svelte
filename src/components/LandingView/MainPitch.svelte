<script>
	import { fly } from 'svelte/transition';

	let windowWidth = 0;
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div id="MainPitch">

    <div id="line1" >Develop your ideas</div>
	<div id="line2" >Let us take care of the tech</div>
</div>

<style>
	#MainPitch {
		color: #bbbec5;
		font-size: 4vw;
		font-family: openSans-extrabolditalic;
		margin-top: 30px;
		margin-left: 15vw;
		max-width: 70vw;
	}

	@media only screen and (max-width: 615px) {
		#MainPitch {
			font-size: 9.6vw;
            text-align: center;
			margin: 0 4vw;
			max-width: 92vw;
			scroll-snap-align: start;
			scroll-margin-top: 8vh;
		}
		#line2 {
			font-size: 5vw;
            font-family: openSans-regular;

		}
	}
</style>
