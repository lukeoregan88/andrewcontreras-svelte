<script>
	import { onMount } from 'svelte';
	import Header from '$lib/Header.svelte';

	export let data;

	let post = data.data[0];
	let catgeory = data.category[0];
	console.log(catgeory);
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
</script>

<svelte:head>
	<title>{catgeory.yoast_head_json.title}</title>
	<meta name="description" content={catgeory.yoast_head_json.description} />
</svelte:head>

<div class="category-lead">
	<div style="display: none;">
		<h1>{@html catgeory.name}</h1>
		<span>{@html catgeory.description}</span>
	</div>

	<h2>{@html post.title.rendered}</h2>
	{#if post.acf.posts__client}
		<h3>{@html post.acf.posts__client}</h3>
	{/if}
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
	<!-- {#if reel.url}
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
		<h1>Play The Reel</h1>
		<span>Andrew Contreras Gibson</span>
	</div>
	{#if hvideo.url}
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
			<source src={hvideo.url} type="video/mp4" />
			Your browser does not support the video tag.
			<track kind="captions" />
		</video>
	{:else}
		do something else
	{/if} -->
</div>

<Header />

<div class="content">
	<svelte:component this={PostsFeed} categories={catgeory.id} exclude={post.id} />
</div>
