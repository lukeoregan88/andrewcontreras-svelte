import { PUBLIC_WP_JSON_URL } from '$env/static/public';
export async function GET() {
	const res = await fetch(PUBLIC_WP_JSON_URL + 'wp-json/wp/v2/posts?per_page=100');
	const posts = await res.json();

	const res2 = await fetch(PUBLIC_WP_JSON_URL + 'wp-json/wp/v2/pages?per_page=100');
	const pages = await res2.json();

	const urls = [
		// @ts-ignore
		...pages.map((page) => ({ loc: page.link })),
		// @ts-ignore
		...posts.map((post) => ({ loc: post.link }))
	];

	const urlset = urls.map((url) => {
		const { loc } = url;

		// @ts-ignore
		const regex = /(https:\/\/wp-admin\.andrewcontreras\.com\/)(?!wp-content\/uploads)/g;
		const replacedLoc = loc.replace(regex, 'https://andrewcontreras.com/');

		return `<url>
      <loc>${replacedLoc}</loc>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
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
