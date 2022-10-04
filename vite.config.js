import { sveltekit } from '@sveltejs/kit/vite';

const config = {
	plugins: [sveltekit()],
	publicDir: "static",
	server: {
		fs: {
			allow: ['..']
		}
	}
};

export default config;
