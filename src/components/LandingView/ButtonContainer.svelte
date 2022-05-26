<script>
import GetStartedButton from "./GetStartedButton.svelte";
import LearnMoreButton from "./LearnMoreButton.svelte";


</script>


<div id='buttonContainer'>

<GetStartedButton buttonText='CONTACT US'/>

<LearnMoreButton buttonText='SERVICES'/>

</div>

<style>
    #buttonContainer {
        display: flex;
        margin-left: 15vw;
        width: 70vw;
        margin-top: 15px;
    }
@media only screen and (max-width: 615px) {
    #buttonContainer {
        margin-left: 8vw;
        justify-content: space-evenly;
        width: 84vw;
        position: absolute;
        bottom: 25vh;
    }
}
</style>