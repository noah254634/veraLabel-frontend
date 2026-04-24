importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// .env variables don't work easily here, so hardcoding these public keys is standard.
firebase.initializeApp({
  apiKey: "AIzaSyBujmFkHQnBdRO_iLy7MVkgqeJ3Ex1yoVc",
  projectId: "veralabel-3e5f2",
  messagingSenderId: "322291755702",
  appId: "1:322291755702:web:93e5a21bd1e669d877d417",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background Message received: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png', // Path to your logo in the public folder
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});