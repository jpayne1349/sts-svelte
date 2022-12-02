<script>
import ContactForm from "./ContactForm.svelte";
import ContactTitle from "./ContactTitle.svelte";



</script>

<div id='contact-container'>

<ContactTitle />
<ContactForm autoSubject={'none'}/>

</div>



<style>
    #contact-container {
        width: 100vw;
        padding: 0 10vw;
        
        color: #BBBEC5;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }


    @media only screen and (max-width: 615px) {
	#contact-container {
        width: 100vw;
        padding: 0 5vw;
        
        height: 75vh;
        scroll-snap-align: start;
        margin-bottom: 10vh;
        justify-content: flex-start;
    }
    }
</style>
