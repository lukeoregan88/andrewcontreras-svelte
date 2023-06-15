import { PUBLIC_WP_JSON_URL } from '$env/static/public';
export async function GET() {
	const res = await fetch(PUBLIC_WP_JSON_URL + 'wp-json/video_feeds/v1/videos');
	const posts = await res.json();

	const res2 = await fetch(PUBLIC_WP_JSON_URL + 'wp-json/wp/v2/pages?per_page=100');
	const pages = await res2.json();

	const urls = [
		// @ts-ignore
		...pages.map((page) => ({ item: page, type: 'page' })),
		// @ts-ignore
		...posts.map((post) => ({ item: post, type: 'post' }))
	];

	const urlset = urls.map((url) => {
		const { item, type } = url;

		// @ts-ignore
		let itemUrl = '';
		if (type === 'post') {
			// @ts-ignore
			itemUrl = 'https://andrewcontreras.com/projects/' + item.slug + '/';
		} else {
			// @ts-ignore
			itemUrl = item.link;
		}
		const regex = /(https:\/\/wp-admin\.andrewcontreras\.com\/)(?!wp-content\/uploads)/g;
		const replacedLoc = itemUrl.replace(regex, 'https://andrewcontreras.com/');

		let videoXml = '';

		if (type === 'post') {
			videoXml = `
      <video:video>
        <video:thumbnail_loc>${item.featured_image}</video:thumbnail_loc>
        <video:title>${item.title}</video:title>
        <video:description>${item.excerpt.replace(/&/g, '&amp;')}</video:description>
        <video:content_loc>${item.file_url}</video:content_loc>
      </video:video>
    `;
		}

		return `<url>
      <loc>${replacedLoc}</loc>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
      ${videoXml}
    </url>`;
	});

	const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
  <urlset
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="https://www.w3.org/1999/xhtml"
    xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
    xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
  >
    ${urlset.join('')}
  </urlset>`;

	return new Response(sitemap.trim(), {
		headers: {
			'Cache-Control': 'max-age=0, s-maxage=3600',
			'Content-Type': 'application/xml'
		}
	});
}
