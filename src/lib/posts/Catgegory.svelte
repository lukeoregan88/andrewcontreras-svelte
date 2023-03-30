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
</div>

<Header />

<div class="content">
	<svelte:component this={PostsFeed} categories={catgeory.id} exclude={post.id} />
</div>
