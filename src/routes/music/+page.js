/** @type {import('./$types').PageLoad} */
import { PUBLIC_WP_JSON_URL } from '$env/static/public';

export const prerender = true;

export async function load() {
	const urls = [
		'https://wp-admin.andrewcontreras.com/wp-json/wp/v2/categories?slug=music',
		PUBLIC_WP_JSON_URL + 'wp-json/wp/v2/posts?categories=141&per_page=1'
	];

	const responses = await Promise.all(urls.map((url) => fetch(url)));
	const results = await Promise.all(responses.map((response) => response.json()));

	return {
		category: results[0],
		data: results[1]
	};
}
