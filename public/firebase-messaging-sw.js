// Firebase compat SDK — must match the major version used in the app (v12)
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js');

// .env variables are not available in service workers — hardcode public keys only (safe to expose)
firebase.initializeApp({
  apiKey: "AIzaSyBujmFkHQnBdRO_iLy7MVkgqeJ3Ex1yoVc",
  projectId: "veralabel-3e5f2",
  messagingSenderId: "322291755702",
  appId: "1:322291755702:web:93e5a21bd1e669d877d417",
});

const messaging = firebase.messaging();

// BroadcastChannel lets the SW talk to any open app tab
const channel = new BroadcastChannel('fcm-background');

// Handle messages when the app is in the background or closed
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background Message received: ', payload);

  const notificationTitle = payload.notification?.title ?? 'New notification';
  const notificationBody  = payload.notification?.body  ?? '';

  const notificationOptions = {
    body: notificationBody,
    icon: '/apple-touch-icon.png',
    badge: '/apple-touch-icon-rounded.png',
    tag: payload.collapseKey ?? 'veralabel-notification',
    data: payload.data ?? {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  // ── Bridge to the app ──────────────────────────────────────────────────────
  // Post to any open tab so the notification store gets updated even when the
  // notification arrived while the tab was in the background.
  channel.postMessage({
    type: 'FCM_BACKGROUND',
    title: notificationTitle,
    body: notificationBody,
    notificationId: payload.data?.notificationId,
  });
});

// Open/focus the app window when a notification is clicked
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});