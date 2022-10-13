
// ** scratching this for now, as firebase is simplest by working throught the client for auth


import { json } from '@sveltejs/kit';
import { cookie } from 'cookie';
import { getAuth } from 'firebase-admin/auth';

// we will submit the users logged in / created account authToken in order to set it as a cookie
export async function POST({ request, cookies }) {

	const user_access_token = await request.json();

	const expiresIn = 60 * 60 * 24 * 14 * 1000;

	console.log(user_access_token);

	let resolveResponse = await getAuth().createSessionCookie(user_access_token, { expiresIn:expiresIn }).then((sessionCookie)=>{

		let cookie_var = 'session=' + sessionCookie + '; Max-Age=' + expiresIn + '; HttpOnly; SameSite=Lax';

		console.log('SESSION COOKIE = ', cookie_var);

		let custom_body = 'body object';
		let custom_options = {
			status: 201,
			headers: {
				'Set-Cookie': cookie_var
			}
		};

		let custom_response = new Response(custom_body, custom_options);

		return custom_response;

	}).catch((error)=>{

		console.log(error.errorInfo);

		let errorResponse = json({error: error.errorInfo});

		return errorResponse;

	});

	console.log("RESOLVED RESPONSE", resolveResponse);

	return resolveResponse;

}
