// إخفاء الصفحة لحين التحقق
document.body.style.display = "none";

// التحقق من تسجيل الدخول فقط
firebase.auth().onAuthStateChanged((user) => {

    // المستخدم غير مسجل
    if (!user) {

        window.location.href = "login.html";

        return;
    }

    // المستخدم مسجل
    console.log("✅ Logged in as:", user.email);

    // حفظ المستخدم
    window.currentUser = user;

    // إظهار الصفحة
    document.body.style.display = "block";
});