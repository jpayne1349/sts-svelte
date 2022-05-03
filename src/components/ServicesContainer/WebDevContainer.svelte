<script>
import DesktopOutline from "./DesktopOutline.svelte";


</script>



<div id='outer-container'>
    <div id='left-section'>
        <div id='shifted-outline'>
            <DesktopOutline />
        </div>
        <DesktopOutline text=true />
    </div>

    <div id='right-section' >
        <p class='details'>From static landing pages to owner managed e-commerce. We can help you put your vision on the web. </p>
        <p class='details'>Mobile friendly, in-house design, hand written software, google optimization, traffic analytics, secure hosting, and the list goes on! <a id='contact-link' href='#contact-form'>Contact Us</a> for a free quote.</p>
    </div>
</div>


<style>

#outer-container {
    display:flex;
    margin-top: 5vw;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
#left-section {
    position: relative;
}
#shifted-outline {
    position: absolute;
    transform: translate(-2vw, -3vw);
    z-index: -1;
}
#right-section {
    font-family: openSans-light;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    text-align: center;
    color: #BBBEC5;
    width: 30vw;
    font-size: 1.5vw;
}
#contact-link {
    color: #9BB0D3;
    text-decoration: none;
}

@media only screen and (max-width: 775px) {
    #outer-container {
        margin-top: 9vw;
    }

    #shifted-outline   {
        transform: translate(-3vw, -5vw);
    }

    #right-section {
        width: 65vw;
        font-size: 4.2vw;
        height: 40vh;
    }
    
}

</style>