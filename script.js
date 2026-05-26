// ================= Firebase (MODULAR ONLY) =================
import { auth, db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= Global State =================
let appData = null;
let currentUser = null;
let firebaseReady = true;

// ================= Storage Keys =================
const STORAGE_KEYS = {
    USERS: 'training_system_users',
    SECTIONS: 'training_system_sections',
    LINKS: 'training_system_links',
    LAST_ID: 'training_system_lastId'
};

// ================= Default Data =================
function initDefaultData() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
            { id: 1, username: "admin", password: "admin123", role: "admin" }
        ]));
    }
}

// ================= Toast =================
function showToast(msg, error = false) {
    const t = document.createElement('div');
    t.className = 'toast-msg' + (error ? ' error' : '');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

// ================= Escape =================
function escapeHtml(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

// ================= Load Data (HYBRID SAFE) =================
async function loadData() {
    initDefaultData();

    try {
        const [sectionsSnap, linksSnap] = await Promise.all([
            getDocs(collection(db, "sections")),
            getDocs(collection(db, "links"))
        ]);

        const sections = [];
        const links = [];

        sectionsSnap.forEach(d => sections.push({ id: d.id, ...d.data() }));
        linksSnap.forEach(d => links.push({ id: d.id, ...d.data() }));

        appData = {
            sections: sections.map(s => ({
                ...s,
                links: links.filter(l => l.sectionId == s.id)
            }))
        };

        return appData;

    } catch (err) {
        console.error(err);
        showToast("فشل تحميل البيانات", true);
        return { sections: [] };
    }
}

// ================= Navbar =================
async function updateNavbar() {
    const nav = document.getElementById("navLinks");
    if (!nav) return;

    const user = auth.currentUser;
    const email = user?.email || "مستخدم";

    let html = `<span class="user-welcome">👋 ${escapeHtml(email)}</span>`;

    if (appData?.sections) {
        html += `<a href="admin.html" style="background:#2b7a4b;">⚙️ التحكم</a>`;
    }

    html += `<a href="#" onclick="logout()" style="background:#e53e3e;">🚪 خروج</a>`;

    nav.innerHTML = html;
}

// ================= Render =================
function renderSections() {
    const container = document.getElementById("sectionsContainer");
    if (!container || !appData) return;

    container.innerHTML = appData.sections.map(section => `
        <div class="section-card">
            <div class="section-header">
                <div>${section.icon || "📁"}</div>
                <div>
                    <h3>${escapeHtml(section.name)}</h3>
                    <small>${escapeHtml(section.description || "")}</small>
                </div>
            </div>

            <div class="links-list">
                ${(section.links || []).map(link => `
                    <a href="${link.url}" class="link-item" target="_blank">
                        🔗 ${escapeHtml(link.title)}
                    </a>
                `).join("")}
            </div>
        </div>
    `).join("");
}

// ================= Search =================
function searchContent() {
    const input = document.getElementById("searchInput");
    const box = document.getElementById("searchResults");

    const val = input.value.toLowerCase().trim();
    if (val.length < 2) return box.style.display = "none";

    let results = [];

    appData.sections.forEach(s => {
        if (s.name.toLowerCase().includes(val)) {
            results.push({ type: "section", name: s.name });
        }

        s.links.forEach(l => {
            if (l.title.toLowerCase().includes(val)) {
                results.push({ type: "link", name: l.title });
            }
        });
    });

    box.innerHTML = results.map(r => `
        <div class="search-result-item">
            ${r.type === "section" ? "📁" : "🔗"} ${escapeHtml(r.name)}
        </div>
    `).join("");

    box.style.display = "block";
}

// ================= Logout =================
function logout() {
    auth.signOut().then(() => {
        window.location.href = "login.html";
    });
}

// ================= Init =================
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    await loadData();

    document.getElementById("app").innerHTML = `
        <div class="navbar">
            <div class="logo">🎓 النظام</div>
            <div id="navLinks"></div>
        </div>

        <div class="search-container">
            <input id="searchInput" onkeyup="searchContent()" placeholder="بحث..." />
            <div id="searchResults"></div>
        </div>

        <div id="sectionsContainer"></div>
    `;

    renderSections();
    updateNavbar();

    document.body.style.visibility = "visible";
});

// ================= Export =================
window.searchContent = searchContent;
window.logout = logout;
