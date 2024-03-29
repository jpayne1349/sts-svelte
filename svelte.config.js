import adapter from '@sveltejs/adapter-auto';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	onwarn: (warning, handler) => {


		handler(warning);
	},
	kit: {
		adapter: adapter()
	},
	vitePlugin: {
		experimental: {
			useVitePreprocess: true
		}
	}
};

export default config;
