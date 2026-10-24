import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAqnxmQiZIF3IWsG0n18g57EEwomE90kQ4",
  authDomain: "feyntech-allowance-calculator.firebaseapp.com",
  projectId: "feyntech-allowance-calculator",
  storageBucket: "feyntech-allowance-calculator.appspot.com",
  messagingSenderId: "142052743063",
  appId: "1:142052743063:android:775e568384aa6f90a196d2",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
