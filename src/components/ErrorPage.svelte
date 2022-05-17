<script>
	import ContactForm from './ContactContainer/ContactForm.svelte';

	export let message;
	export let status;

	let title = '';

	console.log(message, status);
	if(status == 404) {
		title = 'Page Not Found';
	} else {
		title = 'Error - ' + status + ' ' + message;
	}

	let autoSubject = message;

</script>

<div id="notfound-container">
	<div id="title">{ title }</div>

	<div id="details">
		We're sorry. It looks like this link was not found. <br />
		Please send us a message about what you were looking for. Thanks.
	</div>

	<div id="contact-wrapper">
		<ContactForm {autoSubject} />
	</div>
</div>

<style>
	#notfound-container {
		color: #bbbec5;
		width: 80vw;
		margin-left: 10vw;
	}
	#title {
		font-size: 4vw;
		font-family: openSans-extrabolditalic;
		margin-top: 30px;

		text-align: center;
	}
	#details {
		font-family: openSans-light;
		font-size: 2vw;

		text-align: center;
		margin: 3vh 0;
	}

	@media only screen and (max-width: 775px) {
		#notfound-container {
			width: 92vw;
			margin-left: 4vw;
		}
		#title {
			font-size: 10vw;
		}
		#details {
			font-size: 4vw;
		}
	}
</style>
