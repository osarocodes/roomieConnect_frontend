const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
};

export const subscribeToPushNotifications = async (axiosInstance) => {
    try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

        const registration = await navigator.serviceWorker.ready;

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
        });

        await axiosInstance.post('/notifications/subscribe', { subscription });
        console.log('Push subscription saved');
    } catch (error) {
        console.error('Push subscription failed:', error);
    }
};