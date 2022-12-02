<script>
	import { afterNavigate,  } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
    import { beforeUpdate } from 'svelte';
    import { cookiePopupStore } from '../client/stores';

	let firstNavigation = false;
    let showPopup = false;

    beforeUpdate(()=>{
        showPopup = !$cookiePopupStore.policyCookieSet;
    });

	afterNavigate(({ from }) => {
		// checks if this is first visit of session
		if (from === null) {
			firstNavigation = true;
		}
	});

	async function setCookie() {
		// call an endpoint that sets the cookie..
		let server_response = await fetch('/client/api/set-cookie', {
			method: 'POST',
			body: JSON.stringify({ value: true }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	
        


    }


</script>

{#if showPopup && firstNavigation}
	<div class="cookie-popup" in:fly={{ y: 100, delay: 500 }} out:fade={{ duration: 200 }}>
		<div class="row">This website uses cookies to analyze traffic and improve security.</div>
		<div class="row buttons">
			<a
				on:click={() => {
					showPopup = false;
				}}
				href="/cookie-policy"
				class="button policy">Policy</a
			>
			<button
				on:click={() => {
					showPopup = false;
                    firstNavigation = false;
					setCookie();
				}}
				class="button okay">Okay</button
			>
		</div>
	</div>
{/if}

<style>
	.cookie-popup {
		color: var(--text);
		display: flex;
		flex-direction: column;
		position: fixed;
		bottom: 4vh;
		right: 5vw;
		width: 400px;
		text-align: center;
		padding: 15px;
		background-color: #3c4f71f5;
		opacity: 1;
		border-radius: 10px;
		font-family: openSans-regular;
		z-index: 20;
	}

	.buttons {
		display: flex;
		width: 100%;
		justify-content: space-around;
		margin-top: 1vh;
	}

	.button {
		width: 35%;
		height: 3vh;
		line-height: 3vh;
		border-radius: 5px;
		color: white;
		cursor: pointer;
		text-decoration: none;
		margin: 0;
		font-family: openSans-semibold;
		font-size: 16px;
	}

	.button.policy {
		background-color: var(--button-light-blue);
	}
	.button.okay {
		background-color: #1e2b42;
	}

	@media only screen and (max-width: 615px) {
		.cookie-popup {
			width: 90vw;
			bottom: 2vh;
			flex-direction: row;
		}
		.buttons {
			margin-top: 0;
			align-items: center;
		}
		.button {
			width: 40%;
			height: 6vh;
			line-height: 6vh;
		}
	}
</style>
