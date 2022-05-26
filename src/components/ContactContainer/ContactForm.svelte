<script>
	import ButtonContainer from './ButtonContainer.svelte';
	import ContactPopup from './ContactPopup.svelte';

	import { getContext } from 'svelte';
	import { addDoc, collection, Timestamp } from 'firebase/firestore';

	let from_value, subject_value, body_value;
	$: requiredValues = false;

	let sendingForm = false;
	let formStatus = 'idle'; // idle, is sending, has sent, has failed
	let statusList = ['idle', 'sending', 'sent', 'failed'];
	let pos = 0;

	const fbObject = getContext('fbObject');

	$: formFilled(from_value, body_value);

	// checks message type and trys db entry
	async function handleMessage(event) {
		let type = event.detail.type;

		if (type == 'clear') {
			clearForm();
		}

		// document addition to firestore
		if (type == 'send') {
			try {
				// show the sending message
				formStatus = 'sending';

				// check for undefined subject
				if (subject_value == undefined) {
					subject_value = 'undefined';
				}

				// async db addition
				const docRef = await addDoc(collection(fbObject.db, 'contact-forms'), {
					to: ['james@southtexas.software'],
					template: {
						name: 'contact-form-submission',
						data: {
							from: from_value,
							subject: subject_value,
							body: body_value,
							timestamp: Timestamp.fromDate(new Date())
						}
					}
				});

				// show the sent message, then clear form
				formStatus = 'sent';
				clearForm();

				// remove popup and filter from form
				setTimeout(() => {
					formStatus = 'idle';
				}, 1500);
			} catch (e) {
				// TODO: show the failed message
				formStatus = 'failed';
				console.error(e);
			}
		}
	}

	function clearForm() {
		from_value = '';
		subject_value = '';
		body_value = '';
	}

	// updates the requireValues bool based on input
	function formFilled(from, body) {
		if (from == '' || body == '') {
			requiredValues = false;
			return;
		}
		if (from != undefined && body != undefined) {
			requiredValues = true;
			return;
		}

		requiredValues = false;
	}

	// used for development only
	function changeStatus() {
		pos == 3 ? (pos = 0) : (pos += 1);
		formStatus = statusList[pos];
		console.log(formStatus);
	}

	// used in error pages..
	export let autoSubject;
	if (autoSubject != 'none') {
		subject_value = autoSubject;
	}

	// *** Intersection Observer boilerplate ***
	// css needed:  transform: translateY(4vh);
	//				opacity: 0;
	//				transition: all 1s;

	//				transform: translateY(0);
	//				opacity: 1;

	import { onMount } from 'svelte';

	let component; // bind:this={component}
	let intersected; //class:show={intersected}

	onMount(setupObserver);

	// threshold = amount of screen crossing element top
	let intersectOptions = {
		threshold: 0.15
	};

	function setupObserver() {
		let observer = new IntersectionObserver(intersectCallback, intersectOptions);
		observer.observe(component);
	}

	// runs every time the intersection happens
	function intersectCallback(observerEvent) {
		if (observerEvent[0].isIntersecting) {
			intersected ? '' : (intersected = true);
		}
	}

	// *** end of intersection observer  ***
</script>

<!-- <button on:click={changeStatus}> Change Status </button> -->

<div id="outer-container" bind:this={component} class:show={intersected}>
	<div id="filter" class:active={formStatus != 'idle'}>
		<div class="small-row" id="to-line">
			<div class="row-label">To:</div>
			<div id="email">development@southtexas.software</div>
		</div>
		<div class="small-row" id="from-line">
			<label for="from-input" class="row-label">From:</label>
			<input bind:value={from_value} id="from-input" class="small-input" type="email" />
		</div>
		<div class="small-row" id="from-line">
			<label for="subject-input" class="row-label">Subject:</label>
			<input bind:value={subject_value} class="small-input" id="subject-input" type="text" />
			<div id="button-container">
				<ButtonContainer on:message={handleMessage} validation={requiredValues} />
			</div>
		</div>

		<div id="form-body">
			<label for="form-textarea"></label>
			<textarea bind:value={body_value} id="form-textarea" />
		</div>
	</div>

	<ContactPopup status={formStatus} />
</div>

<style>
	#outer-container {
		background: #283954;
		box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.49);
		border-radius: 15px;
		width: 80vw;
		height: 50vh;
		margin-top: 1vh;
		padding-top: 1vw;
		position: relative;
		opacity: 0;
		transition: all 1s;
	}
	#outer-container.show {
		opacity: 1;
	}
	#filter {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	#filter.active {
		filter: blur(1px);
		pointer-events: none;
	}
	.small-row {
		width: 78vw;
		margin-left: 1vw;
		display: flex;
		align-items: center;
		height: 5vh;
	}
	#email {
		font-family: openSans-lightitalic;
		font-size: 1.4vw;
	}
	.row-label {
		font-family: openSans-medium;
		font-size: 1.5vw;
		width: 7vw;
		margin-right: 1vw;
	}
	.small-input {
		outline: none;
		border: none;
		height: 3vh;
		width: 23vw;
		background-color: #d8d8d830;
		background-image: none;
		border-radius: 1vh;
		color: #bbbec5;
		padding-left: 10px;
		font-family: openSans-lightitalic;
		font-size: 1.2vw;
		transform: translateX(-10px);
	}
	#button-container {
		display: flex;
		margin-left: auto;
	}
	#subject-input {
		font-family: openSans-light;
	}
	#form-textarea {
		background-color: #d8d8d830;
		outline: none;
		background-image: none;
		border: none;
		border-radius: 1vh;
		margin-left: 1vw;
		margin-top: 1vh;
		width: 78vw;
		height: 31vh;
		padding: 1vw;
		color: #bbbec5;
		font-family: openSans-light;
		font-size: 1.3vw;
		resize: none;
	}
	@media only screen and (max-width: 615px) {
		#outer-container {
			width: 92vw;
			height: 60vh;
			padding-top: 3vw;
			position: relative;
		}
		.small-row {
			width: 90vw;
			height: 4vh;
			margin-left: 3vw;
		}
		.row-label {
			font-size: 4vw;
			width: 18vw;
		}
		#email {
			font-size: 4vw;
		}
		.small-input {
			width: 64vw;
			font-size: 3.5vw;
		}
		#subject-input {
			width: 64vw;
		}
		#form-textarea {
			width: 86vw;
			margin-left: 3vw;
			font-size: 3.5vw;
			height: 38vh;
		}
		#button-container {
			position: absolute;
			bottom: 2vh;
			left: 3vw;
			width: 86vw;
			display: flex;
			justify-content: space-between;
		}
	}
</style>
