// Basically just handling/checking for the cookies acceptance policy here.

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	let policy_cookie = event.cookies.get('policyCookie');

	// if it exists, we then return a modified response that the front end can interpret.
	if (policy_cookie) {
		// locals seems to clear on each request, so we will just set it on every one for now, and let the base layout set the flag
		event.locals = {
			policyCookieSet: true
		};
	}

	return resolve(event);
}
