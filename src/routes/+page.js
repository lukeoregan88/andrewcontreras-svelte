/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';
import { building } from '$app/environment';

export const prerender = true;

// @ts-ignore
export async function load({ fetch, depends }) {
	// Use depends to properly cache this data
	depends('homepage-data');

	try {
		// Use API endpoint to avoid CORS issues
		const res = await fetch('/api/pages?slug=home', {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!res.ok) {
			// During build/prerender, return empty data instead of throwing error
			if (building) {
				console.warn(
					`API unavailable during build (${res.status}). Page will load data at runtime.`
				);
				return {
					data: []
				};
			}
			console.error(`Failed to fetch page data: ${res.status} ${res.statusText}`);
			error(res.status, {
				message: `Failed to load page: ${res.statusText}`
			});
		}

		const data = await res.json();

		// Handle API error response
		if (data.error) {
			// During build/prerender, return empty data instead of throwing error
			if (building) {
				console.warn(`API error during build: ${data.error}. Page will load data at runtime.`);
				return {
					data: []
				};
			}
			console.error('API error:', data.error);
			error(500, {
				message: data.error
			});
		}

		if (!data || !Array.isArray(data) || data.length === 0) {
			// During build/prerender, return empty data instead of throwing error
			if (building) {
				console.warn('No data available during build. Page will load data at runtime.');
				return {
					data: []
				};
			}
			error(404, {
				message: 'Page not found'
			});
		}

		return {
			data
		};
	} catch (err) {
		console.error('Error loading page:', err);

		// During build/prerender, return empty data instead of throwing error
		if (building) {
			console.warn(
				`Error during build: ${
					err instanceof Error ? err.message : 'Unknown error'
				}. Page will load data at runtime.`
			);
			return {
				data: []
			};
		}

		// Distinguish between network errors and server errors
		if (err instanceof TypeError && err.message === 'Failed to fetch') {
			// Network error - likely CORS or connectivity issue
			console.warn('Network error detected - this may be a CORS or connectivity issue');
			error(503, {
				message: 'Service temporarily unavailable. Please check your connection.'
			});
		} else {
			// Actual server error
			error(500, {
				message: 'Failed to load page data'
			});
		}
	}
}
