/** @type {import('./$types').PageLoad} */
import { PUBLIC_WP_JSON_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const prerender = true;

// @ts-ignore
export async function load({ fetch }) {
	const res = await fetch(PUBLIC_WP_JSON_URL + 'wp-json/wp/v2/pages?slug=home');
	const data = await res.json();

	if (!data.length) {
		throw error(500, {
			message: 'Page Error'
		});
	}

	return {
		data
	};
}
