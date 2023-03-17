/** @type {import('./$types').PageLoad} */
import { PUBLIC_WP_JSON_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function load() {
	const response = await fetch(PUBLIC_WP_JSON_URL + 'wp-json/wp/v2/pages?slug=about');
	const data = await response.json();

	if (!data.length) {
		throw error(500, {
			message: 'Page Load Error'
		});
	}

	return {
		data
	};
}
