<script>

	// eventually many things will happen here to check user login status, redirect, etc.
	import '../../client_app.css';
	import ClientNavigationBar from '../../components/ClientPortal/ClientNavigationBar.svelte';
    import { writable } from 'svelte/store';
    import { setContext } from 'svelte';
    import { onMount } from 'svelte';

    // data will be what is passed to this template by layout.js, to run backend services..basically
	export let data;

	let active_view = 'home';

    let context_data = setContext('client_object', data);
    console.log('set context data', context_data);
    
    onMount(()=> {

        

    });
    

</script>

<ClientNavigationBar {active_view} />

<slot></slot>

<style>
</style>
