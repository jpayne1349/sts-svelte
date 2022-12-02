<script>
	import { sessionStore } from '../stores';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	/** Intent is to monitor session state specifically for billing documents that are 'open' **/

	export let doc;

	let docPathname = '/client/portal/' + doc.type + '/' + doc.id;

	let backgroundProcessing = false;

    let unsubListener = sessionStore.subscribe((storeData)=>{
        if(storeData.billing.open_documents.length > 0) {
            if(storeData.billing.open_documents[0].processing) {
                backgroundProcessing = true;
            }
            else {
                backgroundProcessing = false;
            }
        }
    });

</script>

{#if $page.url.pathname.includes(doc.type) == false}
	<section class="container" in:fly={{ y: -10, delay: 100 }}>
		<div class="doc-container">
			You have a finalized&nbsp;
			<button
				on:click={() => {
					goto(docPathname);
				}}
			>
				{doc.type}
			</button>
			&nbsp;ready to review!
		</div>
        {#if backgroundProcessing}
        <div class='spinner'></div>
        {/if}

    </section>
{/if}

<style>
	.container {
		padding: 15px;
		margin-top: 0px;
        display: flex;
        align-items: center;
	}
	.doc-container {
		font-family: openSans-regular;
		font-size: 16px;
		display: flex;
		border-left: 2px solid var(--bar-color);
		padding-left: 15px;
	}
	button {
		font-family: openSans-regular;
		font-size: 16px;
		background-color: transparent;
		box-shadow: none;
		color: var(--button-light-blue);
		text-decoration: underline;
		margin: 0;
		height: fit-content;
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
		margin-left: auto;
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
