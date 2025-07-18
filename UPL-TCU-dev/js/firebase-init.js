// Firebase Modular SDK v9+
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrSek2rUjOJ25MxQ5cbCmjL1UtkvDmg0s",
  authDomain: "puertolimpio-4d78f.firebaseapp.com",
  projectId: "puertolimpio-4d78f",
  storageBucket: "puertolimpio-4d78f.firebasestorage.app",
  messagingSenderId: "846794283332",
  appId: "1:846794283332:web:32f6244be994cdc85d1f11"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
