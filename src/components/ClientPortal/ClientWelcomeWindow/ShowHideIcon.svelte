<script>
    
    import { fade } from 'svelte/transition';

    export let hidden_bool;

</script>

<svg
	width="15px"
	height="16px"
	viewBox="0 0 15 16"
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
>
	<title>Show/Hide Password</title>
	<g id="client-portal" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
		<g id="login-view-create" transform="translate(-924.000000, -514.000000)" stroke="rgb(193 193 193)">
			<g id="Show-Hide-Eye" transform="translate(924.000000, 514.772759)">
				<ellipse id="outer" cx="7.5" cy="7.72724134" rx="7" ry="4" />
				<ellipse id="iris" fill="#526889" cx="6" cy="7.72724134" rx="1.5" ry="2" />
				{#if hidden_bool}
                <path transition:fade="{{ duration: 200 }}"
					d="M6.56908997,0.155480255 L7.97109744,0.190324613 L8.32514061,14.8445197 L6.92313314,14.8096754 L6.56908997,0.155480255 Z"
					id="hidden-line"
					fill="black"
					transform="translate(7.447115, 7.500000) rotate(30.000000) translate(-7.447115, -7.500000) "
				/>
                {/if}
			</g>
		</g>
	</g>
</svg>

<style>

</style>
