<script>
	/** @type {import('./$types').PageData} */
	import Category from '$lib/posts/Catgegory.svelte';
	export let data;
</script>

{#key data}
	<Category {data} />
{/key}
