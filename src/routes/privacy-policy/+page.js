/** @type {import('./$types').PageLoad} */
import { PUBLIC_WP_JSON_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function load({ fetch }) {
	try {
		const response = await fetch(PUBLIC_WP_JSON_URL + 'wp-json/wp/v2/pages?slug=privacy-policy');

		if (!response.ok) {
			console.error(
				`Failed to fetch privacy policy page: ${response.status} ${response.statusText}`
			);
			error(response.status, {
				message: `Failed to load privacy policy page: ${response.statusText}`
			});
		}

		const data = await response.json();

		if (!data || !Array.isArray(data) || data.length === 0) {
			error(404, {
				message: 'Privacy policy page not found'
			});
		}

		return {
			data
		};
	} catch (err) {
		console.error('Error loading privacy policy page:', err);
		error(500, {
			message: 'Failed to load privacy policy page data'
		});
	}
}
