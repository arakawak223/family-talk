import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// 本番環境用Firebase設定
// Firebase Console > Project Settings > General から取得
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id" // Analytics用（オプション）
};

// Firebase初期化
const app = initializeApp(firebaseConfig);

// サービスの初期化
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// 開発環境でのエミュレーター接続（本番環境では使用しない）
if (__DEV__ && !auth.emulatorConfig) {
  // 開発環境でエミュレーターを使用する場合のみ
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199);
}

export default app;