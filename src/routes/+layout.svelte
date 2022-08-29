
<script>

    // data is coming from the layout.js load function for connection to firebase
    export let data;


    import '../app.css';
    import Header from '../components/Header.svelte';
    import Footer from '../components/Footer.svelte';
    import CookiePopup from '../components/CookiePopup.svelte';

    import { setContext } from 'svelte';
    
    console.log(data);

    setContext('fbObject', data);

</script>

<Header />
<slot></slot>
<Footer />
<CookiePopup />

