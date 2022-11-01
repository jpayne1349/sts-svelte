
// establish firebase-admin connection, and stripe connection

// if error occurs, data should be passed to client in order to show error, as well as send out an email to development team.

import { initializeApp, cert, getApp } from 'firebase-admin/app';
import {
	FIREBASE_ADMIN_PROJECT_ID,
	FIREBASE_ADMIN_CLIENT_EMAIL,
	FIREBASE_ADMIN_PRIVATE_KEY,
	STRIPE_TEST_PRIVATE_KEY
} from '$env/static/private';

import Stripe from 'stripe';
import { getAuth, baseAuth } from 'firebase-admin/auth';
import { writable } from 'svelte/store';


export async function load() {

    let firebase_admin_connected = false;

    let firebase;

    try {
        firebase = getApp();
        firebase_admin_connected = true;
        console.log('server previously connected to admin');
    } catch(e) {
        console.log('No connected app found, attempt connect...');
    }

    if(!firebase_admin_connected) {
        try{
        let firebaseAppAndAuth = await firebaseAdminConnect();
        
        firebase = firebaseAppAndAuth.adminApp;
        console.log('Server-side connected to firebase-admin');
        } catch(e) {
            console.log(e);
            // firebase should remain undefined
        }
    }

    let stripe;

    stripe = Stripe(STRIPE_TEST_PRIVATE_KEY);

    console.log('stripe instance created');

    let server_state = writable({
        firebase: firebase,
        stripe: stripe
    });

}


function firebaseAdminConnect() {
	return new Promise((resolve, reject) => {
		const adminCert = cert({
			projectId: FIREBASE_ADMIN_PROJECT_ID,
			clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
			privateKey: FIREBASE_ADMIN_PRIVATE_KEY
		});

		const adminApp = initializeApp({
			credentials: adminCert
		});

		const adminAuth = getAuth(adminApp);

		resolve(adminApp, adminAuth);
	});
}