<script>
import ContactUsButton from "./ContactUsButton.svelte";
import ServicesButton from "./ServicesButton.svelte";


</script>


<div id='buttonContainer'>

<ContactUsButton />

<ServicesButton />

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
        margin-left: 0;
        justify-content: space-evenly;
        width: 100vw;
        position: absolute;
        bottom: 225px;
    }
}
</style>