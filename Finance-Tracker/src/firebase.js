import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config
// Get this from Firebase Console > Project Settings > Your apps > SDK setup and configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQLPaIRmr0Ib_8l-LATAuMlwqwNac-riA",
    authDomain: "supercool-finance-tracker.firebaseapp.com",
    projectId: "supercool-finance-tracker",
    storageBucket: "supercool-finance-tracker.firebasestorage.app",
    messagingSenderId: "1081067838302",
    appId: "1:1081067838302:web:95999b35dbb96c99b68dcf"
};  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
