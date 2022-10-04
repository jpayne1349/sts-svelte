

<script>

    import { getContext } from 'svelte';


    let context_object = getContext('client_object');
    let client_object = context_object.client_object;

</script>



<div id='client_nav_layout' >


    <img id='logo_img' src='/sts-icon-v3.svg' alt='STS Logo' />
    <div id='client_portal'> Client Portal </div>
  
    <div id='company_name'>
        {client_object.company_info.company_name}
    </div>
    <div id='user_name'>
        <!-- to be logged in user? not sure how I want to handle this yet.. -->
         {client_object.company_info.owner_name}
    </div>


    <div id='client_links' >
<!-- 
        <div class:active={active_view=='home'} class='links_group' id='home' > Home </div>
        <div class:active={active_view=='profile'} class='links_group' id='profile' > Profile </div>
        <div class:active={active_view=='billing'} class='links_group' id='billing'> Billing </div>
        <div class:active={active_view=='service_log'} class='links_group' id='service_log' > Service Log </div>
 -->

    </div>


</div>


<style>

#client_nav_layout {
    background-color: var(--box-color);
    width: 20vw;
    margin: 1vh 1vw;
    border-radius: 1vw;
    box-shadow: var(--box-shadow);
    display: flex;
    flex-direction: column;
    align-items: center;
}

#logo_img {
    width: 6vw;
    margin-top: 2vw;
}
#client_portal {
    font-family: openSans-lightitalic;
    font-size: .9vw;

}


#company_name {
    font-family: openSans-medium;
    font-size: 2vw;
    text-align: center;
    margin-top: 3vw;
}
#user_name {
    font-family: openSans-light;
    font-size: 0.8vw;
}


#client_links{
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    justify-content: flex-start;
    text-align: center;
    margin-top: 3vw;
}
.links_group {
    font-family: openSans-light;
    font-size: 1vw;
    margin: 1vw 0;
    user-select: none;
    cursor: pointer;
}
.links_group:hover {
    text-decoration: underline;
}
.links_group.active {
    text-decoration: underline;
}

@media only screen and (max-width: 615px) {

	}
</style>