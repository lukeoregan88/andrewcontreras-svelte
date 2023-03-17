<script>
	/** @type {import('./$types').PageData} */
	import Header from '$lib/Header.svelte';
	export let data;
	const page = data.data[0];
</script>

<Header />

{JSON.stringify(page)}
