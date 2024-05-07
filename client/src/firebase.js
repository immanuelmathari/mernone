// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_APP_KEY,
  apiKey: "AIzaSyDl5zBoiOkK8NxMCefP5zcP0_Bv15hEMP4",
  authDomain: "mernone-e1515.firebaseapp.com",
  projectId: "mernone-e1515",
  storageBucket: "mernone-e1515.appspot.com",
  messagingSenderId: "88608911876",
  appId: "1:88608911876:web:7ac6c917f9ae9d2a46bb51",
  measurementId: "G-VR9EYVXF5S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);