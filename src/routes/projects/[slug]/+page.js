/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit';

// @ts-ignore
export const load = async ({ fetch, params: { slug } }) => {
	try {
		const res = await fetch(
			`https://wp-admin.andrewcontreras.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
		);

		if (!res.ok) {
			console.error(`Failed to fetch project: ${res.status} ${res.statusText}`);
			error(res.status, {
				message: `Failed to load project: ${res.statusText}`
			});
		}

		const post = await res.json();

		if (!post || !Array.isArray(post) || post.length === 0) {
			error(404, {
				message: 'Project not found'
			});
		}

		return { post };
	} catch (err) {
		console.error('Error loading project:', err);
		error(500, {
			message: 'Failed to load project data'
		});
	}
};
