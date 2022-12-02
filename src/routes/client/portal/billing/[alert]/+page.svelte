<script>
import { beforeUpdate } from 'svelte';
import { page } from '$app/stores';
import { alertStore } from '../../../stores';
import { goto } from '$app/navigation';

beforeUpdate( async ()=>{

    let alertString = $page.params.alert;

    let alertArray = alertString.split('=');

    alertStore.set({
        error:alertArray[1],
        show: true,
        message: alertArray[0]
    });

    let redirect = await goto('/client/portal/billing');    

});



</script>




<style>


</style>