<script>
	import MainPitch from './MainPitch.svelte';

	import ButtonContainer from './ButtonContainer.svelte';
	import UnderButtonPhrase from './UnderButtonPhrase.svelte';
	import ComingSoonSvg from './ComingSoonSVG.svelte';
</script>

<div id="landing-container">
	<MainPitch />

	<ButtonContainer />
	<UnderButtonPhrase />
	<ComingSoonSvg />
</div>

<style>
	#landing-container {
		height: 800px;
		position: relative;
		width: 100vw;
	}
</style>
