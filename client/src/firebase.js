import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-redux.firebaseapp.com",
  projectId: "mern-auth-redux",
  storageBucket: "mern-auth-redux.appspot.com",
  messagingSenderId: "452625886443",
  appId: "1:452625886443:web:cbebb1f13b4c39ee7ba2ae",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  // ✅ Export auth instance
export const googleProvider = new GoogleAuthProvider();  // ✅ Export Google Provider
