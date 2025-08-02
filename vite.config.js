import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
	plugins: [
		sveltekit(),
		compression({
			algorithm: 'gzip',
			ext: '.gz',
			threshold: 1024
		})
	],

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;',
				silenceDeprecations: [
					'mixed-decls',
					'color-functions',
					'global-builtin',
					'import',
					'legacy-js-api'
				]
			}
		}
	},

	ssr: {
		noExternal: ['@fancyapps/ui']
	},

	build: {
		// Enable minification
		minify: 'terser',
		// Enable source maps for development only
		sourcemap: false,
		// Optimise chunk size
		rollupOptions: {
			output: {
				manualChunks: {
					// Separate vendor chunks for better caching
					vendor: ['@fancyapps/ui']
				}
			}
		},
		// Enable compression
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		}
	},

	// Optimise development server
	server: {
		// Development server optimisations
		port: 5173,
		host: true
	}
});
