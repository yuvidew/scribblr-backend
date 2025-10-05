// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEsu5V9aOSbAvbfKFqjIsNnqAUTNP7gZE",
  authDomain: "scribblr-3daf3.firebaseapp.com",
  projectId: "scribblr-3daf3",
  storageBucket: "scribblr-3daf3.firebasestorage.app",
  messagingSenderId: "560984573381",
  appId: "1:560984573381:web:184ef355bdc344fdad37ac",
  measurementId: "G-CS7188SXS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);