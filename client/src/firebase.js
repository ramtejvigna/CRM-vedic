// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvRsG2UxJWNE5qf-7ujPDAiQKuHy_Lh6U",
  authDomain: "crm-vedic.firebaseapp.com",
  projectId: "crm-vedic",
  storageBucket: "crm-vedic.appspot.com",
  messagingSenderId: "541618238094",
  appId: "1:541618238094:web:c56b2272b17d5f99e40fdf",
  measurementId: "G-QHR186YGT3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const analytics = getAnalytics(app);



