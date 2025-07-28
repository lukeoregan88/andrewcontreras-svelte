<script>
	// @ts-nochec
	import { page } from '$app/stores';
	import Header from '$lib/Header.svelte';
</script>

<Header />

<section class="page-content">
	<div class="entry-content">
		<div class="col">
			<h1 class="text white">{$page.status}: {$page.error?.message}</h1>
		</div>
	</div>
</section>

<style lang="scss">
	.entry-content {
		position: relative;
		min-height: 100vh;
		background: #000;
	}

	.text {
		color: white;
		background: #000;
		font-size: 5em;
		text-align: center;
		z-index: 1;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		font-size: 7rem;
		display: flex;
		align-items: center;
		justify-content: center;
		align-content: center;
		flex-wrap: nowrap;
		flex-direction: row;
		line-height: 0.9;
		pointer-events: none;
		&.white {
			color: #ffffff;
			mix-blend-mode: normal;
		}
	}
</style>
