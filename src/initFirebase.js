import firebaseConfig from './env';

export async function initFirebase() {
	try {
        // our way of only running this in the browser.
		if (typeof window != undefined) {
			
			let { initializeApp } = await import('firebase/app');
			let { getAnalytics , isSupported } = await import('firebase/analytics');
			let { getFirestore } = await import('firebase/firestore');
			let {initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');

			const app = initializeApp(firebaseConfig);
            const analytics = getAnalytics(app);
			const db = getFirestore(app);

			// for development only?
			//self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
			
			const appCheck = initializeAppCheck(app, {
				provider: new ReCaptchaV3Provider(firebaseConfig.recaptchaSite),

			// 	isTokenAutoRefreshEnabled: true
			// });

			return { app , db};
		}

		// code here to run on server side
        // not needed at this time?

	} catch (error) {
		console.log('Error in Firebase Init');

        // TODO: return a trigger to display an error in the contact form.
	}
}
