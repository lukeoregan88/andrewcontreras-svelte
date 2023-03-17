<script>
	/** @type {import('./$types').PageData} */
	import { onMount } from 'svelte';
	import Header from '$lib/Header.svelte';
	import { goBackOrHomepage } from '$lib/components/history.js';
	export let data;
	let { post } = data;
	post = post[0];
	/**
	 * @type {typeof import("$lib/posts/PostsFeed.svelte").default}
	 */
	let PostsFeed;
	/**
	 * @type {string | null | undefined}
	 */
	let projectVideo = undefined;

	onMount(async () => {
		PostsFeed = (await import('$lib/posts/PostsFeed.svelte')).default;

		if (post.acf.posts__video_embed != null) {
			const postsVideoEmbed = post.acf.posts__video_embed;
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = postsVideoEmbed;
			// @ts-ignore
			projectVideo = tempDiv.querySelector('a').getAttribute('href') + '?start=1';
		}
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.css" />
	<script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js"></script>
</svelte:head>

<article>
	<div class="project-cover">
		<button class="video-goback" on:click={goBackOrHomepage}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
				><path
					d="M505 273c9.4-9.4 9.4-24.6 0-33.9L377 111c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l87 87L184 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l246.1 0-87 87c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L505 273zM168 80c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 32C39.4 32 0 71.4 0 120L0 392c0 48.6 39.4 88 88 88l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l80 0z"
				/></svg
			>
		</button>
		{#if post.acf.posts__video_embed}
			<div class="video-popup">
				<a data-fancybox data-type="iframe" href={projectVideo} data-preload="false">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
						><path
							d="M24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13V38.13zM56.34 66.35C51.4 63.33 45.22 63.21 40.17 66.04C35.13 68.88 32 74.21 32 80V432C32 437.8 35.13 443.1 40.17 445.1C45.22 448.8 51.41 448.7 56.34 445.7L344.3 269.7C349.1 266.7 352 261.6 352 256C352 250.4 349.1 245.3 344.3 242.3L56.34 66.35z"
						/></svg
					></a
				>
			</div>
		{/if}
		{#if post._embedded['wp:featuredmedia']}
			<div class="poster">
				<img
					src={post._embedded['wp:featuredmedia'][0].media_details.sizes.large.source_url}
					alt={post._embedded['wp:featuredmedia'][0].alt_text}
					loading="lazy"
				/>
			</div>
		{/if}
		<div class="project-details">
			<div class="project-details__inner">
				<div class="project-details__title">
					<h1>{@html post.title.rendered}</h1>
				</div>
				{#if post.acf.posts__client}
					<div class="project-details__client">
						<h3>{@html post.acf.posts__client}</h3>
					</div>
				{/if}

				<div class="project-details__description">
					<p>{@html post.excerpt.rendered}</p>
				</div>
			</div>
		</div>
	</div>

	<Header />

	<div class="project-info">
		<div class="col col--left">
			<div class="description">
				<h2 class="info-title">{@html post.title.rendered}</h2>
				<div class="about">
					<div class="lang--en">
						{@html post.content.rendered}
					</div>
				</div>
			</div>
		</div>
		<div class="col col--right">
			{#if post._embedded['wp:featuredmedia']}
				<div class="featured-image">
					<img
						src={post._embedded['wp:featuredmedia'][0].media_details.sizes.large.source_url}
						alt={post._embedded['wp:featuredmedia'][0].alt_text}
						loading="lazy"
					/>
				</div>
			{/if}
		</div>
	</div>
	<div class="similar">
		<div class="content">
			<svelte:component this={PostsFeed} limit={2} exclude={post.id} orderby={'rand'} />
		</div>
	</div>
</article>

<style lang="scss">
	.project-cover {
		min-height: 1000px;
		height: calc(100vh - 54px);
		width: 100%;
		position: relative;
		padding: 2rem;
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		justify-content: flex-end;
		padding-bottom: calc(2rem + 100px);
		gap: 2rem;
		.poster {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			img {
				width: 100%;
				transform: translate(-50%, -50%);
				top: 50%;
				left: 50%;
				position: absolute;
				object-fit: cover;
				height: 100%;
				@media (min-width: 1200px) {
					width: 100%;
				}
			}
			&:before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%);
				z-index: 1;
			}
		}
		.video-goback {
			//position: absolute;
			//top: 2rem;
			//right: 2rem;
			z-index: 20;
			aspect-ratio: 1;
			width: 25px;
			padding: 0;
			outline: none;
			box-shadow: none;
			border: none;
			background: transparent;
			align-self: flex-end;
			svg {
				fill: #fff;
			}
		}
		.video-popup {
			//position: absolute;
			z-index: 30;
			top: 0;
			left: 0;
			display: flex;
			aspect-ratio: 1;
			width: 100%;
			justify-content: center;
			align-items: center;
			height: 100%;
			svg {
				fill: #fff;
				width: 100px;
			}
		}
		.project-details {
			position: relative;
			z-index: 10;
			width: min(100%, 1000px);
			.project-details__title {
				h1 {
					font-size: 3.5rem;
					color: #fff;
					margin: 0;
					text-transform: uppercase;
					text-shadow: 2px 2px 15px rgba(0, 0, 0, 0.5);
				}
			}
			.project-details__client {
				h3 {
					font-size: 4rem;
					color: #fff;
					margin: 0;
					font-family: 'Sassy Frass', cursive;
					line-height: 3rem;
					text-shadow: 2px 2px 15px rgba(0, 0, 0, 0.5);
				}
			}
			.project-details__description {
				margin-top: 20px;
			}
		}
	}
	.project-info {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: stretch;
		margin: 0 auto;
		width: 100%;
		display: none;
		.col {
			width: 50%;
			&--left {
				padding: 2rem;
			}
			&--right {
				.featured-image {
					width: 100%;
					height: 100%;
					position: relative;
					overflow: hidden;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					aspect-ratio: 16/9;
					img {
						position: absolute;
						width: 100%;
						height: 100%;
						object-fit: cover;
						top: 0;
						left: 0;
					}
				}
			}
		}
	}
</style>
