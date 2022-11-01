import adapter from '@sveltejs/adapter-auto';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	onwarn: (warning, handler) => {
		// TODO: revisit these warnings when terminal space is freed up
		if (warning.code.startsWith('a11y-')) {
			return;
		}
		if (warning.code.startsWith('css-')) {
			return;
		}
		if (warning.code.startsWith('unused-')) {
			return;
		}
		console.log(warning.code);

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
