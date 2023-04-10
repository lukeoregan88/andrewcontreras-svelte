<script>
	export let data = undefined;
	export let post = undefined;

	// @ts-ignore
	let page = data ? data.data[0] : post;

	// @ts-ignore
	const url = page.yoast_head;
	const regex = /(https:\/\/wp-admin\.andrewcontreras\.com\/)(?!wp-content\/uploads)/g;
	const replacedUrl = url.replace(regex, 'https://andrewcontreras.com/');
</script>

{@html replacedUrl}
