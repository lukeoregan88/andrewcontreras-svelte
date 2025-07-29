// Enhanced service worker with caching strategies
const CACHE_NAME = 'andrew-contreras-v1';
const STATIC_ASSETS = ['/', '/favicon.ico', '/favicon.png', '/placeholder.png'];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(STATIC_ASSETS))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== CACHE_NAME) {
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	// Cache static assets with network-first strategy
	if (
		event.request.destination === 'image' ||
		event.request.destination === 'style' ||
		event.request.destination === 'script'
	) {
		event.respondWith(
			caches.match(event.request).then((response) => {
				return (
					response ||
					fetch(event.request).then((response) => {
						// Cache successful responses
						if (response.status === 200) {
							const responseClone = response.clone();
							caches.open(CACHE_NAME).then((cache) => {
								cache.put(event.request, responseClone);
							});
						}
						return response;
					})
				);
			})
		);
	}
});
