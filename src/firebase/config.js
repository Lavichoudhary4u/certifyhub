import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcUthRP5h1ezzCHg1bRNUl5EVSFcuSQEg",
  authDomain: "certifyhub-51e88.firebaseapp.com",
  projectId: "certifyhub-51e88",
  storageBucket: "certifyhub-51e88.firebasestorage.app",
  messagingSenderId: "247111514980",
  appId: "1:247111514980:web:fe413db423114967689871"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;