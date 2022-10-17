<!-- BUG: confirm password, if you get it right but type one extra character, the loader shows back up... -->

<script>
	import StyledInput from '../StyledInput.svelte';
	import ShowHideIcon from './ShowHideIcon.svelte';
    import { fly } from 'svelte/transition';
    import { createEventDispatcher, getContext } from 'svelte';
    import LoadingEllipse from './LoadingEllipse.svelte';
    import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

    let dispatch = createEventDispatcher();

	export let company_data;

	let session_store = getContext('session_store');

    let session_data = {};

    session_store.subscribe((data) => {
        session_data = data;
    });


	let create_account_form = {
		name: '',
		email: '',
		password: '',
		password_valid: false,
		password_conf: false
	};

	let hide_password = true;
	let pass_type = 'password';
	let hide_pass_conf = true;
	let pass_conf_type = 'password';
    let form_error_show = false;
    let form_error_message = '';

	let password_typing = false;
	let pass_conf_typing = false;
    let creating_account = false;

    
    function handleCreateAccount() {
        form_error_show = false;

        // check data object and return error message
        if(!formFilledComplete()) {
            form_error_message = 'Form Incomplete';
            form_error_show = true;
            return;
        } 
        
        // form filled, set state to show loader
        creating_account = true;


        let new_user_email = create_account_form.email;
        let new_user_password = create_account_form.password;

        try {

			// before we do this, we can set a global bool to delay the auth state change listener.
			session_data.creating_new_user = true;
			session_store.update((existing_data)=>{existing_data.creating_new_user = true; return existing_data;});

            const auth = getAuth();
		    createUserWithEmailAndPassword(auth, new_user_email, new_user_password)
			.then((userCredential) => {

				// Signed in
				const user = userCredential.user;
                user.displayName = create_account_form.name;

                // dispatch an event with the new user object, the welcome window can switch to a new page
                dispatch('account_created', user);

			})
			.catch((error) => {
                // Handle firebase errors
				const errorCode = error.code;
                if(errorCode == 'auth/email-already-in-use') {
                    creating_account = false;
                    form_error_message = 'Email already in use';
                    form_error_show = true;
                    return;
                }
                if(errorCode == 'auth/invalid-email') {
                    creating_account = false;
                    form_error_message = 'Email not valid';
                    form_error_show = true;
                    return;
                }

                creating_account = false;
                form_error_message = 'Something went wrong! Please contact us if you are having trouble.';
                form_error_show = true;
                console.error(error);
                return;

			});

        }catch(error) {
            creating_account = false;
            form_error_message = 'Something went wrong! Please contact us if you are having trouble.';
            form_error_show = true;
            console.error(error);
            return;
        }

	}

       

    function formFilledComplete() {
        if(create_account_form.name == '') return false;
        if(create_account_form.email == '') return false;
        if(create_account_form.password_valid == false) return false;
        if(create_account_form.password_conf == false) return false;
    
        return true;
    }

	function hasNumber(myString) {
		return /\d/.test(myString);
	}

    function validate_password_string(str) {
		var pattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$');

		if (pattern.test(str)) {
			return true;
		}

		return false;
	}


    // password requirement validation and animation triggers
	function handlePass(event) {
		if (event.target.value.length > 0 && event.target.value.length < 8) {
			create_account_form.password_valid = false;
			password_typing = true;
		} else if (event.target.value.length >= 8) {
			// length verified, now check contents
			if (validate_password_string(event.target.value)) {
				create_account_form.password_valid = true;
				password_typing = false;
				create_account_form.password = event.target.value;
			}
		} else {
			create_account_form.password_valid = false;
			password_typing = false;
		}
	}

	function showHidePass() {
		hide_password = !hide_password;
		if (pass_type == 'password') {
			pass_type = 'text';
		} else {
			pass_type = 'password';
		}
	}

	function handlePassConf(event) {
		// only have to check if it matches, if the pass has passed the handle above
		if (event.target.value.length > 0) {
			pass_conf_typing = true;
			if (create_account_form.password_valid == true) {
				if (event.target.value == create_account_form.password) {
					pass_conf_typing = false;
					create_account_form.password_conf = true;
				}
			}
		} else {
			pass_conf_typing = false;
			create_account_form.password_conf = false;
		}
	}

	function showHidePassConf() {
		hide_pass_conf = !hide_pass_conf;
		if (pass_conf_type == 'password') {
			pass_conf_type = 'text';
		} else {
			pass_conf_type = 'password';
		}
	}


</script>

