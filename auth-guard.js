// auth-guard.js - بدون flicker, بدون reinitialization, بدون loops

import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const PUBLIC_PAGES = ["login.html", "register.html"];
let isRedirecting = false;

// عدم إخفاء الصفحة تماماً – استخدام overlay خفيف أو عدم إخفاء
// سنستخدم readyState للتأكد من أن DOM جاهز

onAuthStateChanged(auth, (user) => {
    if (isRedirecting) return;
    
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const isPublic = PUBLIC_PAGES.includes(currentPage);
    
    if (!user && !isPublic) {
        isRedirecting = true;
        window.location.href = "login.html";
        return;
    }
    
    if (user && isPublic) {
        isRedirecting = true;
        window.location.href = "index.html";
        return;
    }
    
    // تخزين المستخدم بشكل آمن
    if (user) {
        window.__currentUser = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified
        };
    }
    
    // إزالة أي hiding سابق
    document.documentElement.style.removeProperty("visibility");
});
