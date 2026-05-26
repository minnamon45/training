import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const admins = [
    "admin@test.com",
    "mina@test.com"
];

document.documentElement.style.visibility = "hidden";

onAuthStateChanged(auth, (user) => {

    if (!user) {
        location.href = "login.html";
        return;
    }

    if (!admins.includes(user.email)) {
        location.href = "index.html";
        return;
    }

    document.documentElement.style.visibility = "visible";
});
