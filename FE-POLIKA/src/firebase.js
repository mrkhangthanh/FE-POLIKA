// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Cấu hình Firebase của bạn (lấy từ Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyC56JvO6DkRWHTXDXZ2Qup2h_6k-37M_iE",
    authDomain: "heclava-2164f.firebaseapp.com",
    projectId: "heclava-2164f",
    storageBucket: "heclava-2164f.firebasestorage.app",
    messagingSenderId: "556846711810",
    appId: "1:556846711810:web:0b63f7a5261b8be888931b",
    measurementId: "G-WC5PX555M8"
  };

// Khởi tạo Firebase App
const app = initializeApp(firebaseConfig);

// Khởi tạo Messaging
const messaging = getMessaging(app);

// Hàm lấy FCM token
export const getFcmToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BDRPMWT_4KJmVfvKQ3bY6hLw7ETWyv_oW8f3qDz_XvVCqjJ0mPaWNNwBx3wRFITENEIibNEGcJWsK3tF9GWdbbI", // Lấy VAPID key từ Firebase Console (trong Cloud Messaging settings)
    });
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Lắng nghe thông báo khi ứng dụng đang chạy
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };