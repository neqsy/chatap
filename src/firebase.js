import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByN_ji4H06ugTGVcBMDXao2UKKemFB2ug",
  authDomain: "tpf-chatap.firebaseapp.com",
  projectId: "tpf-chatap",
  storageBucket: "tpf-chatap.appspot.com",
  messagingSenderId: "349643226035",
  appId: "1:349643226035:web:6a500f1a364b4f5aa369c6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
