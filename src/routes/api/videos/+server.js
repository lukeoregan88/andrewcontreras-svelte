import { PUBLIC_WP_JSON_URL } from '$env/static/public';
import { json } from '@sveltejs/kit';

/**
 * @type {import('./$types').RequestHandler}
 */
export async function GET({ url: requestUrl }) {
	try {
		const category = requestUrl.searchParams.get('category');
		const perPage = requestUrl.searchParams.get('per_page');
		const exclude = requestUrl.searchParams.get('exclude[]');
		const orderby = requestUrl.searchParams.get('orderby');

		let apiUrl = `${PUBLIC_WP_JSON_URL}wp-json/video_feeds/v1/videos`;

		const params = new URLSearchParams();
		if (category) params.append('category', category);
		if (perPage) params.append('per_page', perPage);
		if (exclude) params.append('exclude[]', exclude);
		if (orderby) params.append('orderby', orderby);

		if (params.toString()) {
			apiUrl += '?' + params.toString();
		}

		const res = await fetch(apiUrl, {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!res.ok) {
			return json(
				{ error: `Failed to fetch videos: ${res.status} ${res.statusText}` },
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
		console.error('Error fetching videos:', error);
		return json({ error: 'Failed to fetch videos' }, { status: 500 });
	}
}
