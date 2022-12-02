import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	let now = new Date();
	now = now.toTimeString();

	let new_cookie = cookies.serialize('policyCookie', now, {
		path: '/',
		secure: !dev,
		maxAge: 60 * 60 * 24 * 30
	});

    let response = new Response(JSON.stringify({cookieIsSet: true}),{
		headers: {
			'Set-Cookie': new_cookie,
            'Content-Type': 'application/json',

		}
	});

   //console.log('Policy Cookie has been set');

    return response;
}
