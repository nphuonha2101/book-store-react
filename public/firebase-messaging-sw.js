importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

// Khởi tạo Firebase App
firebase.initializeApp({
    apiKey: "AIzaSyC-D208X-of1kaPoxuav6Uomu93YHk_ZZc",
    authDomain: "nha03-a2ab5.firebaseapp.com",
    projectId: "nha03-a2ab5",
    storageBucket: "nha03-a2ab5.appspot.com",
    messagingSenderId: "1029515674999",
    appId: "1:1029515674999:web:1f8a2c88c3c09e6bb40d72",
});

const messaging = firebase.messaging();

// Lắng nghe background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.ts] Received background message ', payload);

    const notificationTitle = payload.notification?.title || 'Thông báo';
    const notificationOptions = {
        body: payload.notification?.body,
        icon: '/logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
