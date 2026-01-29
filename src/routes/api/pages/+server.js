import { PUBLIC_WP_JSON_URL } from '$env/static/public';
import { json } from '@sveltejs/kit';

/**
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ url: requestUrl }) {
	try {
		const slug = requestUrl.searchParams.get('slug') || 'home';

		const apiUrl = `${PUBLIC_WP_JSON_URL}wp-json/wp/v2/pages?slug=${slug}`;

		const res = await fetch(apiUrl, {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!res.ok) {
			return json(
				{ error: `Failed to fetch page data: ${res.status} ${res.statusText}` },
				{ status: res.status }
			);
		}

		const data = await res.json();

		return json(data, {
			headers: {
				'Cache-Control': 'max-age=300, s-maxage=300' // Cache for 5 minutes
			}
		});
	} catch (error) {
		console.error('Error fetching page data:', error);
		return json({ error: 'Failed to fetch page data' }, { status: 500 });
	}
}
