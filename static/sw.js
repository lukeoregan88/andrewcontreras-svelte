// Enhanced service worker with advanced caching strategies
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

const STATIC_ASSETS = ['/', '/favicon.ico', '/favicon.png', '/placeholder.png'];

// Cache strategies
const CACHE_STRATEGIES = {
	// Cache first for static assets
	cacheFirst: async (request) => {
		const cache = await caches.open(STATIC_CACHE);
		const cachedResponse = await cache.match(request);

		if (cachedResponse) {
			return cachedResponse;
		}

		try {
			const networkResponse = await fetch(request);
			if (networkResponse.status === 200) {
				cache.put(request, networkResponse.clone());
			}
			return networkResponse;
		} catch (error) {
			return new Response('Network error', { status: 408 });
		}
	},

	// Network first for API calls
	networkFirst: async (request) => {
		try {
			const networkResponse = await fetch(request);
			if (networkResponse.status === 200) {
				const cache = await caches.open(DYNAMIC_CACHE);
				cache.put(request, networkResponse.clone());
			}
			return networkResponse;
		} catch (error) {
			const cachedResponse = await caches.match(request);
			if (cachedResponse) {
				return cachedResponse;
			}
			return new Response('Network error', { status: 408 });
		}
	}
};

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(STATIC_CACHE)
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
						if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') {
		return;
	}

	// Skip chrome-extension and other non-http requests
	if (!url.protocol.startsWith('http')) {
		return;
	}

	// Cache strategy based on request type
	if (
		request.destination === 'image' ||
		request.destination === 'style' ||
		request.destination === 'script' ||
		request.destination === 'font'
	) {
		// Static assets - cache first
		event.respondWith(CACHE_STRATEGIES.cacheFirst(request));
	} else if (url.pathname.includes('/api/') || url.pathname.includes('wp-json/')) {
		// API calls - network first
		event.respondWith(CACHE_STRATEGIES.networkFirst(request));
	} else {
		// HTML pages - network first with short cache
		event.respondWith(CACHE_STRATEGIES.networkFirst(request));
	}
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
	if (event.tag === 'background-sync') {
		event.waitUntil(doBackgroundSync());
	}
});

async function doBackgroundSync() {
	// Implement background sync logic here
	console.log('Background sync triggered');
}
