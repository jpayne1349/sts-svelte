<script>
	import { slide } from 'svelte/transition';
	import { getDownloadURL, ref } from 'firebase/storage';
	import { fbStore, sessionStore } from '../../stores';
	import { goto } from '$app/navigation';

	export let file;

	let loadingLink = false;
	let errorFlag = false;

	/**
	 * Build a reference to the cloud stored document and open
	 * @ Sets a component flag if 'file not found'
	 **/
	async function retrieveCloudDocument() {
		loadingLink = true;
		let url = '';
		try {
			url = await getDownloadURL(
				ref($fbStore.storage, '/client-portal-users/' + $sessionStore.cuid + '/' + file.filename)
			);

			loadingLink = false;
			let goToFileLocation = await goto(url);
		} catch (e) {
			errorFlag = true;
			//console.log(e);

			// set alert store with e.code or e.message
			loadingLink = false;
		}
	}

	function processUnixTimestamp(timestamp) {
		let timestampDate = new Date(timestamp * 1000);
		let displayString = timestampDate.toString();
		displayString = displayString.slice(0, 15);
		return displayString;
	}
</script>

<button class="document-container" in:slide|local on:click={retrieveCloudDocument}>
	<div class="text-container">
		<p class="doc-name">{file.filename}</p>

		<p class="doc-date">Created: {processUnixTimestamp(file.created)}</p>
	</div>
	<div class="icon">
		{#if loadingLink}
			<span class="spinner" />
		{:else}
			<img src="/../../document.svg" alt="DocumentIcon" />
		{/if}
	</div>
</button>

<style>
	.document-container {
		width: 95%;
		display: flex;
		margin: 10px 0 0px 5px;
		padding: 0px 5px;
		background-color: rgb(250, 250, 250);
		justify-content: flex-start;
		cursor: pointer;
		border-left: 2px solid var(--bar-color);
		border-radius: 0;
		box-shadow: none;
		color: black;
		font-size: 14px;
		height: 50px;
	}
	.text-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.doc-name {
		font-family: openSans-light;
		margin-left: 5px;
	}
	.doc-date {
		font-size: 10px;
		font-family: 'openSans-light';
		margin-left: 15px;
	}
	.icon {
		margin-left: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 5px;
	}
	.spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid var(--main);
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
</style>
