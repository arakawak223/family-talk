import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyC2NDDh186KLh7Btv7LcNL1Aod_oZ3PPkQ",
  authDomain: "familytalk-bdcc7.firebaseapp.com",
  projectId: "familytalk-bdcc7",
  storageBucket: "familytalk-bdcc7.firebasestorage.app",
  messagingSenderId: "501975430349",
  appId: "1:501975430349:web:786ac0f3fdd477bf91a584",
  measurementId: "G-H05QQ9RRFD"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;