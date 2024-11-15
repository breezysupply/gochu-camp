import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export const incrementVisitorCount = async () => {
  const counterRef = doc(db, 'statistics', 'visitors');
  
  try {
    const docSnap = await getDoc(counterRef);
    
    if (!docSnap.exists()) {
      // Initialize counter if it doesn't exist
      await setDoc(counterRef, { count: 1 });
      return 1;
    } else {
      // Increment existing counter
      await setDoc(counterRef, { count: increment(1) }, { merge: true });
      const updatedDoc = await getDoc(counterRef);
      return updatedDoc.data()?.count || 0;
    }
  } catch (error) {
    console.error('Error updating visitor count:', error);
    return 0;
  }
};

export { db, auth, storage };
