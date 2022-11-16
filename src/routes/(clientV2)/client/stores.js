import { writable } from 'svelte/store';

export const alertStore = writable({
	show: false,
	message: '',
	error: false
});

export const loadingStore = writable({
    show: true
});

export const fbStore = writable({});

export const stripeStore = writable({});

// when updating this template, also update the default reset object in the layout signOutUser function
export const sessionStore = writable({});

// this get's sort of instantiated  in the subscription_service page startup
export const subscriptionSetupStore = writable({

});

export const email_verification = writable({
	url:''
});
