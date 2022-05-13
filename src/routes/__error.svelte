<script context="module">
    export function load({ error, status }) {
        return {
            props: {
                message: error.message,
                status // same as status: status
            }
        };
    }
  </script>
  
  <script>
    import '../app.css';

    import ErrorPage from '../components/ErrorPage.svelte'; 

    export let message;
    export let status;
  </script>
  

  <ErrorPage {message} {status} />



