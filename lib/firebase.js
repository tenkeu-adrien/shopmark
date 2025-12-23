import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
     apiKey: "AIzaSyDlShEEiqTC2qzuk1xpptx3CEJBJlqskew",
  authDomain: "criteo-ea902.firebaseapp.com",
  projectId: "criteo-ea902",
  storageBucket: "criteo-ea902.firebasestorage.app",
  messagingSenderId: "489001400290",
  appId: "1:489001400290:web:791a038a521bc15130abbb",
  measurementId: "G-LV6R31KWY8"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);