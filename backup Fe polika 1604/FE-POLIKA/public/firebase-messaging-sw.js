// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Khởi tạo Firebase trong Service Worker
firebase.initializeApp({
    apiKey: "AIzaSyC56JvO6DkRWHTXDXZ2Qup2h_6k-37M_iE",
    authDomain: "heclava-2164f.firebaseapp.com",
    projectId: "heclava-2164f",
    storageBucket: "heclava-2164f.firebasestorage.app",
    messagingSenderId: "556846711810",
    appId: "1:556846711810:web:0b63f7a5261b8be888931b",
    measurementId: "G-WC5PX555M8"
});



const messaging = firebase.messaging();

// Xử lý thông báo khi ứng dụng ở background
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png', // Đường dẫn đến icon (nếu có)
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});