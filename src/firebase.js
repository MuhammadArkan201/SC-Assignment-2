import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyArcp0rViEkTccpa2aA2mcA5IGL-G-X4EA",
    authDomain: "cashflow-cca76.firebaseapp.com",
    projectId: "cashflow-cca76",
    storageBucket: "cashflow-cca76.appspot.com",
    messagingSenderId: "697569690624",
    appId: "1:697569690624:web:9ca0c5f245d453342004e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };