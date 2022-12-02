<script>
	import { sessionStore, fbStore, alertStore } from '../../../stores';
	import { page } from '$app/stores';
	import { getDownloadURL, ref } from 'firebase/storage';

	let receiptName = $page.params.dynamicData;
	let validId = false;
	let storageLink = '';


	// check if receiptId is valid
	for (let name of $sessionStore.billing.receipts) {
		if (receiptName == name) {
			validId = true;
		}
	}

	if (validId) {
		// build storage reference
		let filePath = 'client-portal-users/' + $sessionStore.cuid + '/' + receiptName + '.pdf';
		let fileRef = ref($fbStore.storage, filePath);
		

		getDownloadURL(fileRef)
			.then((url) => {
				storageLink = url;
				
			})
			.catch((e) => {
				//console.log(e);
			});
	}
</script>

<section class="container">
	{#if validId}
		<div class="object-title">Thanks for your payment!</div>
		<p class="object-message">
			You can view your receipt in a seperate window <a href={storageLink} target="_blank" >here</a> or download the file
			in the viewer below.
		</p>
		<object title="Payment Receipt PDF" data={storageLink} type="application/pdf" height="100%">
			<p>
				Looks like your browser doesn't have a PDF Viewer.
				<a href={storageLink}>Download the PDF Here</a>
				.
			</p>
		</object>
	{:else}
		<!-- show some error prompt -->
		<p class="invalid-title">Receipt ID Invalid</p>
		<p class="invalid-receipt">Receipt ID Lookup: {receiptName}</p>
		<p class="invalid-body">
			Looks like the receipt you're looking for doesn't exist, or something went wrong on our end.
			Please try again or reach out to us for help! Thanks.
		</p>
	{/if}
</section>

<style>
	object {
		height: 575px;
		width: 100%;
		margin-top: 15px;
	}
	p.object-message {
		font-size: 18px;
	}
	a {
		color: var(--link);
		text-decoration: underline;
	}
	.container {
		margin-bottom: 15px;
		min-height: 400px;
	}
	.invalid-title,
	.object-title {
		text-align: center;
		font-family: openSans-bold;
		font-size: 24px;
		color: var(--secondary);
		margin-top: 0;
		text-decoration: underline;
	}
	p {
		text-align: center;
		font-size: 14px;
		font-family: openSans-regular;
		margin-top: 25px;
	}
</style>
