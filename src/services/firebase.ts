// Configuración de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
    apiKey: "AIzaSyALFo6F8YanMQ47jV0dQC-j21xwmf3XyuQ",
    authDomain: "hifiac-633b1.firebaseapp.com",
    projectId: "hifiac-633b1",
    storageBucket: "hifiac-633b1.firebasestorage.app",
    messagingSenderId: "1099190647173",
    appId: "1:1099190647173:web:d62fb103bd9ff42be52cec"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app; 