<script>
import ServicesTitle from "./ServicesTitle.svelte";
import WebDevContainer from "./WebDevContainer.svelte";

    
</script>


<div id='container' >
    
<ServicesTitle />
<WebDevContainer />

</div>


<style>
    #container {
        position: absolute;
        top: 100vh;
        width: 80vw;
        margin-left: 10vw;
        display: flex;
        flex-direction: column;
    }
    @media only screen and (max-width: 775px) {
        #container {
            top: 100vh;
        }

    }
</style>