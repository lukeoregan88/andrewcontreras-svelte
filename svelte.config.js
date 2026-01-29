import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404s for API routes during prerender
				if (path.startsWith('/api/')) {
					console.warn(`API route ${path} returned an error during prerender: ${message}`);
					return;
				}
				// For other errors, throw to fail the build
				throw new Error(`Prerender error on ${path}: ${message}`);
			}
		}
	},

	preprocess: [
		preprocess({
			scss: {
				prependData: '@use "src/variables.scss" as *;'
			},
			postcss: {
				plugins: [autoprefixer]
			}
		})
	]
};

export default config;
