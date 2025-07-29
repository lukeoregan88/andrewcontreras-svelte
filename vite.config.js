import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;'
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
					vendor: ['@fancyapps/ui'],
					// Separate Bootstrap if you use more components later
					bootstrap: ['bootstrap']
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
		// Enable compression in development
		compress: true
	}
});
