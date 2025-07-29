<script>
	// @ts-nochec
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Header from '$lib/Header.svelte';

	// Add retry functionality
	function retry() {
		goto(window.location.pathname);
	}

	// Add performance monitoring
	if (typeof window !== 'undefined') {
		// Report error to analytics if available
		console.error('Page error:', $page.status, $page.error?.message);
	}
</script>

<Header />

<section class="page-content">
	<div class="entry-content">
		<div class="col">
			<h1 class="text white">{$page.status}: {$page.error?.message}</h1>
			{#if $page.status >= 500}
				<button class="retry-btn" on:click={retry}>Retry</button>
			{/if}
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

	.retry-btn {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		background: #ffffff;
		color: #000000;
		border: none;
		padding: 1rem 2rem;
		font-size: 1.2rem;
		cursor: pointer;
		z-index: 2;
		border-radius: 4px;
		transition: background-color 0.3s ease;

		&:hover {
			background: #f0f0f0;
		}
	}
</style>
