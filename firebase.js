// firebase.js (MODULAR ONLY)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA_P5crHXs4XvZVl73n6ikNodLTpsw25mk",
    authDomain: "training-2a75b.firebaseapp.com",
    projectId: "training-2a75b",
    storageBucket: "training-2a75b.appspot.com",
    messagingSenderId: "849904887764",
    appId: "1:849904887764:web:b012d60c77b1851c169841"
};

const app = initializeApp(firebaseConfig);

// Singletons
export const auth = getAuth(app);
export const db = getFirestore(app);
