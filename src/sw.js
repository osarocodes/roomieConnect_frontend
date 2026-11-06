import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { clientsClaim } from 'workbox-core';
import { NetworkFirst, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { API_BASE_URL } from './lib/apiConfig';

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

const isApiRequest = ({ url }) =>
    url.origin === API_BASE_URL && url.pathname.startsWith('/api/');

for (const method of ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE']) {
    registerRoute(
        isApiRequest,
        new NetworkOnly({ fetchOptions: { credentials: 'include' } }),
        method
    );
}

self.addEventListener('push', (event) => {
    const data = event.data?.json();
    if (!data) return;

    event.waitUntil(
        self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/favicon_io/android-chrome-192x192.png',
        badge: '/favicon_io/android-chrome-192x192.png',
        data: { url: data.url },
        })
    );
    });

    self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        const url = event.notification.data?.url || '/';

        for (const client of clientList) {
            if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
            }
        }
        if (clients.openWindow) {
            return clients.openWindow(url);
        }
        })
    );
});

registerRoute(
    ({ url }) => url.origin === 'https://res.cloudinary.com',
    new NetworkFirst({
        cacheName: 'cloudinary-images',
        networkTimeoutSeconds: 3,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
        ],
    })
);