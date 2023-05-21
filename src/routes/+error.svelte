<script>
	// @ts-nochec
	import { PUBLIC_WP_JSON_URL } from '$env/static/public';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Header from '$lib/Header.svelte';
	/**
	 * @type {any}
	 */

	let postsCache = null;

	/**
	 * @type {{ video: string }[]}
	 */
	let posts = [];

	//Query Base URL
	let url = `${PUBLIC_WP_JSON_URL}wp-json/wp/v2/pages?slug=home&_fields=acf.homepage_video.url`;

	onMount(async () => {
		posts = await getPosts();
	});

	// @ts-ignore
	const getPosts = async () => {
		if (postsCache) {
			return postsCache;
		}
		try {
			const res = await fetch(url);
			if (!res.ok) {
				throw new Error(`Failed to fetch posts, status code: ${res.status}`);
			}
			const data = await res.json();
			// @ts-ignore
			postsCache = data.map((post) => ({
				video: post.acf.homepage_video.url
			}));
			return postsCache;
		} catch (error) {
			console.error(error);
			return [];
		}
	};
</script>

<Header />

<section class="page-content">
	<div class="entry-content">
		<div class="col">
			{#await getPosts()}
				<h1 class="text white">{$page.status}: {$page.error?.message}</h1>
			{:then posts}
				<video
					autoplay
					loop
					muted
					playsinline
					preload="auto"
					poster="https://www.alexanderhughes.com/wp-content/uploads/2021/03/alexander-hughes-portfolio-website-2021-1.jpg"
					src={posts[0].video}
					class="video"
				/>
				<h1 class="text">{$page.status}: {$page.error?.message}</h1>
			{/await}
		</div>
	</div>
</section>

<style lang="scss">
	.entry-content {
		position: relative;
	}

	video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		mix-blend-mode: screen;
	}

	.text {
		color: white;
		background: #000;
		font-size: 5em;
		text-align: center;
		z-index: 1;
		mix-blend-mode: multiply;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		font-size: 7rem;
		display: flex;
		align-items: center;
		justify-content: center;
		align-content: center;
		flex-wrap: nowrap;
		flex-direction: row;
		line-height: 0.9;
		pointer-events: none;
		&.white {
			color: #ffffff;
			mix-blend-mode: normal;
		}
	}
</style>
