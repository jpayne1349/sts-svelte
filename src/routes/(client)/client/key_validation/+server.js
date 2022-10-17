import { json, error } from '@sveltejs/kit';
import { getFirestore } from 'firebase-admin/firestore';
import { getApp, cert, initializeApp } from 'firebase-admin/app';
import { ONE_TIME_KEY_SUCCESSFUL } from '$env/static/private';

// i guess this is kind of silly if we don't send our message encrypted and decrypt with an env variable on the client side.. lol

export async function POST({ request }) {
	const payload = await request.json();

	const app = getApp();
	const db = getFirestore(app);

	const docRef = db.collection('one-time-key').doc(payload.key);
	//console.log('docRef: ', docRef);
	const returnMessage = docRef.get().then(async (doc) => {
		if (doc.exists) {
			const updatedDoc = await docRef.update({
				used: true
			});
			return json({ key: ONE_TIME_KEY_SUCCESSFUL });
		} else {
			return json({ key: 'incorrect' });
		}
	});

	return returnMessage;
}
