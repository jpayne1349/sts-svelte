// handles all incoming requests on the server

// interjecting a check to see if the /client page is being viewed, if so, we need verify/establish the Admin-SDK

import { initializeApp, cert, getApp } from 'firebase-admin/app';
import {
	FIREBASE_ADMIN_PROJECT_ID,
	FIREBASE_ADMIN_CLIENT_EMAIL,
	FIREBASE_ADMIN_PRIVATE_KEY
} from '$env/static/private';
import { getAuth, baseAuth } from 'firebase-admin/auth';

let firebase_admin_connected = false;

export async function handle({ event, resolve }) {
	
	const response = await resolve(event);
	return response;

	// we are bypassing the below, because I dont think server side auth is necessary for a good experience anymore...

	let connected = false;

	//client route only
	if (event.url.pathname.startsWith('/client')) {
		let currentApp;
		
		// try firebase admin connection only if not already set
		try {
			currentApp = getApp();
			connected = true;
		} catch (e) {
			console.log('No previous app connection found');
		}

		if (!connected) {
			console.log('trying to connect!');

			const firebaseConnection = firebaseAdminConnect()
				.then(async (admin_object, auth_object) => {
					if (admin_object) {
						connected = true;
						console.log('...connected to firebase-admin');

						// check for cookies in request
						let session_cookie = event.cookies.get('session');

						// decipher cookie token if possible
						if (session_cookie) {
							console.log('session cookie found, decoding');

							auth_object
								.verifySessionCookie(session_cookie)
								.then((decodedToken) => {
									let uid = decodedToken.uid;

									auth_object.createCustomToken(uid).then((custom_token)=>{
										event.locals.return_user = true;
										event.locals.custom_token = custom_token;

										// console.log(
										// 	'SESSION COOKIE VERIFIED TO AND LOCALS SET TO LOGIN USER: ',
										// 	event.locals
										// );
									})
								})
								.catch((error) => {
									// maybe the token expired
									console.log('looks like the session token expired');

									event.cookies.delete('session');
								});
						} else {
							console.log('no session cookie found');
						}

						// show user profile
						const response = await resolve(event);
						return response;
					}
				})
				.catch(async (error) => {
					console.log('error while connecting');
					console.log(error);

					const response = await resolve(event);
					return response;
				});
		} else {
			console.log('firebase admin already connected, checking cookies');
			// check for cookies in request
			let session_cookie = event.cookies.get('session');

			// decipher cookie token if possible
			if (session_cookie) {
				console.log('session cookie found, decoding');

				getAuth()
					.verifySessionCookie(session_cookie)
					.then((decodedToken) => {
						let uid = decodedToken.uid;

						getAuth().createCustomToken(uid).then((custom_token) => {
							event.locals.return_user = true;
							event.locals.custom_token = custom_token;

							// console.log('SESSION COOKIE VERIFIED TO AND LOCALS SET TO LOGIN USER: ', event.locals);
						});
						
					})
					.catch((error) => {
						// maybe the token expired
						console.log('looks like the session token expired');

						event.cookies.delete('session');

					});
			} else {
				console.log('no session cookie found');
			}

			const response = await resolve(event);
			
			return response;
		}
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
