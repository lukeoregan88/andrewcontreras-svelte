<script>
	import { onMount } from 'svelte';
	import Header from '$lib/Header.svelte';

	export let data;

	let post = data.data[0];
	let catgeory = data.category[0];
	/**
	 * @type {HTMLVideoElement}
	 */
	let video;
	let muted = true;
	let volume = 0;
	/**
	 * @type {typeof import("$lib/posts/PostsFeed.svelte").default}
	 */
	let PostsFeed;
	onMount(async () => {
		PostsFeed = (await import('$lib/posts/PostsFeed.svelte')).default;
	});
	function playVideo() {
		video.play();
	}

	const url = catgeory.yoast_head;
	const regex = /(https:\/\/wp-admin\.andrewcontreras\.com\/)(?!wp-content\/uploads)/g;
	const replacedUrl = url.replace(regex, 'https://andrewcontreras.com/');
</script>

<svelte:head>
	{#key catgeory}
		{@html replacedUrl}
	{/key}
</svelte:head>

<div class="category-lead">
	<a href="/projects/{post.slug}">View {@html post.title.rendered}</a>
	<div style="display: none;">
		<h1>{@html catgeory.name}</h1>
		<span>{@html catgeory.description}</span>
	</div>
	<div class="lead-title">
		<h2>{@html post.title.rendered}</h2>
		{#if post.acf.posts__client}
			<span>{@html post.acf.posts__client}</span>
		{/if}
	</div>

	{#if post.acf.posts__overlay_video}
		<video
			bind:muted
			bind:volume
			bind:this={video}
			on:canplay={playVideo}
			autoplay
			loop
			playsinline
			disablepictureinpicture
			preload="true"
		>
			<source src={post.acf.posts__overlay_video.url} type="video/mp4" />
			Your browser does not support the video tag.
			<track kind="captions" />
		</video>
	{:else}
		nada thing
	{/if}
</div>

<Header />

<div class="content">
	<svelte:component this={PostsFeed} categories={catgeory.id} exclude={post.id} />
</div>

<style lang="scss">
	.category-lead {
		width: 100vw;
		height: calc(100vh - 54px);
		min-height: calc(100vh - 54px);
		max-width: 100%;
		overflow: hidden;
		position: relative;
		top: 0;
		left: 0;
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
		padding: 1rem 1rem 4rem 1rem;
		flex-direction: column;
		@media (min-width: 768px) {
			flex-direction: row;
		}
		a {
			z-index: 20;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
		}
		.lead-title {
			position: relative;
			z-index: 10;

			h2 {
				font-size: 4rem;
				text-shadow: 2px 2px 15px rgba(0, 0, 0, 0.5);
				color: #ffffff;
				margin: 0;
				text-transform: uppercase;
				@media (min-width: 1200px) {
					font-size: 8rem;
				}
			}
			span {
				text-shadow: 2px 2px 15px rgba(0, 0, 0, 0.5);
				font-size: 4rem;
				color: #fff;
				margin: 0;
				font-family: 'Sassy Frass', cursive;
				line-height: 3.5rem;
			}
		}
		video {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
		.homepage-popup {
			position: relative;
			top: 0;
			left: 0;
			z-index: 10;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			opacity: 1;
			transition: opacity 0.3s ease-in-out;
			@media (min-width: 768px) {
				background: rgba(0, 0, 0, 0.434);
				position: absolute;
				top: 0;
				left: 0;
				opacity: 0;
				&:hover {
					opacity: 1;
				}
			}
			svg {
				width: 100px;
				fill: #fff;
				cursor: pointer;
			}
		}
	}
</style>
