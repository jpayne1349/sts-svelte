<script>
	import { loadStripe } from '@stripe/stripe-js';
	import { Elements, PaymentElement } from 'svelte-stripe';
	import { fade } from 'svelte/transition';
	import { onMount, getContext, createEventDispatcher } from 'svelte';
	import { PUBLIC_STRIPE_TEST_KEY } from '$env/static/public';
	import EditInfoButton from '../EditInfoButton.svelte';
	import SaveEditButton from '../SaveEditButton.svelte';
	import PaymentCard from './PaymentCard.svelte';
	import { doc, updateDoc, collection, addDoc, arrayUnion } from 'firebase/firestore';

	let session_store = getContext('session_store');
	let session_data = {};
	let show_new_card_container = false;
	let elements;
	let processing = false;
	let canceling = false;

	let unsubscribe = session_store.subscribe((data) => {
		session_data = data;
	});

	let payment_method_error = 'Test Error Message';
	let show_error = false;

	let stripe = null;

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_TEST_KEY);
	});

	function displayError(msg) {
		payment_method_error = msg;
		show_error = true;
		setTimeout(() => {
			show_error = false;
		}, 5000);
	}

	async function addPaymentMethod() {
		if (session_data.company.billing.status.customer) {
			// submit fetch to initiate setupIntent " pass the current company/customer id"
			let server_response = await fetch('/client/stripe/setupIntent', {
				method: 'POST',
				body: JSON.stringify({ cuid: session_data.user.cuid }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			let responseJson = await server_response.json();

			if (responseJson.error) {
				displayError('Server Error');
				return;
			}

			// storing locally in a component wide object
			session_data.company.billing.intent_cs = responseJson.cs;

			show_new_card_container = true;
		} else {
			// saved data indicates customer setup is not complete
			displayError('Complete Billing Information');
		}
	}

	// this needs to make a server request similar to addpaymentmethod
	async function cancelSetupIntent() {
		canceling = true;

		let server_response = await fetch('/client/stripe/cancelIntent', {
			method: 'POST',
			body: JSON.stringify({ intent_cs: session_data.company.billing.intent_cs }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		let responseJson = await server_response.json();

		console.log(responseJson);

		displayError('Canceling Card Addition');

		if (server_response) {
			session_data.company.billing.intent_cs = '';
			show_new_card_container = false;
			canceling = false;
		}
	}

	async function confirmSetupIntent() {
		processing = true;

		try {
			const saveAttempt = await stripe.confirmSetup({
				elements,
				confirmParams: {
					return_url: 'http://192.168.1.25:5173/client/card-setup-complete'
				},
				redirect: 'if_required'
			});

			if (saveAttempt.error) {
				processing = false;
				return;
			}

			let result = saveAttempt.setupIntent;

			switch (result.status) {
				case 'succeeded': {
					session_data.company.billing.intent_cs = null;
					show_new_card_container = false;

					let new_payment_method_id = result.payment_method;

                    storeNewPaymentMethod(new_payment_method_id);

					break;
				}

				case 'processing': {
					show_new_card_container = false;

					// TODO: vvv
					// add new card component and put a pending tag on it.

					break;
				}

				case 'requires_payment_method': {
					displayError('Failed to process payment details');
					// Redirect your user back to your payment page to attempt collecting
					// payment again

					break;
				}
			}

			processing = false;
		} catch (e) {
			console.log('ERROR CONFIRMING CARD', e);
			displayError('Card Error: ' + e.code);
			return;
		}
	}

	async function storeNewPaymentMethod(pm_id) {
		// used for testing
		//pm_id = 'pm_1LxbK1LLMTpPeabJjJZWKqsN';

		let server_response = await fetch('/client/stripe/addPaymentMethod', {
			method: 'POST',
			body: JSON.stringify({ cuid: session_data.user.cuid, pm_id: pm_id }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		let responseJson = await server_response.json();

        console.log(responseJson);

		if (!responseJson.error) {
			

			let new_payment_method = {
				id: responseJson.pm_id,
				type: responseJson.type,
				last_four: responseJson.last_four,
				default: responseJson.default
			};

			let rebuild_array = [];
            let previous_default;

			rebuild_array.push(new_payment_method);

            for(let i=0; i<session_data.company.billing.payment_methods.length; i++) {
                let pm = session_data.company.billing.payment_methods[i];
                
                if (pm.default) {
					pm.default = false;
					rebuild_array.push(pm);
                    previous_default = i;
				} else {
					rebuild_array.push(pm);
				}

            }
			
			console.log(rebuild_array);

			const companyDocRef = doc(session_data.firebaseDb, 'client-company', session_data.user.cuid);

			try {
				const updatedCompany = await updateDoc(companyDocRef, {
					'billing.payment_methods': rebuild_array,
                    'billing.status.payment_method':true,
                    'billing.status.message':'Pending Subscription'
				});
			} catch (e) {
				console.log(e);
			}

			session_store.update((existing_data) => {
                
                existing_data.company.billing.payment_methods[previous_default].default =false;
                existing_data.company.billing.payment_methods.push(new_payment_method);
                existing_data.company.billing.status.payment_method = true;
                existing_data.company.billing.status.message = "Pending Subscription";

				return existing_data;
			});
		}
	}
</script>

<div id="payment-methods-container">
	<div id="payment-error" class:show={show_error}>{payment_method_error}</div>
	<div id="title">Payment Methods</div>
    
	{#if session_data}
		{#each session_data.company.billing.payment_methods as payment_method}
			<PaymentCard {payment_method} />
		{/each}
	{/if}

    	<button id="new-payment-method" on:click={addPaymentMethod} class:open={show_new_card_container}>
		Add
	</button>
</div>

{#if show_new_card_container}
	<div id="card-input-container">
		<Elements {stripe} clientSecret={session_data.company.billing.intent_cs} bind:elements>
			<PaymentElement />
		</Elements>

		<div id="button-container" transition:fade={{ delay: 1000 }}>
			<button id="cancel-intent" class="button" on:click={cancelSetupIntent}>
				<div id="spinner" class:active={canceling} />
				{#if !canceling}
					Cancel
				{/if}
			</button>
			<button id="submit" class="button" on:click={confirmSetupIntent}>
				<div id="spinner" class:active={processing} />
				{#if !processing}
					Save
				{/if}
			</button>
		</div>
	</div>
{/if}

<!-- could create the 'add new card inputs container out here? and lump it all on a flex to dispay side by side-->
<style>
	#payment-methods-container {
		z-index: 5;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	#title {
		font-family: openSans-boldItalic;
		color: #394b67;
		font-size: 1.1vw;
		margin-bottom: 5px;
	}
	#new-payment-method {
		width: 10vw;
		background-color: #3c7040be;
		border-radius: 10px;
		font-family: openSans-semibold;
		color: white;
		font-size: 0.8vw;
		height: 2.5vh;
		cursor: pointer;
		user-select: none;
		box-shadow: 0 1px 2px rgb(45, 45, 45);
		user-select: none;
		transition: all 0.5s;
		position: relative;
	}
	#new-payment-method:hover {
		background-color: #3c7040cf;
	}
	#new-payment-method.open {
		background-color: #3c704053;
		pointer-events: none;
		box-shadow: 0 0px 0px rgb(45, 45, 45);
	}
	#payment-error {
		font-family: openSans-semibold;
		font-size: 0.7vw;
		text-align: center;
		background-color: #ad914b;
		opacity: 0;
		user-select: none;
		transition: 0.5s;
		margin-bottom: 5px;
		color: white;
		padding: 3px 10px;
		border-radius: 15px;
		position: absolute;
		top: -1.2vw;
	}

	#payment-error.show {
		opacity: 1;
	}
	#card-input-container {
		position: absolute;
		left: 28vw;
		top: 10vh;
		width: 18vw;
		padding: 15px;
		box-shadow: 0px 1px 3px grey;
		background-color: rgb(254, 254, 254);
		border-radius: 15px;
	}
	#button-container {
		display: flex;
		justify-content: space-around;
		margin-top: 1.5vh;
	}
	.button {
		width: 7vw;
		height: 2.5vh;
		line-height: 2.5vh;
		box-shadow: 0px 1px 3px grey;
		border-radius: 10px;
		font-family: openSans-semibold;
		text-align: center;
		user-select: none;
		cursor: pointer;
		color: white;
		transition: all 0.2s;
		position: relative;
	}
	#submit {
		background-color: #3c7040;
	}
	#submit:hover {
		background-color: #336537;
	}
	#cancel-intent {
		background-color: #70423c;
	}
	#cancel-intent:hover {
		background-color: #643933;
	}
	#spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid white;
		border-right: 2px solid transparent;
		width: 1vw;
		height: 1vw;
		top: 0.4vw;
		left: 3vw;
		animation-name: s-glWFwOjWat37-spinning;
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
</style>