<div id="center-vert">
	<div class="col">
		<div class="input-row">
			<div class="input-label" id="name">Name:</div>
			<input id="name-input" bind:value={create_account_form.name} />
		</div>

		<div class="input-row">
			<div class="input-label" id="email">Email:</div>
			<input type="email" id="email-input" bind:value={create_account_form.email} />
		</div>

		<div class="input-row" id="pass-row">
			<div class="input-label" id="pass">Password:</div>
			<input on:input={handlePass} type={pass_type} id="pass-input" />
			<button on:click={showHidePass} class="show-hide">
				<ShowHideIcon hidden_bool={hide_password} />
			</button>
			<div class="validation-icons">
				<div id="spinner" class:active={password_typing} />
				<div id="checkmark" class:active={create_account_form.password_valid} />
			</div>
			<div id="pass-req">
				min: 1 uppercase | 1 lowercase | 1 number | 1 special character | length > 7
			</div>
		</div>

		<div class="input-row" id="pass-conf-row">
			<div class="input-label" id="pass-conf">Confirm:</div>
			<input on:input={handlePassConf} type={pass_conf_type} id="pass-conf-input" />
			<button on:click={showHidePassConf} class="show-hide">
				<ShowHideIcon hidden_bool={hide_pass_conf} />
			</button>
			<div class="validation-icons">
				<div id="spinner" class:active={pass_conf_typing} />
				<div id="checkmark" class:active={create_account_form.password_conf} />
			</div>
		</div>

		<div id="create-acct">
			<button id="button" on:click={handleCreateAccount}>Create Account</button>
			<div id="button-loader" class:active={creating_account}><LoadingEllipse /></div>
			{#if form_error_show}
				<div id="button-message" transition:fly={{ delay: 0, duration: 200, x: 0, y: 10, opacity: 0 }}>
					{form_error_message}
				</div>
			{/if}
		</div>
	</div>

	<div class="col security">
		<div id="security-info">
			As always, we recommend altering usernames and passwords between sites/accounts as good
			practice. <br /> <br /> All our sites are
			<img id="lock-icon" src="lock_svg.svg" alt="TLS Lock Icon" />TLS encrypted--secure from you to
			our server--and all sensitive stored data is salted & hashed cryptographically with industry
			leading practices.
		</div>
	</div>
</div>

{#if company_data.company_name_entered}
	<div id="company-line">
		<div id="company-label">Company:</div>
		<div id="company-variable">{company_data.company_name}</div>
	</div>
{/if}

<style>
	#center-vert {
		display: flex;
		align-items: center;

		flex-grow: 4;
		width: 65%;
	}
	.col {
		display: flex;
		flex-direction: column;
		flex-grow: 3;
		align-items: center;
	}
	.col.security {
		font-family: openSans-light;
		font-size: 1vw;
		align-self: center;
		margin-bottom: 8vh;
	}
	#security-info {
		padding-left: 5vw;
		text-align: center;
	}
	#lock-icon {
		height: 0.6vw;
		transform: translate(0.1vw, 0.05vw);
	}

	.input-row {
		display: flex;
		width: 24vw;
		justify-content: space-between;
		margin-bottom: 2.4vh;
	}
	.input-label {
		font-family: openSans-lightitalic;
		font-size: 1.3vw;
		user-select: none;
	}

	#pass-row,
	#pass-conf-row {
		position: relative;
	}
	.validation-icons {
		position: absolute;
	}
	#pass-req {
		position: absolute;
		left: 0;
		top: 1.9vw;

		font-family: openSans-light;
		font-size: 0.6vw;
		bottom: 0;
		user-select: none;
	}
	.show-hide {
		position: absolute;
		left: 101%;
		cursor: pointer;
		user-select: none;
		display: flex;
		height: 100%;
		align-items: center;
	}

	input {
		border: none;
		background-color: rgb(230, 230, 230);
		padding: 0 5px;
		height: 1.8vw;
		min-width: 15vw;
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
		box-shadow: 0px 1px 2px rgb(164, 164, 164);
	}

	#spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid grey;
		border-right: 2px solid transparent;
		width: 1vw;
		height: 1vw;
		top: 0.5vw;
		right: 0.5vw;
		animation-name: spinning;
		animation-duration: 0.8s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		position: absolute;
		opacity: 0;
		transition: all 0.2s;
	}
	#spinner.active {
		opacity: 1;
	}
	@keyframes spinning {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
	#checkmark {
		content: '';
		height: 0.9vw;
		width: 0.4vw;
		position: absolute;
		top: 0.5vw;
		right: 0.8vw;
		border-right: 0.2vw solid green;
		border-bottom: 0.2vw solid green;
		transform: rotate(45deg);
		opacity: 0;
		transition: all 0.2s;
	}
	#checkmark.active {
		opacity: 1;
	}

	#create-acct {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 2vh;
		position: relative;
	}
	#button {
		width: 50%;
		font-size: 1vw;
		line-height: 1.8vw;
		text-align: center;
		font-family: openSans-semiBold;
		color: white;
		background-color: #3c7040;
		border-radius: 5px;
		height: 1.8vw;
		box-shadow: 0px 1px 2px #464d5b;
		transition: all 0.5s;
		cursor: pointer;
		user-select: none;
	}
	#button:hover {
		background-color: #356739;
	}
	#button-message {
		position: absolute;
		top: 1.8vw;
		font-family: openSans-semibold;
		font-size: 0.8vw;
		color: rgb(142, 35, 35);
		margin-top: 4px;
        text-align: center;
	}
	#button-loader {
		user-select: none;
		pointer-events: none;
		opacity: 0;
		transition: 0.2s all;
	}
	#button-loader.active {
		opacity: 1;
	}
	#company-line {
		display: flex;
		justify-content: center;
		margin-top: auto;
		margin-bottom: 1vh;
	}
	#company-label {
		font-family: openSans-lightitalic;
		font-size: 1.4vw;
	}
	#company-variable {
		font-family: openSans-regular;
		font-size: 1.4vw;
		margin-left: 0.5vw;
	}


</style>
