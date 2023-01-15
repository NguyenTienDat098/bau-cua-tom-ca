// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBB5Eyoerc1KXo2Hpzsu3nggP7ysG2jpc",
  authDomain: "game-f5840.firebaseapp.com",
  projectId: "game-f5840",
  storageBucket: "game-f5840.appspot.com",
  messagingSenderId: "297455911489",
  appId: "1:297455911489:web:2bfaf48f2d0a82aa52fcc0",
  measurementId: "G-T2W7E3CJBH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

//
if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}
exports = { auth, db };
