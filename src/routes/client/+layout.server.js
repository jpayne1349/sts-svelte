
// establish firebase-admin connection, and stripe connection

// if error occurs, data should be passed to client in order to show error, as well as send out an email to development team.

import { initializeApp, cert, getApp } from 'firebase-admin/app';
import Stripe from 'stripe';
import { getAuth, baseAuth } from 'firebase-admin/auth';
import { firebaseAdminConfig, stripeConfig } from '../../config';


export async function load() {

    let firebase_admin_connected = false;

    let firebase;


    try {
        firebase = getApp();
        firebase_admin_connected = true;
       //console.log('server previously connected to admin');
    } catch(e) {
       //console.log('No connected app found, attempt connect...');
    }

    if(!firebase_admin_connected) {
        try{
        let firebaseAppAndAuth = await firebaseAdminConnect();
        
        firebase = firebaseAppAndAuth.adminApp;
       //console.log('Server-side connected to firebase-admin');
        } catch(e) {
           //console.log(e);
            // firebase should remain undefined
        }
    }

    let stripe;

    stripe = Stripe(stripeConfig.privateKey);

   //console.log('stripe instance created on server');


}


function firebaseAdminConnect() {
	return new Promise((resolve, reject) => {
		const adminCert = cert({
			projectId: firebaseAdminConfig.projectId,
			clientEmail: firebaseAdminConfig.clientEmail,
			privateKey: firebaseAdminConfig.privateKey
		});

		const adminApp = initializeApp({
			credential: adminCert,
			storageBucket: 'fir-test-a3541.appspot.com'
		});

		const adminAuth = getAuth(adminApp);

		resolve(adminApp, adminAuth);
	});
}