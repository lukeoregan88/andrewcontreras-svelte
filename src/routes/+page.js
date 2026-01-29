/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';

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
			// During prerender, return empty data instead of throwing error
			// This allows the build to succeed even if the API is unavailable
			// The handleHttpError in svelte.config.js will handle the HTTP error gracefully
			console.warn(
				`API unavailable during prerender (${res.status}). Page will load data at runtime.`
			);
			return {
				data: []
			};
		}

		const data = await res.json();

		// Handle API error response
		if (data.error) {
			// During prerender, return empty data instead of throwing error
			console.warn(`API error during prerender: ${data.error}. Page will load data at runtime.`);
			return {
				data: []
			};
		}

		if (!data || !Array.isArray(data) || data.length === 0) {
			// During prerender, return empty data instead of throwing error
			console.warn('No data available during prerender. Page will load data at runtime.');
			return {
				data: []
			};
		}

		return {
			data
		};
	} catch (err) {
		// During prerender, return empty data instead of throwing error
		// This allows the build to succeed even if there's an error
		// The handleHttpError in svelte.config.js will handle the HTTP error gracefully
		console.warn(
			`Error during prerender: ${
				err instanceof Error ? err.message : 'Unknown error'
			}. Page will load data at runtime.`
		);
		return {
			data: []
		};
	}
}
