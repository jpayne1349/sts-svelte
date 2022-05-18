<script>

</script>

<div id='footer'>
    <div class='row' id='links'>
    <a class='link' href='/terms-and-conditions'>Terms and Conditions</a>
    <a class='link' href='/privacy-policy'>Privacy Policy</a>
    <a class='link' href='/cookie-policy'>Cookie Policy</a>
</div>
    <div class='row' id='copyright'>South Texas Software LLC</div>
    
</div>


<style>
    #footer {
        display: flex;
        flex-direction: column;
		width: 68vw;
        margin: 0 15vw;
        margin-bottom: 2vh;
		align-items: center;
        color: #898f99;
		font-family: openSans-semibold;
		font-size: 1.1em;
		text-decoration: none;
        margin-top: auto;
    }
    .row {
        width: 100%;
        display: flex;
        text-align: center;
        justify-content: center;
    }
    #links.row{
        justify-content: space-evenly;
        margin-bottom: 2vh;
    }
    .link {
        color: #898f99;
		font-family: openSans-semibold;
		font-size: 1.3vw;
		text-decoration: none;
        text-align: center;
        width: 33%;
    }
    #copyright {
        user-select: none;
        font-size: 1vw;
    }

    @media only screen and (max-width: 615px) {
        #footer  {
            width: 92vw;
            margin-left: 4vw;
            font-size: 1.6vw;
            margin-bottom: 5vh;
        }
        .link {
            font-size: 2vw;
        }
        #copyright {
            font-size: 1.4vw;
        }
    }

</style>