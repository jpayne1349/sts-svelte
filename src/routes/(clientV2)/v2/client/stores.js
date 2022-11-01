import { writable } from 'svelte/store';

export const alertStore = writable({
	show: false,
	message: '',
	error: false
});


export const fbStore = writable({});

export const stripeStore = writable({});