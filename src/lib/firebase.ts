import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // These would normally come from environment variables
  // For demo purposes, using placeholder values
  apiKey: "demo-api-key",
  authDomain: "undergraduation-crm.firebaseapp.com",
  projectId: "undergraduation-crm",
  storageBucket: "undergraduation-crm.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;