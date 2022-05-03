import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			server: {
				fs: {
					allow: ['static','static/OpenSans']
				}
			}
		}
	}
};

export default config;
