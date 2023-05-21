/** @type {import('./$types').PageLoad} */
import { PUBLIC_WP_JSON_URL } from '$env/static/public';

export const prerender = true;

export async function load({ fetch }) {
	const res1 = await fetch(
		`https://wp-admin.andrewcontreras.com/wp-json/wp/v2/categories?slug=advertising`
	);
	const item1 = await res1.json();

	const res2 = await fetch(PUBLIC_WP_JSON_URL + 'wp-json/wp/v2/posts?categories=2&per_page=1');
	const item2 = await res2.json();

	return {
		category: item1,
		data: item2
	};
}
