<script>

	// eventually many things will happen here to check user login status, redirect, etc.
	import '../../client_app.css';
	import ClientNavigationBar from '../../components/ClientPortal/ClientNavigationBar.svelte';
    import { writable } from 'svelte/store';
    import { setContext } from 'svelte';
    import { onMount } from 'svelte';
    import ClientWelcome from '../../components/ClientPortal/ClientWelcomeWindow/ClientWelcome.svelte';

    // data will be what is passed to this template by layout.js, to run backend services..basically
	export let data;

	let active_view = 'home';

    let context_data = setContext('client_object', data);

    // placeholder for something updated on login.
    let logged_in_bool = data.user_login_status;

</script>

<ClientNavigationBar {active_view} {logged_in_bool} />

{#if logged_in_bool}
    <slot></slot>
{:else}
    <ClientWelcome />
{/if}


<style>
</style>
