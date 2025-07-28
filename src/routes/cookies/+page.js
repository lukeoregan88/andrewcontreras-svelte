/** @type {import('./$types').PageLoad} */
import { PUBLIC_WP_JSON_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function load({ fetch }) {
	try {
		const response = await fetch(PUBLIC_WP_JSON_URL + 'wp-json/wp/v2/pages?slug=cookies');

		if (!response.ok) {
			console.error(`Failed to fetch cookies page: ${response.status} ${response.statusText}`);
			error(response.status, {
				message: `Failed to load cookies page: ${response.statusText}`
			});
		}

		const data = await response.json();

		if (!data || !Array.isArray(data) || data.length === 0) {
			error(404, {
				message: 'Cookies page not found'
			});
		}

		return {
			data
		};
	} catch (err) {
		console.error('Error loading cookies page:', err);
		error(500, {
			message: 'Failed to load cookies page data'
		});
	}
}
