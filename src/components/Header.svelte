<script>
	let header_string = '{ "South Texas" : "Software" }';

	let initials_string = '{"STS"}';
</script>

<div id="header-container">
	<a href="/" id="header">
		{header_string}
	</a>
	
</div>


<style>
	#header-container {
		display: flex;
		margin: 10px 15vw;
		justify-content: flex-end;
	}
	#header {
		color: #898f99;
		font-family: openSans-semibold;
		font-size: 1.1em;
		text-decoration: none;
	}
	@media only screen and (max-width: 775px) {
		#header-container {
			margin: 10px 4vw 0px;
			
			justify-content: flex-end;
		}
		#header {
			font-size: 0.7em;
		}

	}
</style>
