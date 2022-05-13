<script>
	import Loader from './Loader.svelte';
	import { fade, fly } from 'svelte/transition';

	export let status;
	let title = '';

	$: if (status == 'sending') {
		title = 'Almost There';
	}
	$: if (status == 'sent') {
		title = 'Thank You';
	}
	$: if (status == 'failed') {
		title = 'Uh Oh';
	}
</script>

{#if status != 'idle'}
	<div id="popup-container" in:fly={{ y: -50, duration: 500 }} out:fade >
		{#key title}
			<div id="popup-title" in:fade >{title}</div>
		{/key}

		<div id="status-container" in:fade>
			{#if status == 'sending'}
				<Loader failed={status == 'failed'} />
			{:else if status == 'sent'}
				<div id="result-icon" in:fade>
					<div id="check-mark" />
				</div>
			{:else if status == 'failed'}
				<div id="failed-header" in:fade>Something went wrong.</div>
				<div in:fade>
					An error report has been sent, please try again soon or send us an email directly.
				</div>
				<a in:fade id="email-link" href="mailto: development@southtexas.software">
					development@southtexas.software
				</a>
			{:else}
				<div id="result-icon" />
			{/if}
		</div>

		<div id="popup-message">Form status: {status}.</div>
	</div>
{/if}

<style>
	#popup-container {
		position: absolute;
		width: 20vw;
		height: 20vw;
		left: 30vw;
		top: 5vh;
		background-color: #081428d4;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		border-radius: 15px;
		box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.49);
	}
	#popup-title {
		font-family: openSans-bolditalic;
		font-size: 2.5vw;
	}
	#status-container {
		margin: 0 3vw;
		text-align: center;
		font-family: openSans-light;
		font-size: 1vw;
	}
	#email-link {
		text-decoration: none;
		color: #6a91d1;
	}
	#failed-header {
		font-size: 1.3vw;
		transform: translateY(-3vw);
	}
	#result-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80px;
		width: 80px;
	}
	#check-mark {
		transform: rotate(45deg) translateY(-1vw);
		height: 5vw;
		width: 2.5vw;
		border-bottom: 1vw solid green;
		border-right: 1vw solid green;
	}

	#popup-message {
		font-family: openSans-light;
		font-size: 0.7vw;
		color: #49576d;
	}

    @media only screen and (max-width: 775px) {
        #popup-container {
            width: 50vw;
    height: 50vw;
    left: 21vw;
    top: 15vh;
        }
        #popup-title {
            font-size: 5vw;
        }
        #popup-message {
            font-size: 2vw;
        }
        #check-mark {
            height: 10vw;
    width: 5vw;
    border-width: 2vw;
        }
        #status-container {
            font-size: 2.5vw;
        }
        #failed-header {
            font-size: 4vw;
        }
    }
</style>
