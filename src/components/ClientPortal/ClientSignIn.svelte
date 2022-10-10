<script>


import StyledInput from "./StyledInput.svelte";

let username_input;


</script>

<div id="sign-in-container">
	
    <div class="input-group">
		<div id="username-label" class="label">Username</div>
		<StyledInput id={'username-input'} bind:input_value={username_input} />
	</div>
    
    <div class="input-group">
		<div id="password-label" class="label">Password</div>
		<input id='password-input' type='password' />
	</div>

    <div id='email-password-signin'>
       <div id='button' >Sign In</div>
    </div>

    <div id='google-signin' ></div>

    <div id='facebook-signin'></div>

</div>

<style>

    #sign-in-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10vh;
    }   
    .input-group {
            margin-bottom: 2vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 4vw;
    }   
    .label {
        font-family: openSans-light;
        font-size: 1.2vw;
        margin-left: 5px;
    }

    #email-password-signin {
        width: 100%;
        padding: 0 4vw;
        display: flex;
        justify-content: center;
        margin-top: 1vw;
    }
    #button {
        width: 100%;
        font-size: 1.1vw;
        line-height: 1.8vw;
        text-align: center;
        font-family: openSans-semiBold;
        color: white;
        background-color: #526889;
        border-radius: 5px;
        height: 1.8vw;
        box-shadow: 0px 1px 2px #464d5b;
        transition: all 0.5s;
        cursor:pointer;
        user-select: none;
    }
    #button:hover {
        background-color: #3C4F70;
    }
        input {
        border: none;
        background-color: rgb(230, 230, 230);
        padding: 0 5px;
        height: 1.8vw;
        border-radius: 8px;
        font-size: 1vw; 
        border: 1px solid rgb(193, 193, 193);
        transition: all 0.5s;
        font-family: openSans-light;
        box-shadow: 0px 1px 2px rgb(201, 201, 201);
    }
    input:hover {
        box-shadow: 0px 1px 2px rgb(164, 164, 164);
    }
    input:focus {
        outline: none;
    }


</style>
