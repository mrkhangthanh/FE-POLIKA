
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC56JvO6DkRWHTXDXZ2Qup2h_6k-37M_iE",
    authDomain: "heclava-2164f.firebaseapp.com",
    projectId: "heclava-2164f",
    storageBucket: "heclava-2164f.firebasestorage.app",
    messagingSenderId: "556846711810",
    appId: "1:556846711810:web:0b63f7a5261b8be888931b",
    measurementId: "G-WC5PX555M8"
  };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
// Initialize Firebase

// const analytics = getAnalytics(app);

export { messaging, getToken, onMessage };
