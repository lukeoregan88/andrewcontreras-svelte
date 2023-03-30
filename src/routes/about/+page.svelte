<script>
	/** @type {import('./$types').PageData} */
	import Header from '$lib/Header.svelte';
	export let data;
	const page = data.data[0];
</script>

<svelte:head>
	{@html page.yoast_head}
</svelte:head>

<Header />

<section class="page-content">
	<div class="entry-content">
		<div class="col col-60">
			<h1>{@html page.title.rendered}</h1>
			{@html page.content.rendered}
		</div>
		<div class="col col-40">&nbsp;</div>
	</div>
</section>

<style lang="scss">
	h1 {
		font-size: 1em;
		text-transform: uppercase;
		opacity: 0.25;
		display: none;
	}
</style>
