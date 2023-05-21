<script>
	import { onMount } from 'svelte';
	import Header from '$lib/Header.svelte';
	import SEOHead from '$lib/components/SEOheader.svelte';
	/**
	 * @type {any}
	 */
	export let data;
	const page = data.data[0];

	/**
	 * @type {{ play: () => void; }}
	 */
	let video;
	let hvideo = page.acf.homepage_video;
	let reel = page.acf.homepage_reel;
	let muted = true;
	let volume = 0;
	// @ts-ignore

	function playVideo() {
		video.play();
	}

	/**
	 * @type {typeof import("$lib/posts/PostsFeed.svelte").default}
	 */
	let PostsFeed;
	onMount(async () => {
		PostsFeed = (await import('$lib/posts/PostsFeed.svelte')).default;

		if ('IntersectionObserver' in window) {
			const lazyVideoObserver = new IntersectionObserver((entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const videoElement = entry.target;
						const sourceElement = videoElement.querySelector('source');
						if (sourceElement) {
							// @ts-ignore
							sourceElement.src = sourceElement.dataset.src;
							// @ts-ignore
							videoElement.load();
							// @ts-ignore
							videoElement.play();
							observer.unobserve(videoElement);
						}
					}
				});
			});

			const lazyVideo = document.querySelector('video.lazy');
			if (lazyVideo) {
				lazyVideoObserver.observe(lazyVideo);
			}
		}
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.css" />
	<script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js"></script>
	{#key data}
		<SEOHead {data} />
	{/key}
</svelte:head>

<div class="homepage-lead global-lead">
	{#if reel.url}
		<div class="homepage-popup">
			<a data-fancybox href={reel.url} data-preload="false">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
					><path
						d="M24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13V38.13zM56.34 66.35C51.4 63.33 45.22 63.21 40.17 66.04C35.13 68.88 32 74.21 32 80V432C32 437.8 35.13 443.1 40.17 445.1C45.22 448.8 51.41 448.7 56.34 445.7L344.3 269.7C349.1 266.7 352 261.6 352 256C352 250.4 349.1 245.3 344.3 242.3L56.34 66.35z"
					/></svg
				></a
			>
		</div>
	{/if}
	<div class="lead-title">
		<h1>Play Reel</h1>
		<span>Andrew Contreras Gibson</span>
	</div>
	{#if hvideo.url}
		<video
			class="lazy"
			bind:muted
			bind:volume
			bind:this={video}
			on:canplay={playVideo}
			autoplay
			loop
			playsinline
			disablepictureinpicture
			preload="true"
			poster="vlcsnap-2023-05-21-10h53m03s477.jpg"
		>
			<source data-src={hvideo.url} type="video/mp4" />
			Your browser does not support the video tag.
			<track kind="captions" />
		</video>
	{:else}
		do something else
	{/if}
</div>

<Header />

<div class="content">
	<svelte:component
		this={PostsFeed}
		limit={9}
		orderby={'rand'}
		feedClass={'homepage'}
		showCategories="true"
	/>
</div>

<style lang="scss">
	.homepage-lead {
		width: 100vw;
		height: calc(100vh - 70px);
		min-height: calc(100vh - 70px);
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
		.lead-title {
			position: relative;
			z-index: 10;
			h1 {
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
