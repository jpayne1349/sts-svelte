<script>
	import StyledInput from '../StyledInput.svelte';
	import ShowHideIcon from './ShowHideIcon.svelte';

	let create_account_form = {
		name: '',
		username: '',
		username_valid: false,
		email: '',
		password: '',
		password_valid: false,
		password_conf: false
	};

	let hide_password = true;
	let pass_type = 'password';
	let hide_pass_conf = true;
	let pass_conf_type = 'password';

	let username_typing = false;
	let password_typing = false;
	let pass_conf_typing = false;

	function hasNumber(myString) {
		return /\d/.test(myString);
	}

	// contains uppercase, lowercase
	// special character & numeric value
	function validate_password_string(str) {
		var pattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$');

		if (pattern.test(str)) {
			return true;
		}

		return false;
	}

	$: {
		if (create_account_form.username.length > 0 && create_account_form.username.length < 6) {
			username_typing = true;
			create_account_form.username_valid = false;
		} else if (create_account_form.username.length >= 6) {
			create_account_form.username_valid = true;
			username_typing = false;
			console.log('greater than 6');
		} else {
			username_typing = false;
			create_account_form.username_valid = false;
		}
	}

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
        if(pass_type == 'password') {
            pass_type = 'text';
        } else {
            pass_type = 'password';
        }
    }

	function handlePassConf(event) {
        // only have to check if it matches, if the pass has passed the handle above
        if(event.target.value.length > 0) {
            pass_conf_typing = true;
            if(create_account_form.password_valid == true) {
                if(event.target.value == create_account_form.password) {
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
        if(pass_conf_type == 'password') {
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
			<input id='name-input' bind:value={create_account_form.name} />
		</div>

		<div class="input-row">
			<div class="input-label" id="email">Email:</div>
			<input type="email" id="email-input" bind:value={create_account_form.email} />
		</div>

		<div class="input-row" id="usr-row">
			<div class="input-label" id="username">Username:</div>
			<input id='username-input' bind:value={create_account_form.username} />
			<div class="validation-icons">
				<div id="spinner" class:active={username_typing} />
				<div id="checkmark" class:active={create_account_form.username_valid} />
			</div>
			<div id="pass-req">min: 6 characters</div>
		</div>

		<div class="input-row" id="pass-row">
			<div class="input-label" id="pass">Password:</div>
			<input on:input={handlePass} type={pass_type} id="pass-input" />
			<div on:click={showHidePass} class="show-hide"><ShowHideIcon hidden_bool={hide_password} /></div>
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
			<div on:click={showHidePassConf} class="show-hide"><ShowHideIcon hidden_bool={hide_pass_conf} /></div>
			<div class="validation-icons">
				<div id="spinner" class:active={pass_conf_typing}/>
				<div id="checkmark" class:active={create_account_form.password_conf}/>
			</div>
		</div>

		<div id="create-acct">
			<div id="button">Create Account</div>
		</div>
	</div>

	<div class="col security">
		<div id="security-info">
			As always, we recommend altering usernames and passwords between sites/accounts as good practice. <br> <br> All our sites are <img
				id="lock-icon"
				src="lock_svg.svg"
				alt="TLS Lock Icon"
			/>TLS encrypted--secure from you to our server--and all sensitive stored data is salted &
			hashed cryptographically with industry leading practices.
		</div>
	</div>
</div>

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
	#pass-conf-row,
	#usr-row {
		position: relative;
	}
	.validation-icons {
		position: absolute;
	}
	#pass-req {
		position: absolute;
		left: 0;
		top: 1.9vw;
		width: 20vw;
		font-family: openSans-light;
		font-size: 0.5vw;
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
		justify-content: center;
		margin-top: 2vh;
	}
	#button {
		width: 50%;
		font-size: 1vw;
		line-height: 1.8vw;
		text-align: center;
		font-family: openSans-semiBold;
		color: white;
		background-color: #3c704081;
		border-radius: 5px;
		height: 1.8vw;
		box-shadow: 0px 1px 2px #464d5b;
		transition: all 0.5s;
		pointer-events: none;
		user-select: none;
	}
	#button.available {
		background-color: #3c7040;
		cursor: pointer;
		pointer-events: all;
	}
	#button.available:hover {
		background-color: #356739;
	}
</style>
