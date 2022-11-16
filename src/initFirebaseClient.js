
import firebaseConfig from './env';
import { browser, dev } from '$app/environment';

export async function initFirebaseClient() {

	try {
		
		// our way of only running this in the browser. we tried checking the browser boolean from svelte and it didnt work...
		if (typeof window != 'undefined') {
			//console.log('Initializing Firebase Client Connection');

			let { initializeApp } = await import('firebase/app');
			let { getAnalytics, isSupported } = await import('firebase/analytics');
			let { getFirestore } = await import('firebase/firestore');
			let { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');
			let { getAuth } = await import('firebase/auth');
			

			const app = initializeApp(firebaseConfig);
			const auth = getAuth(app);
			const db = getFirestore(app);

			let analytics = isSupported()
				.then(() => {
					// secondary check so this doesn't run in server after promise above returns
					if (browser) {
						try {
							getAnalytics(app);
						} catch (e) {
							console.log('Error in getAnalytics');
							console.error(e);
						}
					}
				})
				.catch((e) => {
					console.log('Error in isSupported()');
					console.error(e);
				});

			

			if (dev) {
				self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
			}
			
			if(!dev) {
				const appCheck = initializeAppCheck(app, {
					provider: new ReCaptchaV3Provider('6LdXPukfAAAAAFJjgZDYYiMhDMLZKiirlzgp-oho'),

					isTokenAutoRefreshEnabled: true
				});
			}

			//console.log('Client Connected to Firebase');
			let firebase = {
				app: app,
				db: db,
				auth: auth,
				error: false
			};

			return firebase;
		}

		// code here to run on server side
		// not needed at this time?
	} catch (error) {
		let firebase = {
			error: true,
			message: error
		}
		console.log('Error in Firebase Init');
		console.error(error);
		
		return firebase;
	}
}
