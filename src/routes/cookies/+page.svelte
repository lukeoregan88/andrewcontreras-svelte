<script>
	/** @type {import('./$types').PageData} */
	import Header from '$lib/Header.svelte';
	import SEOHead from '$lib/components/SEOheader.svelte';
	export let data;
	const page = data.data[0];
</script>

<svelte:head>
	{#key data}
		<SEOHead {data} />
	{/key}
</svelte:head>

<Header />

<section class="page-content">
	<div class="entry-content">
		<div class="col">
			<h1>{@html page.title.rendered}</h1>
			{@html page.content.rendered}
		</div>
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
