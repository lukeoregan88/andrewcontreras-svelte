/** @type {import('./$types').PageLoad} */
import { PUBLIC_WP_JSON_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const prerender = true;

// @ts-ignore
export async function load({ fetch, depends }) {
	// Use depends to properly cache this data
	depends('homepage-data');

	try {
		// Fetch directly from WordPress API (works during prerender and at runtime)
		// This matches the pattern used in other pages like about.js
		const res = await fetch(`${PUBLIC_WP_JSON_URL}wp-json/wp/v2/pages?slug=home`, {
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
