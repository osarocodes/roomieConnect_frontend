import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core'

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

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