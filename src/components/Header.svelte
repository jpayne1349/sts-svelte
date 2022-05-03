<script>
	let header_string = '{ "South Texas" : "Software" }';
</script>

<div id='container'>
<div id="header">
	{header_string}
</div>
</div>

<style>
	#container {
		display: flex;
		margin: 5px 10vw;
		justify-content: flex-end;
	}
	#header {
		color: #898f99;
		font-family: openSans-semibold;
		font-size: 1.1em;
	}
    @media only screen and (max-width: 775px) {
        
		#container {
			justify-content: center;
		}
		#header {
            font-size: 0.7em;
        }
    }

</style>
