<script>
	import { sessionStore, fbStore, alertStore } from '../../../stores';
	import Document from '../../billing/Document.svelte';
	import { ref } from 'firebase/storage';
	import { goto } from '$app/navigation';
	import { beforeUpdate } from 'svelte';

	export let data;
	let accepting_quote = false;
	let quoteObject;
	let fileReference;
	let quoteStatus = '';
	let allowAccept = true;

	quoteObject = data.quote;

	if (quoteObject.status != 'open') {
		quoteStatus = quoteObject.status;
		allowAccept = false;
	}

	// get fileobject from sessionStore
	let quoteFilename = 'Quote_' + quoteObject.id.slice(-8, -1) + '.pdf';
	for (let doc of $sessionStore.billing.documents) {
		if (doc.filename == quoteFilename) {
			fileReference = doc;
		}
	}

	async function acceptQuote() {
		accepting_quote = true;

		let serverReponse = await fetch('/client/api/stripe/acceptQuote', {
			method: 'POST',
			body: JSON.stringify({ quoteId: quoteObject.id }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		serverReponse = await serverReponse.json();

		if (serverReponse.error) {
			alertStore.set({
				message: 'Something Went Wrong',
				error: true,
				show: true
			});

			let sendEmail = fetch('/client/api/generateErrorEmail', {
				method: 'POST',
				body: JSON.stringify({
					title: 'Error in Accepting Quote',
					account: $sessionStore.email,
					details: serverReponse.code
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return;
		}

		// successful / no errors

		alertStore.set({
			show: true,
			error: false,
			message: 'Quote Accepted!'
		});
		
		$sessionStore.billing.open_documents[0].processing = true;

		let closePage = await goto('/client/portal/billing');

		accepting_quote = false;
	}

	function formatLineItems(lineItem) {
		let splitItem = lineItem.description.split(':');

		let htmlString = 'x' + lineItem.quantity + ' ' + splitItem[0] + '<br> Options:' + splitItem[1];

		return htmlString;
	}
</script>

<section class="container">
	<h3>Quote Review</h3>

	<div class="group">
		<p class="label">Name</p>
		<p class="variable">{$sessionStore.billing.name}</p>
	</div>

	<div class="group">
		<p class="label document">Reference Document</p>
		<p class="variable document">
			{#if fileReference}
				<Document file={fileReference} />
			{/if}
		</p>
	</div>

	<div class="group">
		<p class="variable line-items">
			{#each quoteObject.line_items.data as item}
				<p class="line-item">
					{@html formatLineItems(item)}

					{#if item.price.recurring != null}
						<p class="recurring">Monthly</p>
					{/if}
				</p>
			{/each}
		</p>
	</div>

	<div class="group"><p class="total">Total: ${quoteObject.amount_total / 100} USD</p></div>

	<p class="footer">
		By clicking 'Accept Quote' you acknowledge reviewal of the reference document, total price of
		services, and agree to pay the full amount at time of invoicing. Please visit the billing page
		of the Client Portal to make changes or contact us at info@southtexas.software. Thank you for
		your business!
	</p>

	<div class="group">
		{#if allowAccept}
			<button on:click={acceptQuote}>
				{#if accepting_quote}
					<div class="spinner" />
				{:else}
					Accept Quote
				{/if}
			</button>
		{:else}
			<div class="not-allowed">Looks like this quote has been {quoteStatus}</div>
		{/if}
	</div>
</section>

<style>
	.container {
		margin-bottom: 2vh;
		display: flex;
		flex-direction: column;
		min-height: 600px;
		padding: 0;
		border: 1px solid var(--main);
	}
	h3 {
		font-family: openSans-semibold;
		background-color: var(--main);
		color: white;
		width: 100%;
		text-align: center;
		padding: 15px 0;
		margin-bottom: 15px;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}

	.group {
		display: flex;
		flex-direction: column;
		margin: 10px 25px 5px;
	}

	p {
		font-family: openSans-regular;
		font-size: 16px;
	}
	p.label {
		font-family: openSans-medium;
		width: 150px;
	}
	p.label.document {
		width: 100%;
	}
	p.variable {
		margin: 0px 0 0 10px;
		background-color: rgb(250, 250, 250);
		padding: 4px 10px;
		border-radius: 5px;
	}
	p.variable.document {
		padding-bottom: 15px;
	}
	p.total {
		font-family: openSans-semibold;
		font-size: 16px;
		margin-bottom: 25px;
		text-align: center;
	}

	.line-item {
		display: flex;
		font-size: 12px;
		color: var(--main);
		margin: 8px 0px;
		border-bottom: 1px dotted var(--bar-color);
		justify-content: flex-start;
		position: relative;
		line-height: 20px;
	}
	.recurring {
		font-size: 10px;
		color: var(--global-green);
		font-family: openSans-bold;
		margin-left: 5px;
		transform: translateY(-5px);
		position: absolute;
		right: 15px;
	}
	button {
		width: 100%;
		margin-bottom: 15px;
		background-color: var(--main);
	}
	.not-allowed {
		width: 100%;
		margin-bottom: 15px;
		background-color: var(--button-light-blue);
		text-align: center;
		font-family: openSans-medium;
		color: white;
		padding: 10px 0;
		border-radius: 5px;
	}
	.footer {
		font-family: openSans-light;
		font-size: 14px;
		text-align: center;
		margin: auto 15px 20px;
	}
	.spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid white;
		border-right: 2px solid transparent;
		width: 15px;
		height: 15px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
	}

	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	@media only screen and (max-width: 500px) {
		.footer {
			font-size: 10px;
		}
	}
</style>
