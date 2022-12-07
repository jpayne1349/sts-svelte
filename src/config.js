//07-Dec-2022 updated env variables in hosting environment

let process;

const p = process?.env ? process.env : import.meta.env;

// all the public variables

export const firebaseClientConfig = {
	apiKey: p.VITE_FIREBASE_CLIENT_APIKEY,
	authDomain: p.VITE_FIREBASE_CLIENT_AUTHDOMAIN,
	projectId: p.VITE_FIREBASE_CLIENT_PROJECTID,
	storageBucket: p.VITE_FIREBASE_CLIENT_STORAGEBUCKET,
	messagingSenderId: p.VITE_FIREBASE_CLIENT_MESSAGINGSENDERID,
	appId: p.VITE_FIREBASE_CLIENT_APPID,
	measurementId: p.VITE_FIREBASE_CLIENT_MEASUREMENTID,
	recaptchaPublic: p.VITE_FIREBASE_CLIENT_RECAPTCHAPUBLIC,
	storageBucket: p.VITE_FIREBASE_CLIENT_STORAGEBUCKET
};


export const firebaseAdminConfig = {
	projectId: p.VITE_FIREBASE_ADMIN_PROJECTID,
	clientEmail: p.VITE_FIREBASE_ADMIN_CLIENT_EMAIL,
	privateKey: p.VITE_FIREBASE_ADMIN_PRIVATE_KEY
};

export const stripeConfig = {
	privateKey: p.VITE_STRIPE_PRIVATE_KEY,
	publicKey: p.VITE_STRIPE_PUBLIC_KEY,
	webhookSecret: p.VITE_STRIPE_WEBHOOK_SECRET
};

export const sendgridConfig = {
	apiKey: p.VITE_SENDGRID_API_KEY
};

export const encryptionConfig = {
	privateKey: p.VITE_ENCRYPTION_PRIVATE_KEY
};