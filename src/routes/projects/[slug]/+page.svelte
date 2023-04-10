<script>
	/** @type {import('./$types').PageData} */
	import Post from '$lib/posts/post/loadPostItem.svelte';
	export let data;
</script>

{#key data}
	<Post {data} />
{/key}
