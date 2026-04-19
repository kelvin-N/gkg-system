import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { auth as demoAuth, db as demoDb } from "./demoFirebase.js";

// Check if we should use demo mode
const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true' ||
                 !import.meta.env.VITE_FIREBASE_API_KEY ||
                 import.meta.env.VITE_FIREBASE_API_KEY === 'your_key';

let auth, db;

if (USE_DEMO) {
  console.log("🔧 Using Demo Firebase for development/testing");
  auth = demoAuth;
  db = demoDb;
} else {
  console.log("🔥 Using Real Firebase");
  // Real Firebase configuration
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db 