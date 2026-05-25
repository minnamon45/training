// ================= Firebase Imports =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ================= Firebase Config =================
  const firebaseConfig = {
    apiKey: "AIzaSyA_P5crHXs4XvZVl73n6ikNodLTpsw25mk",
    authDomain: "training-2a75b.firebaseapp.com",
    projectId: "training-2a75b",
    storageBucket: "training-2a75b.firebasestorage.app",
    messagingSenderId: "849904887764",
    appId: "1:849904887764:web:b012d60c77b1851c169841"
  };

// ================= Initialize Firebase =================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ================= Protected Pages =================
const adminOnlyPages = [
    "admin.html"
];


// ================= Check Login =================
onAuthStateChanged(auth, (user) => {

    // لو مش مسجل دخول
    if (!user) {

        window.location.href = "login.html";
        return;
    }

    // ================= Admin Check =================
    const currentPage = window.location.pathname.split("/").pop();

    // ايميل الادمن
    const adminEmail = "mina.gamal.ld@gmail.com";

    if (
        adminOnlyPages.includes(currentPage) &&
        user.email !== adminEmail
    ) {

        alert("ليس لديك صلاحية الوصول");

        window.location.href = "index.html";
    }

});