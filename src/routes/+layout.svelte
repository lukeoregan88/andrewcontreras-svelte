<script>
	import '../app.scss';
	import Footer from '$lib/Footer.svelte';
	import { onMount } from 'svelte';

	// Performance optimisations
	onMount(() => {
		// Register service worker for caching
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.then((registration) => {
					console.log('SW registered: ', registration);
				})
				.catch((registrationError) => {
					console.log('SW registration failed: ', registrationError);
				});
		}

		// Preload critical resources
		const criticalImages = ['/favicon.png', '/placeholder.png'];
		criticalImages.forEach((src) => {
			const link = document.createElement('link');
			link.rel = 'preload';
			link.as = 'image';
			link.href = src;
			document.head.appendChild(link);
		});
	});
</script>

<main class="main-container">
	<slot />
</main>

<Footer />
