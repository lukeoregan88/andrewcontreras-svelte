<script>
	import { PUBLIC_WP_JSON_URL } from '$env/static/public';
	import { onMount, afterUpdate } from 'svelte';
	/**
	 * @type {any}
	 */
	export let limit = undefined;
	export let exclude = undefined;
	export let orderby = undefined;
	/**
	 * @type {string | undefined}
	 */
	export let feedClass = undefined;

	//Query Base URL

	let url = `${PUBLIC_WP_JSON_URL}wp-json/wp/v2/posts`;

	//Query Params for GetPosts

	if (feedClass) {
		feedClass = 'loop ' + feedClass;
	} else {
		feedClass = 'loop';
	}

	if (limit) {
		url += `?per_page=${limit}`;
	}
	if (exclude) {
		url += limit || orderby ? `&exclude[]=${exclude}` : `?exclude[]s=${exclude}`;
	}
	if (orderby) {
		url += limit || exclude ? `&orderby=${orderby}` : `?orderby=${orderby}`;
	}

	/**
	 * @type {any}
	 */

	let postsCache = null;
	/**
	 * @type {never[]}
	 */
	let posts = [];

	// @ts-ignore
	const handleIntersection = (entries) => {
		// @ts-ignore
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.play();
			} else {
				entry.target.pause();
			}
		});
	};

	// @ts-ignore
	let observer;

	afterUpdate(() => {
		// Add the IntersectionObserver to the videos only after posts have loaded
		// @ts-ignore
		if (posts) {
			const videos = document.querySelectorAll('video.autoplay');
			observer = new IntersectionObserver(handleIntersection, {
				threshold: 0.5 // play video when it's 50% within the viewport
			});
			videos.forEach((video) => {
				// @ts-ignore
				observer.observe(video);
			});
		}
	});

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
				title: post.title.rendered,
				excerpt: post.excerpt.rendered,
				acf: post.acf,
				slug: post.slug
			}));
			return postsCache;
		} catch (error) {
			console.error(error);
			return [];
		}
	};
</script>

{#await getPosts()}
	<p>loading videos...</p>
{:then posts}
	<div class={feedClass}>
		{#each posts as post}
			<div class="post">
				<a
					data-sveltekit-reload
					href="/projects/{post.slug}"
					class="post-link"
					data-sveltekit-noscroll
					data-sveltekit-preload-data="hover">Click here to view video</a
				>
				<div class="post-overlay">
					<h2>{@html post.title}</h2>
					{#if post.acf.posts__client}
						<h3>{@html post.acf.posts__client}</h3>
					{/if}
				</div>
				{#if post.acf.posts__overlay_video}
					<video muted loop class="autoplay">
						<source src={post.acf.posts__overlay_video.url} type="video/mp4" />
						Your browser does not support the video tag.
						<track kind="captions" />
					</video>
				{:else}
					nada thing
				{/if}
			</div>
		{/each}
	</div>
{/await}

<style lang="scss">
	.loop {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		.post {
			width: 100%;
			height: 100%;
			aspect-ratio: 16/9;
			background: #000;
			position: relative;
			//every third child
			@media (min-width: 992px) {
				width: 50%;
			}
			.post-link {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: 10;
				display: block;
				opacity: 0;
			}
			.post-overlay {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 50%);
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
				padding: 1rem;
				z-index: 2;
				h2 {
					font-size: clamp(2rem, -0.0769rem + 5.7692vw, 3.5rem);
					color: #fff;
					margin: 0;
					text-transform: uppercase;
					text-shadow: 2px 2px 15px rgba(0, 0, 0, 0.5);
				}
				h3 {
					font-size: 4rem;
					color: #fff;
					margin: 0;
					font-family: 'Sassy Frass', cursive;
					line-height: 3.5rem;
					font-size: clamp(2.5rem, 0.4231rem + 5.7692vw, 4rem);
				}
				// p {
				// 	font-size: 1rem;
				// 	color: #fff;
				// 	margin: 0;
				// }
			}
			video {
				position: absolute;
				object-fit: cover;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				z-index: 0;
			}
		}
		&.homepage {
			.post {
				@media (min-width: 992px) {
					width: 50%;
					&:nth-child(3n + 1) {
						width: 100%;
						aspect-ratio: 16/5;
					}
				}
			}
		}
	}
</style>
