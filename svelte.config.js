import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore errors for API routes during prerender
				if (path.startsWith('/api/')) {
					console.warn(`API route ${path} returned an error during prerender: ${message}`);
					return;
				}
				// Allow 500 errors during prerender - they might be due to external API unavailability
				// The page will still be generated with empty data and fetch at runtime
				if (message.includes('500')) {
					console.warn(
						`Page ${path} returned 500 during prerender (likely API unavailable): ${message}. Page will be generated with fallback data.`
					);
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
				prependData: '@use "src/variables.scss" as *;',
				silenceDeprecations: ['legacy-js-api']
			},
			postcss: {
				plugins: [autoprefixer]
			}
		})
	]
};

export default config;
