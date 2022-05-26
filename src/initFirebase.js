import firebaseConfig from './env';
import { browser, dev } from '$app/env';

export async function initFirebase() {
	console.log('Running in browser: ', browser);
	console.log('Development Mode: ', dev);

	try {
		// our way of only running this in the browser.
		if (typeof window != 'undefined') {
			let { initializeApp } = await import('firebase/app');
			let { getAnalytics, isSupported } = await import('firebase/analytics');
			let { getFirestore } = await import('firebase/firestore');
			let { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');

			const app = await initializeApp(firebaseConfig);

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

			const db = getFirestore(app);

			if (dev) {
				self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
			}

			const appCheck = initializeAppCheck(app, {
				provider: new ReCaptchaV3Provider('6LdXPukfAAAAAFJjgZDYYiMhDMLZKiirlzgp-oho'),

				isTokenAutoRefreshEnabled: true
			});

			return { app, db };
		}

		// code here to run on server side
		// not needed at this time?
	} catch (error) {
		console.log('Error in Firebase Init');
		console.error(error);
		// TODO: return a trigger to display an error in the contact form.
	}
}
