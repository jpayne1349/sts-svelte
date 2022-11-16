<script>

    import { fade } from 'svelte/transition';
    import { loadingStore } from '../client/stores';


</script>

{#if $loadingStore.show }

    <div class='spinner-bg' transition:fade>
        <div class='loading-spinner' transition:fade ></div>
    </div>

{/if}

<style>
    .loading-spinner {
		content: '';
		border-radius: 50%;
		border-top: 4px solid var(--dark-blue);
		border-right: 4px solid transparent;
		width: 5vw;
		height: 5vw;
		top: 41vh;
		left: 47.5vw;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		position: absolute;
		opacity: 1;
		transition: all 0.2s;
	}
    .spinner-bg {
        position: absolute;
        content: '';
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        background-color: rgba(222, 222, 222, 0.44);
        z-index: 1;
        pointer-events:all;
    }

    @media only screen and (max-width: 500px) {
    .loading-spinner {
        width: 15vw;
		height: 15vw;
		top: 40vh;
		left: 42vw;
    }
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