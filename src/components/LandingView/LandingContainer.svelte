<script>
import MainPitch from './MainPitch.svelte';

import ButtonContainer from './ButtonContainer.svelte';
import UnderButtonPhrase from './UnderButtonPhrase.svelte';
import SvgOvals from '../SvgOvals.svelte';

</script>

<div id='landing-container'>
    <SvgOvals />
    <MainPitch />
    <ButtonContainer />
    <UnderButtonPhrase />

</div>


<style>
    #landing-container {
        height: 100vh;
        position: relative;
    }

</style>