/** @type {import('./$types').PageLoad} */
import { PUBLIC_WP_JSON_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const prerender = true;

// @ts-ignore
export async function load({ fetch }) {
	try {
		// Optimised fetch with cache headers
		const res = await fetch(PUBLIC_WP_JSON_URL + 'wp-json/wp/v2/pages?slug=home', {
			headers: {
				Accept: 'application/json',
				'Cache-Control': 'max-age=300' // Cache for 5 minutes
			}
		});

		if (!res.ok) {
			console.error(`Failed to fetch page data: ${res.status} ${res.statusText}`);
			error(res.status, {
				message: `Failed to load page: ${res.statusText}`
			});
		}

		const data = await res.json();

		if (!data || !Array.isArray(data) || data.length === 0) {
			error(404, {
				message: 'Page not found'
			});
		}

		return {
			data
		};
	} catch (err) {
		console.error('Error loading page:', err);
		error(500, {
			message: 'Failed to load page data'
		});
	}
}
