<script context="module" >
    import { initFirebase } from '../initFirebase';

    // specific to svelte. must be called load, and uses a special fetch function.
    export async function load({ params, fetch, session, stuff }) {
        const fbObject = await initFirebase();
        
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

    export let fbObject;

    setContext('fbObject', fbObject);

</script>

<Header />
<slot></slot>
<Footer />


