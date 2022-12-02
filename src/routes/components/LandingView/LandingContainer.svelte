<script>
import MainPitch from './MainPitch.svelte';

import ButtonContainer from './ButtonContainer.svelte';
import UnderButtonPhrase from './UnderButtonPhrase.svelte';


</script>

<div id='landing-container'>
    <MainPitch />
    <ButtonContainer />
    <UnderButtonPhrase />

</div>


<style>
    #landing-container {
        height: 100vh;
        position: relative;
        width: 100vw;
    }

</style>