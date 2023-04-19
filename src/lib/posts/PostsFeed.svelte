<script>
	import { PUBLIC_WP_JSON_URL } from '$env/static/public';
	import { afterUpdate } from 'svelte';
	/**
	 * @type {any}
	 */

	export let limit = undefined;
	export let exclude = undefined;
	export let orderby = undefined;
	export let categories = undefined;
	/**
	 * @type {undefined}
	 */
	export let showCategories = undefined;
	/**
	 * @type {HTMLVideoElement}
	 */
	let video;
	let muted = true;
	let volume = 0;
	/**
	 * @type {string | undefined}
	 */
	export let feedClass = undefined;

	//Query Base URL
	let url = `${PUBLIC_WP_JSON_URL}wp-json/video_feeds/v1/videos`;

	//Query Params for GetPosts
	if (feedClass) {
		feedClass = 'loop ' + feedClass;
	} else {
		feedClass = 'loop';
	}

	if (categories) {
		url += `?category=${categories}`;
	}

	if (limit) {
		url += url.includes('?') ? `&per_page=${limit}` : `?per_page=${limit}`;
	}

	if (exclude) {
		url += url.includes('?') ? `&exclude[]=${exclude}` : `?exclude[]=${exclude}`;
	}

	if (orderby) {
		url += url.includes('?') ? `&orderby=${orderby}` : `?orderby=${orderby}`;
	}

	//url += '&_embed=wp:featuredmedia&_fields=id,title,acf,slug,_links.wp:featuredmedia,_embedded';

	//console.log(url);

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
				threshold: 0.33 // play video when it's 50% within the viewport
			});
			videos.forEach((video) => {
				// @ts-ignore
				observer.observe(video);
			});
		}
	});

	// onMount(async () => {
	// 	posts = await getPosts();
	// });

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
				title: post.title,
				slug: post.slug,
				featured_image: post.featured_image,
				posts__overlay_video: post.file_url,
				posts__client: post.posts__client,
				posts__video_type: post.posts__video_type,
				category: post.category
			}));
			return postsCache;
		} catch (error) {
			console.error(error);
			return [];
		}
	};

	// function playVideo() {
	// 	video.play();
	// }
</script>

{#await getPosts()}
	<p>loading videos...</p>
{:then posts}
	<div class={feedClass}>
		{#each posts as post}
			<div class="post">
				<a href="/projects/{post.slug}" class="post-link">Click here to view video</a>
				<div class="post-overlay">
					{#if showCategories}
						{#if post.category}
							<h4 class="cat">{@html post.category}</h4>
						{/if}
					{/if}
					<h2>{@html post.title}</h2>
					{#if post.posts__client}
						<h3>{@html post.posts__client}</h3>
					{:else if post.posts__video_type}
						<h3>{@html post.posts__video_type}</h3>
					{/if}
				</div>
				{#if post.posts__overlay_video}
					<video
						bind:muted
						bind:volume
						bind:this={video}
						loop
						playsinline
						disablepictureinpicture
						preload="true"
						class="autoplay"
						poster={post.featured_image}
					>
						<source src={post.posts__overlay_video} type="video/mp4" />
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
			aspect-ratio: 1;
			background: #000;
			position: relative;
			//every third child
			@media (min-width: 992px) {
				width: 50%;
				aspect-ratio: 16/9;
			}
			.post-link {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: 20;
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
				h4.cat {
					opacity: 0.5;
					text-transform: uppercase;
					letter-spacing: 2px;
					font-family: sans-serif;
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
		&.homepage,
		&.category {
			.post {
				@media (min-width: 992px) {
					width: 50%;
					&:nth-child(3n + 3) {
						width: 100%;
						aspect-ratio: 16/5;
					}
					// &:nth-child(3n + 1):last-child {
					// 	width: 100%;
					// 	aspect-ratio: 16/5;
					// }
					/* Select the 4th, 7th, 10th, and every third item after that if it's the last child, and its second last child */
					&:nth-child(3n + 1):last-child,
					&:not(:nth-child(3n + 1)):nth-last-child(2) {
						width: 50%;
						aspect-ratio: 16/9;
					}
				}
			}
		}
	}
</style>
