
  
  <script>
    import '../global.css';

    import ErrorPage from './components/ErrorPage.svelte'; 

    import { page } from '$app/stores';
  </script>
  

  <ErrorPage message={$page.error.message} status={$page.status} />



