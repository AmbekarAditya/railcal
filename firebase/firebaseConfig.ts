import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWa6k1cAHi-LucDU46F8jnnmwK7cTycoI",
  authDomain: "railcal-b5f26.firebaseapp.com",
  projectId: "railcal-b5f26",
  storageBucket: "railcal-b5f26.firebasestorage.app",
  messagingSenderId: "112965385254",
  appId: "1:112965385254:web:1d0d60e5531361a2d8bae7",
  measurementId: "G-9JNN5EMHVQ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
