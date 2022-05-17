<script>
import ContactForm from "./ContactForm.svelte";
import ContactTitle from "./ContactTitle.svelte";



</script>

<div id='contact-container'>

<ContactTitle />
<ContactForm />

</div>



<style>
    #contact-container {
        width: 80vw;
        margin-left: 10vw;
        color: #BBBEC5;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }


    @media only screen and (max-width: 615px) {
	#contact-container {
        width: 92vw;
        margin-left: 4vw;
        height: 75vh;
        scroll-snap-align: start;
        margin-bottom: 10vh;
        justify-content: flex-start;
    }
    }
</style>
