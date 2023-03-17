/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';

// @ts-ignore
export const load = async ({ fetch, params: { slug } }) => {
	const res = await fetch(
		`https://wp-admin.andrewcontreras.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
	);
	const post = await res.json();

	if (!post.length) {
		throw error(404, {
			message: 'Not found'
		});
	}

	return { post };
};
