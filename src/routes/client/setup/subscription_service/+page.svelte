<script>
	import ServicePlan from './ServicePlan.svelte';
	import PlanOption from './PlanOption.svelte';
	import { subscriptionSetupStore, sessionStore, alertStore, fbStore } from '../../stores';
	import { fly } from 'svelte/transition';
	import { PaymentElement } from 'svelte-stripe';
	import { updateDoc, doc, arrayUnion, Timestamp } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	// this is the structure, and holds the dynamic values, this will get submitted for interpretation to the database
	subscriptionSetupStore.set({
		cuid: $sessionStore.cuid,
		quoteId: '',
		web_dev: {
			selected: false,
			monthly: 0,
			build: 0,
			basic_fixed: {
				selected: false,
				value: 30,
				email_notifications: {
					selected: false,
					value: 5
				},
				custom_email: {
					selected: false,
					value: 15
				}
			},
			advanced_fixed: {
				selected: false,
				value: 300,
				payment_processing: {
					selected: false,
					value: 200
				}
			},
			advanced_value: {
				selected: false,
				value: 100
			}
		},
		software_sol: {
			selected: false,
			monthly: 0,
			build: 0,
			less_than_eight: {
				selected: false,
				value: 50
			},
			greater_than_eight: {
				selected: false,
				value: 30
			},
			description: ''
		}
	});

	let show_software_sol_description = false;

	let buildFees = subscriptionSetupStore.subscribe((store) => {
		store.web_dev.build = store.web_dev.monthly * 10;

		// manages that outer boolean for the web dev group
		if (store.web_dev.monthly > 0) {
			store.web_dev.selected = true;
		} else {
			store.web_dev.selected = false;
		}

		// manages outer boolean and the display of the description input box.
		if (
			store.software_sol.less_than_eight.selected ||
			store.software_sol.greater_than_eight.selected
		) {
			show_software_sol_description = true;
			store.software_sol.selected = true;
		} else {
			show_software_sol_description = false;
			store.software_sol.selected = false;
		}
	});

	let submitting_form = false;
	let settingUpLater = false;
	

	// we will pass the whole object to the server to make a stripe quote, and notify the dev team, etc.
	async function setupSubscription() {
		submitting_form = true;

		let server_response = await fetch('/client/api/stripe/createQuote', {
			method: 'POST',
			body: JSON.stringify($subscriptionSetupStore),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		let responseJson = await server_response.json();

		if (responseJson.error) {
			alertStore.set({
				message: responseJson.code,
				show: true,
				error: true
			});

			let sendEmail = fetch('/client/api/generateErrorEmail', {
				method: 'POST',
				body: JSON.stringify({
					title: 'Error in Stripe createQuote',
					account: $sessionStore.email,
					details: responseJson.code
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			submitting_form = false;
			return;
		}

		let serviceUpdateEvent = {
			time: Timestamp.now(),
			description: $sessionStore.email + ' submitted services form.',
			type: 'service'
		};

		// update firebase account setup stuff, also we want to write to firebase the subscriptionSetupStore..
		let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);
		if ($sessionStore.account_setup.subscription_service.completed) {
			let updatedUserDoc = await updateDoc(userDocReference, {
				service_forms: arrayUnion(responseJson.payload),
				'navigation.returnBack': true,
				'navigation.returnTo': '/client/portal/billing',
				'service_log.events': arrayUnion(serviceUpdateEvent)
			});
		} else {
			let updatedUserDoc = await updateDoc(userDocReference, {
				'account_setup.subscription_service.seen': true,
				'account_setup.subscription_service.completed': true,
				service_forms: arrayUnion(responseJson.payload),
				'service_log.events': arrayUnion(serviceUpdateEvent)
			});
		}

		let nextpage = await goto('/client/portal/overview');

		submitting_form = false;

		// goto next page
	}

	async function setUpLater() {
		settingUpLater = true;


		let userDocReference = doc($fbStore.db, 'client-portal-user', $sessionStore.uid);

		let updatedUserDoc = await updateDoc(userDocReference, {
			'account_setup.subscription_service.seen': true
		});

		let nextPage = await goto('/client/portal/overview');
	}
</script>

<div class="service-wrapper">
	<section class="container" id="subscription_service">
		<h2 class="container-title">Subscription / Service</h2>
		<p>
			Let's get started! Use the form below to select the services you are interested in.
			Monthly and build fees are *estimated based on the plans and features selected. Expect your
			quote/pricing to vary slightly if the work scope is more/less than outlined, we will follow up
			for more information. Thank you!
		</p>
	</section>

	<section class="container" id="service-options">
		<div class="service-container" id="web-development">
			<button class="service-header">
				<h4 class="service-title">Web Development</h4>
				<div class="prices-col">
					<p class="price-estimate">
						Build: $
						{#key $subscriptionSetupStore.web_dev.build}
							<span in:fly={{ y: -20 }} style="display:inline-block"
								>{$subscriptionSetupStore.web_dev.build}</span
							>
						{/key}
						USD
					</p>
					<p class="price-estimate">
						Monthly: $
						{#key $subscriptionSetupStore.web_dev.monthly}
							<span in:fly={{ y: -20 }} style="display:inline-block"
								>{$subscriptionSetupStore.web_dev.monthly}</span
							>
						{/key}
						USD
					</p>
				</div>
			</button>

			<!-- basic fixed service plan -->
			<ServicePlan
				on:clicked={(event) => {
					$subscriptionSetupStore.web_dev.basic_fixed.selected = event.detail;
					if (event.detail) {
						$subscriptionSetupStore.web_dev.monthly +=
							$subscriptionSetupStore.web_dev.basic_fixed.value;
					} else {
						$subscriptionSetupStore.web_dev.monthly -=
							$subscriptionSetupStore.web_dev.basic_fixed.value;
						if ($subscriptionSetupStore.web_dev.basic_fixed.email_notifications.selected) {
							$subscriptionSetupStore.web_dev.basic_fixed.email_notifications.selected = false;
							$subscriptionSetupStore.web_dev.monthly -=
								$subscriptionSetupStore.web_dev.basic_fixed.email_notifications.value;
						}
						if ($subscriptionSetupStore.web_dev.basic_fixed.custom_email.selected) {
							$subscriptionSetupStore.web_dev.basic_fixed.custom_email.selected = false;
							$subscriptionSetupStore.web_dev.monthly -=
								$subscriptionSetupStore.web_dev.basic_fixed.custom_email.value;
						}
					}
				}}
				price={$subscriptionSetupStore.web_dev.basic_fixed.value}
				title={'Basic - Fixed'}
				details={'Deployed static website, Secure server hosting, DNS management, Dependency updates, Uptime required maintenance'}
				value={false}
				hourly={0}
			/>

			<!-- Basic Fixed plan options inside -->
			{#if $subscriptionSetupStore.web_dev.basic_fixed.selected}
				<PlanOption
					on:clicked={(event) => {
						$subscriptionSetupStore.web_dev.basic_fixed.email_notifications.selected = event.detail;
						if (event.detail) {
							$subscriptionSetupStore.web_dev.monthly +=
								$subscriptionSetupStore.web_dev.basic_fixed.email_notifications.value;
						} else {
							$subscriptionSetupStore.web_dev.monthly -=
								$subscriptionSetupStore.web_dev.basic_fixed.email_notifications.value;
						}
					}}
					price={$subscriptionSetupStore.web_dev.basic_fixed.email_notifications.value}
					title={'Automated Email Notifications'}
					details={'Triggered by your site'}
					animation_delay={100}
				/>

				<PlanOption
					on:clicked={(event) => {
						$subscriptionSetupStore.web_dev.basic_fixed.custom_email.selected = event.detail;
						if (event.detail) {
							$subscriptionSetupStore.web_dev.monthly +=
								$subscriptionSetupStore.web_dev.basic_fixed.custom_email.value;
						} else {
							$subscriptionSetupStore.web_dev.monthly -=
								$subscriptionSetupStore.web_dev.basic_fixed.custom_email.value;
						}
					}}
					price={$subscriptionSetupStore.web_dev.basic_fixed.custom_email.value}
					title={'Custom Email Address'}
					details={'ex: name@yourwebsite.com'}
					animation_delay={200}
				/>
			{/if}

			<!-- advanced fixed service plan -->
			<ServicePlan
				on:clicked={(event) => {
					$subscriptionSetupStore.web_dev.advanced_fixed.selected = event.detail;
					if (event.detail) {
						$subscriptionSetupStore.web_dev.monthly +=
							$subscriptionSetupStore.web_dev.advanced_fixed.value;
					} else {
						$subscriptionSetupStore.web_dev.monthly -=
							$subscriptionSetupStore.web_dev.advanced_fixed.value;
						if ($subscriptionSetupStore.web_dev.advanced_fixed.payment_processing.selected) {
							$subscriptionSetupStore.web_dev.advanced_fixed.payment_processing.selected = false;
							$subscriptionSetupStore.web_dev.monthly -=
								$subscriptionSetupStore.web_dev.advanced_fixed.payment_processing.value;
						}
					}
				}}
				price={$subscriptionSetupStore.web_dev.advanced_fixed.value}
				title={'Advanced - Fixed'}
				details={'All basic options above, database creation/management, dynamic content such as products | posts | apps '}
				value={false}
				hourly={0}
			/>
			<!-- advanced fixed options -->
			{#if $subscriptionSetupStore.web_dev.advanced_fixed.selected}
				<PlanOption
					on:clicked={(event) => {
						$subscriptionSetupStore.web_dev.advanced_fixed.payment_processing.selected =
							event.detail;
						if (event.detail) {
							$subscriptionSetupStore.web_dev.monthly +=
								$subscriptionSetupStore.web_dev.advanced_fixed.payment_processing.value;
						} else {
							$subscriptionSetupStore.web_dev.monthly -=
								$subscriptionSetupStore.web_dev.advanced_fixed.payment_processing.value;
						}
					}}
					price={$subscriptionSetupStore.web_dev.advanced_fixed.payment_processing.value}
					title={'Payment Processing'}
					details={'Shopping carts, checkout pages, etc.'}
					animation_delay={100}
				/>
			{/if}

			<!-- advanced value service plan -->
			<ServicePlan
				on:clicked={(event) => {
					$subscriptionSetupStore.web_dev.advanced_value.selected = event.detail;
					if (event.detail) {
						$subscriptionSetupStore.web_dev.monthly +=
							$subscriptionSetupStore.web_dev.advanced_value.value;
					} else {
						$subscriptionSetupStore.web_dev.monthly -=
							$subscriptionSetupStore.web_dev.advanced_value.value;
					}
				}}
				price={$subscriptionSetupStore.web_dev.advanced_value.value}
				title={'Advanced - Value'}
				details={'For sites and apps that are designed to generate revenue. When you do well, so do we.'}
				value={true}
				hourly={0}
			/>
		</div>

		<div class="seperating-line" />

		<div class="service-container" id="software_sol">
			<button class="service-header">
				<h4 class="service-title">Software Solutions</h4>
				<div class="prices-col">
					<p class="price-estimate">
						Build: $
						{#key $subscriptionSetupStore.software_sol.build}
							<span in:fly={{ y: -20 }} style="display:inline-block"
								>{$subscriptionSetupStore.software_sol.build}</span
							>
						{/key}
						USD
					</p>
					<p class="price-estimate">
						Monthly: $
						{#key $subscriptionSetupStore.software_sol.monthly}
							<span in:fly={{ y: -20 }} style="display:inline-block"
								>{$subscriptionSetupStore.software_sol.monthly}</span
							>
						{/key}
						USD
					</p>
				</div>
			</button>

			<!-- 50 USD / hour -->
			<ServicePlan
				on:clicked={(event) => {
					$subscriptionSetupStore.software_sol.less_than_eight.selected = event.detail;
					if (event.detail) {
						$subscriptionSetupStore.software_sol.build += 250;
					} else {
						$subscriptionSetupStore.software_sol.build -= 250;
					}
				}}
				price={$subscriptionSetupStore.software_sol.less_than_eight.value}
				title={'$50 USD / Hour'}
				details={'Small scripts, consulting, or troubleshooting that is estimated to take 1 day or less'}
				value={false}
				hourly={'< 8 hours'}
			/>

			<ServicePlan
				on:clicked={(event) => {
					$subscriptionSetupStore.software_sol.greater_than_eight.selected = event.detail;
					if (event.detail) {
						$subscriptionSetupStore.software_sol.build += 500;
					} else {
						$subscriptionSetupStore.software_sol.build -= 500;
					}
				}}
				price={$subscriptionSetupStore.software_sol.greater_than_eight.value}
				title={'$30 USD / Hour'}
				details={'Larger projects involving research, development, and testing.'}
				value={false}
				hourly={'> 8 hours'}
			/>

			<!-- if plan selected, show description textarea -->
			{#if show_software_sol_description}
				<textarea
					class="software-sol-description"
					bind:value={$subscriptionSetupStore.software_sol.description}
					placeholder="Please provide a short description of the project."
					in:fly={{ y: -50 }}
				/>
			{/if}
		</div>

		<div class="seperating-line" />

		<div class="double-button-container">
			<button id="set-up-later" on:click|preventDefault={setUpLater}>
			{#if !settingUpLater}
					Set Up Later
				{:else}
					<span class="button-spinner" />
				{/if}
			</button>

			<button
				id="submit-sign-in"
				type="submit"
				for="sign-in-form"
				on:click|preventDefault={setupSubscription}
			>
				{#if !submitting_form}
					Submit
				{:else}
					<span class="button-spinner" />
				{/if}
			</button>
		</div>
	</section>
</div>

<style>
	#service-options {
		padding: 25px 0 25px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	p {
		font-family: openSans-semibold;
		font-size: 14px;
		color: var(--main);
		margin-bottom: 2vh;
	}
	.service-container {
		padding: 25px 50px;
		user-select: none;
		transition: all 0.5s;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.service-header {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		background-color: white;
		color: var(--main);
		height: 65px;
		cursor: pointer;
		box-shadow: none;
		margin-bottom: 15px;
	}
	.service-title {
		font-size: 16px;
		padding-right: 70px;
	}
	.prices-col {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-end;
		padding: 10px 0;
	}
	.price-estimate {
		font-family: openSans-regular;
		font-size: 12px;
		margin-bottom: 0;
	}
	.software-sol-description {
		width: 400px;
		min-height: 100px;
		font-family: openSans-regular;
		font-size: 14px;
		border: 1px solid var(--bar-color);
		border-radius: 15px;
		padding: 10px;
		outline: none;
		resize: none;
		box-shadow: var(--box-shadow);
	}
	.seperating-line {
		width: 420px;
		margin: 15px 0;
		border-bottom: 1px solid var(--bar-color);
	}

	.double-button-container {
		display: flex;
		width: 400px;
		justify-content: space-between;
		margin-top: 45px;
	}
	.double-button-container button {
		width: 45%;
		height: 35px;
		margin-bottom: 0;
	}
	#set-up-later {
		background-color: var(--button-light-blue);
	}
	.button-spinner {
		content: '';
		border-radius: 50%;
		border-top: 2px solid white;
		border-right: 2px solid transparent;
		width: 15px;
		height: 15px;
		animation-name: spinning;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
		opacity: 1;
		transition: all 0.2s;
	}

	@media only screen and (max-width: 500px) {
		.service-container {
			width: 80vw;
			padding: 5px 5px;
		}
		.service-title {
			font-family: openSans-semibold;
			font-size: 18px;
			padding-right: 0;
		}
		.seperating-line {
			width: 82vw;
		}
		.double-button-container {
			width: 80vw;
		}
		.software-sol-description {
			width: 76vw;
			font-size: 15px;
			-webkit-font-size: 14px;
		}
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
