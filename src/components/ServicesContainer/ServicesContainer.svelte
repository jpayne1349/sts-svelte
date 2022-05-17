<script>
import ConsultingContainer from "./ConsultingContainer.svelte";
import ServicesTitle from "./ServicesTitle.svelte";
import WebDevContainer from "./WebDevContainer.svelte";

    
</script>


<div id='services-container' >
    
<ServicesTitle />
<WebDevContainer />
<ConsultingContainer />

</div>


<style>
    #services-container {
        width: 70vw;
        margin-left: 15vw;
        display: flex;
        flex-direction: column;

    }
    @media only screen and (max-width: 615px) {
       #services-container {
        width: 92vw;
        margin-left: 4vw;
       }
    }
</style>