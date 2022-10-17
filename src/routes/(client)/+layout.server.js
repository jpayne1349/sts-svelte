

// we would like to establish the admin connection here in case we need any api routes to access authorized data only..etc.

import { initializeApp, cert, getApp } from 'firebase-admin/app';
import {
	FIREBASE_ADMIN_PROJECT_ID,
	FIREBASE_ADMIN_CLIENT_EMAIL,
	FIREBASE_ADMIN_PRIVATE_KEY
} from '$env/static/private';

import { getAuth, baseAuth } from 'firebase-admin/auth';



export async function load() {

    let firebase_admin_connected = false;

    console.log('running layout server load');

    let admin_app;

    try {
        admin_app = getApp();
        firebase_admin_connected = true;
        console.log('server previously connected to admin');
    } catch(e) {
        console.log('No connected app found, attempt connect...');
    }

    if(!firebase_admin_connected) {
        let firebaseAppAndAuth = await firebaseAdminConnect();
        
        admin_app = firebaseAppAndAuth.adminApp;
        console.log('server connected to admin');
    }


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