/**
 * Service Worker
 * 
 * Enables PWA functionality including:
 * - Offline support
 * - Asset caching
 * - Background sync (future enhancement)
 * 
 * @package Portal Jemaat GKI Raha
 * @author GKI Raha Portal Development Team
 */

// Only activate service worker in production
const isDevelopment = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

if (isDevelopment) {
    console.log('[Service Worker] Development mode - SW disabled');
    // Unregister service worker in development
    self.addEventListener('install', () => {
        self.skipWaiting();
    });
    self.addEventListener('activate', () => {
        self.clients.claim();
    });
    // Don't cache anything in development
    self.addEventListener('fetch', (event) => {
        return;
    });
} else {
    // Production service worker code
    const CACHE_NAME = 'gkiraha-portal-v1';
    const urlsToCache = [
        '/',
        '/manifest.json',
    ];

/**
 * Install Event
 * 
 * Triggered when service worker is first installed.
 * Caches essential assets for offline use.
 */
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('[Service Worker] Installed successfully');
                // Force the waiting service worker to become the active service worker
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

/**
 * Activate Event
 * 
 * Triggered when service worker becomes active.
 * Cleans up old caches.
 */
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old caches
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activated successfully');
                // Claim all clients immediately
                return self.clients.claim();
            })
    );
});

/**
 * Fetch Event
 * 
 * Intercepts network requests.
 * Implements cache-first strategy for assets.
 * Network-first strategy for API calls.
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // Network-first strategy for API calls
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone the response before caching
                    const responseToCache = response.clone();
                    
                    // Cache successful responses
                    if (response.ok) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    
                    return response;
                })
                .catch(() => {
                    // Return cached response if available
                    return caches.match(request);
                })
        );
        return;
    }

    // Cache-first strategy for static assets
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached response if available
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise, fetch from network
                return fetch(request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clone the response before caching
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('[Service Worker] Fetch failed:', error);
                        
                        // Return offline page if available
                        return caches.match('/');
                    });
            })
    );
});

/**
 * Message Event
 * 
 * Handles messages from clients.
 * Can be used for skip waiting, cache updates, etc.
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

} // End of production service worker