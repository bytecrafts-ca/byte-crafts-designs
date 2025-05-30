// Service Worker for ByteCraft Designs
// Version: 1.0

const CACHE_NAME = 'bytecraft-v1';
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/photos/byte.webp',
    '/photos/design-illustration.webp',
    '/photos/apex.webp',
    '/manifest.json',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/site.webmanifest',
    '/safari-pinned-tab.svg',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(PRECACHE_URLS)
                .then(() => cache.add(OFFLINE_URL))
                .catch(err => console.log('Failed to cache during install:', err));
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - network with cache fallback
self.addEventListener('fetch', event => {
    // Skip non-GET requests and chrome-extension requests
    if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Handle navigation requests with network-first strategy
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
            .then(response => {
                // Clone the response for the cache
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, responseClone));
                return response;
            })
            .catch(() => {
                // If network fails, try the cache
                return caches.match(event.request)
                    .then(response => response || caches.match(OFFLINE_URL));
            })
        );
        return;
    }

    // For other requests, use cache-first strategy
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Return cached response if found
            if (response) {
                return response;
            }

            // Otherwise fetch from network
            return fetch(event.request)
                .then(networkResponse => {
                    // Cache the response for future requests
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, responseClone));
                    return networkResponse;
                })
                .catch(() => {
                    // If request fails and it's an image, return a fallback image
                    if (event.request.headers.get('accept').includes('image')) {
                        return caches.match('/photos/byte.webp');
                    }
                    return new Response('Offline content unavailable', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
        })
    );
});

// Background sync for failed POST requests
self.addEventListener('sync', event => {
    if (event.tag === 'submit-form') {
        event.waitUntil(handleFormSync());
    }
});

async function handleFormSync() {
    // Implement your form submission retry logic here
    // This would typically check IndexedDB for pending submissions
    console.log('Background sync for form submission');
}

// Periodic updates check
self.addEventListener('periodicsync', event => {
    if (event.tag === 'content-update') {
        event.waitUntil(checkForUpdates());
    }
});

async function checkForUpdates() {
    const cache = await caches.open(CACHE_NAME);
    const requests = PRECACHE_URLS.map(url => new Request(url));

    const responses = await Promise.all(
        requests.map(request => fetch(request).catch(() => null))
    );

    // Update cache with new responses
    await Promise.all(
        responses.map((response, i) => {
            if (response) {
                return cache.put(requests[i], response);
            }
            return Promise.resolve();
        })
    );

    // Optional: notify clients of updates
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({
            type: 'content-updated',
            updated: new Date().toISOString()
        });
    });
}