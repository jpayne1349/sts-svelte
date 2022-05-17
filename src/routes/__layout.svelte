<script context="module" >
    import { initFirebase } from '../initFirebase';

    // specific to svelte. must be called load, and uses a special fetch function.
    export async function load({ params, fetch, session, stuff }) {
        
        let fbObject;

        try {
            fbObject = await initFirebase();
            
        } catch(e) {
            console.log(e);
            
        }
        
        
        return {
            props: {fbObject:fbObject}
        }
    }

</script>

<script>

    import '../app.css';
    import Header from '../components/Header.svelte';
    import Footer from '../components/Footer.svelte';

    import { setContext } from 'svelte';
    import { onMount } from 'svelte';

    export let fbObject;
    
    onMount(() => {
        console.log(fbObject);
    });
    

    setContext('fbObject', fbObject);

</script>

<Header />
<slot></slot>
<Footer />


