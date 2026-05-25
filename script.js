// ========== استخدام Firebase من المتغيرات العامة (بدون إعادة تهيئة) ==========
// Firebase يتم تهيئته في كل صفحة HTML وليس هنا
let db = window.db || null;
let firebaseReady = window.firebaseReady || false;

if (firebaseReady) {
    console.log('✅ Firebase is ready in script.js');
} else {
    console.log('⚠️ Firebase not available, using localStorage only');
}

// ========== المتغيرات العامة ==========
let appData = null;
let currentUser = null;

// ========== مفاتيح التخزين في localStorage ==========
const STORAGE_KEYS = {
    USERS: 'training_system_users',
    SECTIONS: 'training_system_sections',
    LINKS: 'training_system_links',
    LAST_ID: 'training_system_lastId'
};

// ========== تهيئة البيانات الافتراضية ==========
function initDefaultData() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const defaultUsers = [
            { id: 1, username: "admin", password: "admin123", role: "admin" },
            { id: 2, username: "user1", password: "123456", role: "user" }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.SECTIONS)) {
        const defaultSections = [
            { id: 1, name: "معلومات الموظفين", icon: "👥", description: "جميع بيانات الموظفين" },
            { id: 2, name: "سجل تدريب الموظف", icon: "📚", description: "تسجيل التدريبات السابقة" },
            { id: 3, name: "تقرير التدريبات", icon: "📊", description: "تقارير التدريبات المنفذة" },
            { id: 4, name: "تسجيل أتندنس التدريب", icon: "✅", description: "حضور وانصراف المتدربين" },
            { id: 5, name: "الموظفين المطلوب حضورهم التدريب", icon: "📋", description: "قوائم الحضور الإلزامي" },
            { id: 6, name: "التقرير اليومي", icon: "📅", description: "التقارير اليومية للتدريب" },
            { id: 7, name: "خطة التدريب On Job", icon: "💼", description: "التدريب أثناء العمل" },
            { id: 8, name: "خطة التدريب Off Job", icon: "🏫", description: "التدريب خارج العمل" }
        ];
        localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(defaultSections));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.LINKS)) {
        const defaultLinks = [
            { id: 101, sectionId: 1, title: "سجل الموظفين", url: "#", type: "internal", views: 0, pinned: true },
            { id: 102, sectionId: 1, title: "بطاقات التعريف", url: "#", type: "internal", views: 0, pinned: false },
            { id: 201, sectionId: 2, title: "سجل التدريب السنوي", url: "#", type: "internal", views: 0, pinned: true }
        ];
        localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(defaultLinks));
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.LAST_ID)) {
        localStorage.setItem(STORAGE_KEYS.LAST_ID, JSON.stringify({ section: 9, link: 202 }));
    }
}

// ========== دوال Firebase (معدلة لاستخدام المتغيرات العامة) ==========
async function saveToFirebase(collectionName, data) {
    if (!firebaseReady || !db) {
        console.log('Firebase not available, saving to localStorage only');
        return false;
    }
    
    try {
        if (Array.isArray(data)) {
            for (const item of data) {
                if (item.id) {
                    await db.collection(collectionName).doc(item.id.toString()).set(item);
                }
            }
        } else if (data.id) {
            await db.collection(collectionName).doc(data.id.toString()).set(data);
        } else if (typeof data === 'object') {
            // للبيانات التي ليس لها id (مثل training data)
            const docId = new Date().toISOString();
            await db.collection(collectionName).doc(docId).set(data);
        }
        console.log(`✅ Saved to Firebase: ${collectionName}`);
        return true;
    } catch (error) {
        console.error(`❌ Firebase save error (${collectionName}):`, error);
        return false;
    }
}

async function loadFromFirebase(collectionName) {
    if (!firebaseReady || !db) {
        console.log('Firebase not available, using localStorage');
        return null;
    }
    
    try {
        const snapshot = await db.collection(collectionName).get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        console.log(`✅ Loaded from Firebase: ${collectionName} (${data.length} items)`);
        return data;
    } catch (error) {
        console.error(`❌ Firebase load error (${collectionName}):`, error);
        return null;
    }
}

// ========== المزامنة الكاملة ==========
async function syncAllToFirebase() {
    if (!firebaseReady) {
        showToast('❌ Firebase غير متصل، يرجى تحديث الصفحة', true);
        return false;
    }
    
    showToast('🔄 جاري المزامنة مع السحاب...');
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const sections = JSON.parse(localStorage.getItem(STORAGE_KEYS.SECTIONS) || '[]');
    const links = JSON.parse(localStorage.getItem(STORAGE_KEYS.LINKS) || '[]');
    const employees = JSON.parse(localStorage.getItem('hr_employees_data') || '[]');
    const offJob = JSON.parse(localStorage.getItem('training_data_offjob') || '{}');
    const onJob = JSON.parse(localStorage.getItem('training_data_onjob') || '{}');
    
    try {
        await saveToFirebase('users', users);
        await saveToFirebase('sections', sections);
        await saveToFirebase('links', links);
        await saveToFirebase('employees', employees);
        await saveToFirebase('training_offjob', offJob);
        await saveToFirebase('training_onjob', onJob);
        
        showToast('✅ تم حفظ جميع البيانات في السحاب بنجاح');
        return true;
    } catch (error) {
        showToast('❌ فشل حفظ البيانات في السحاب', true);
        return false;
    }
}

async function loadAllFromFirebase() {
    if (!firebaseReady) {
        showToast('❌ Firebase غير متصل', true);
        return false;
    }
    
    if (!confirm('⚠️ تحميل البيانات من السحاب سيستبدل البيانات الحالية. هل أنت متأكد؟')) {
        return false;
    }
    
    showToast('🔄 جاري تحميل البيانات من السحاب...');
    
    try {
        const [users, sections, links, employees, offJob, onJob] = await Promise.all([
            loadFromFirebase('users'),
            loadFromFirebase('sections'),
            loadFromFirebase('links'),
            loadFromFirebase('employees'),
            loadFromFirebase('training_offjob'),
            loadFromFirebase('training_onjob')
        ]);
        
        if (users && users.length) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        if (sections && sections.length) localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
        if (links && links.length) localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
        if (employees && employees.length) localStorage.setItem('hr_employees_data', JSON.stringify(employees));
        if (offJob && offJob.length) localStorage.setItem('training_data_offjob', JSON.stringify(offJob[0]));
        if (onJob && onJob.length) localStorage.setItem('training_data_onjob', JSON.stringify(onJob[0]));
        
        showToast('✅ تم تحميل البيانات من السحاب بنجاح');
        setTimeout(() => window.location.reload(), 1000);
        return true;
    } catch (error) {
        showToast('❌ فشل تحميل البيانات من السحاب', true);
        return false;
    }
}

// ========== تحميل جميع البيانات ==========
async function loadData() {
    initDefaultData();
    
    const sections = JSON.parse(localStorage.getItem(STORAGE_KEYS.SECTIONS) || '[]');
    const links = JSON.parse(localStorage.getItem(STORAGE_KEYS.LINKS) || '[]');
    const lastId = JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_ID) || '{"section":9,"link":202}');
    
    const sectionsWithLinks = sections.map(section => ({
        ...section,
        links: links.filter(link => link.sectionId === section.id)
    }));
    
    appData = {
        sections: sectionsWithLinks,
        users: JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
        lastId: lastId
    };
    
    return appData;
}

// ========== حفظ البيانات ==========
async function saveData(data) {
    try {
        const sectionsToSave = data.sections.map(({ links, ...section }) => section);
        localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sectionsToSave));
        
        const allLinks = [];
        data.sections.forEach(section => {
            if (section.links) {
                section.links.forEach(link => {
                    allLinks.push({ ...link, sectionId: section.id });
                });
            }
        });
        localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(allLinks));
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
        localStorage.setItem(STORAGE_KEYS.LAST_ID, JSON.stringify(data.lastId));
        
        appData = data;
        showToast('✅ تم حفظ البيانات محلياً');
        
        // مزامنة تلقائية مع Firebase إذا كان متاحاً
        if (firebaseReady) {
            // مزامنة غير متزامنة دون انتظار حتى لا تبطئ العملية
            syncAllToFirebase().catch(console.error);
        }
        
        return true;
    } catch (error) {
        console.error('خطأ في حفظ البيانات:', error);
        showToast('❌ فشل في حفظ البيانات', true);
        return false;
    }
}

// ========== دوال التصدير والاستيراد ==========
async function exportData() {
    const data = await loadData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 تم تصدير النسخة الاحتياطية');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                await saveData(importedData);
                showToast('✅ تم استيراد البيانات بنجاح');
                setTimeout(() => window.location.reload(), 1000);
            } catch (error) { 
                showToast('❌ خطأ في استيراد الملف', true); 
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// ========== باقي الدوال ==========
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    if (isError) toast.classList.add('error');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== تحديث شريط التنقل ==========
function updateNavbar() {
    const navLinks = document.getElementById('navLinks');
    const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    
    if (!navLinks) return;

    if (loggedUser) {
        const roleText = loggedUser.role === 'admin' ? 'أدمن' : 'مستخدم';
        navLinks.innerHTML = `
            <span class="user-welcome">👋 مرحباً ${escapeHtml(loggedUser.username)} (${roleText})</span>
            <a href="employees.html" style="background:#9f7aea; color:white; padding:0.5rem 1rem; border-radius:2rem; text-decoration:none;">👥 الموظفين</a>
            <a href="employee-training.html" style="background:#ed8936; color:white; padding:0.5rem 1rem; border-radius:2rem; text-decoration:none;">📋 سجل تدريب</a>
            <a href="reports.html" style="background:#4299e1; color:white; padding:0.5rem 1rem; border-radius:2rem; text-decoration:none;">📊 التقارير</a>
            <a href="reports-offjob.html" style="background:#4299e1; color:white; padding:0.5rem 1rem; border-radius:2rem; text-decoration:none;">📊 Off Job</a>
            <a href="reports-onjob.html" style="background:#48bb78; color:white; padding:0.5rem 1rem; border-radius:2rem; text-decoration:none;">📊 On Job</a>
            <a href="top-performers.html" style="background:#e53e3e; color:white; padding:0.5rem 1rem; border-radius:2rem; text-decoration:none;">🏆 الأفضل</a>
            ${loggedUser.role === 'admin' ? '<a href="admin.html" style="background:#2b7a4b; color:white; padding:0.5rem 1rem; border-radius:2rem; text-decoration:none;">⚙️ التحكم</a>' : ''}
            <a href="#" onclick="logout()" style="background:#e53e3e; color:white; padding:0.5rem 1rem; border-radius:2rem; text-decoration:none;">🚪 تسجيل خروج</a>
        `;
    } else {
        navLinks.innerHTML = `<a href="login.html" style="background:#1e3a5f; color:white; padding:0.5rem 1rem; border-radius:2rem; text-decoration:none;">🔐 دخول الموظفين</a>`;
    }
}

function logout() {
    sessionStorage.removeItem('loggedUser');
    showToast('👋 تم تسجيل الخروج بنجاح');
    setTimeout(() => window.location.href = 'login.html', 500);
}

async function trackView(sectionId, linkId) {
    if (!appData) await loadData();
    const section = appData.sections.find(s => s.id === sectionId);
    if (section) {
        const link = section.links.find(l => l.id === linkId);
        if (link) {
            link.views = (link.views || 0) + 1;
            await saveData(appData);
        }
    }
}

function renderLinks(links, sectionId) {
    if (!links || links.length === 0) {
        return '<div class="empty-links">📭 لا توجد روابط حالياً</div>';
    }
    
    const sortedLinks = [...links].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    
    return sortedLinks.map(link => `
        <a href="${link.url}" target="_blank" class="link-item ${link.pinned ? 'pinned' : ''}" onclick="trackView(${sectionId}, ${link.id})">
            <div class="link-title">
                <span class="link-icon">${link.pinned ? '📌' : '🔗'}</span>
                <span>${escapeHtml(link.title)}</span>
                ${link.pinned ? '<span class="pinned-badge">مثبت</span>' : ''}
                ${link.views ? `<span class="view-count">👁️ ${link.views}</span>` : ''}
            </div>
        </a>
    `).join('');
}

async function renderSections() {
    const container = document.getElementById('sectionsContainer');
    if (!container) return;
    
    const data = await loadData();
    if (!data || !data.sections) return;
    
    const sections = data.sections;
    
    if (sections.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:2rem;">📭 لا توجد أقسام حالياً</div>';
        return;
    }
    
    container.innerHTML = sections.map(section => `
        <div class="section-card" id="section-${section.id}">
            <div class="section-header">
                <div class="section-icon">${section.icon || '📁'}</div>
                <div>
                    <h3>${escapeHtml(section.name)}</h3>
                    <div class="section-desc">${escapeHtml(section.description || '')}</div>
                </div>
            </div>
            <div class="links-list">
                ${renderLinks(section.links || [], section.id)}
            </div>
        </div>
    `).join('');
}

async function searchContent() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase().trim();
    const resultsDiv = document.getElementById('searchResults');
    
    if (!resultsDiv) return;
    
    if (!searchTerm || searchTerm.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }
    
    const data = await loadData();
    if (!data) return;
    
    const results = [];
    
    data.sections.forEach(section => {
        if (section.name.toLowerCase().includes(searchTerm)) {
            results.push({ type: 'section', name: section.name, id: section.id, icon: section.icon || '📁' });
        }
        section.links.forEach(link => {
            if (link.title.toLowerCase().includes(searchTerm)) {
                results.push({ type: 'link', name: link.title, sectionId: section.id, linkId: link.id, sectionName: section.name });
            }
        });
    });
    
    if (results.length > 0) {
        resultsDiv.innerHTML = results.map(r => `
            <div class="search-result-item" onclick='goToResult(${JSON.stringify(r)})'>
                <span class="search-result-type ${r.type === 'section' ? 'type-section' : 'type-link'}">
                    ${r.type === 'section' ? '📂 قسم' : '🔗 رابط'}
                </span>
                <strong>${escapeHtml(r.name)}</strong>
                ${r.type === 'link' ? `<small> (في قسم: ${escapeHtml(r.sectionName)})</small>` : ''}
            </div>
        `).join('');
        resultsDiv.style.display = 'block';
    } else {
        resultsDiv.innerHTML = '<div class="search-result-item">❌ لا توجد نتائج</div>';
        resultsDiv.style.display = 'block';
    }
}

function goToResult(result) {
    const resultsDiv = document.getElementById('searchResults');
    if (resultsDiv) resultsDiv.style.display = 'none';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    if (result.type === 'section') {
        const element = document.getElementById(`section-${result.id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.style.boxShadow = '0 0 0 3px #2b7a4b';
            setTimeout(() => { element.style.boxShadow = ''; }, 2000);
        }
    }
}

function checkAdminAuth() {
    const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    if (!loggedUser || loggedUser.role !== 'admin') {
        window.location.href = 'index.html';
        return false;
    }
    currentUser = loggedUser;
    return true;
}

// إضافة أزرار Firebase في صفحة admin
function addFirebaseButtonsToAdmin() {
    setTimeout(() => {
        const backupDiv = document.querySelector('.admin-card .backup-buttons');
        if (backupDiv && !document.getElementById('firebaseSyncBtn')) {
            backupDiv.innerHTML += `
                <button id="firebaseSyncBtn" onclick="syncAllToFirebase()" style="background:#4299e1;">☁️ حفظ في السحاب</button>
                <button id="firebaseLoadBtn" onclick="loadAllFromFirebase()" style="background:#9f7aea;">📥 تحميل من السحاب</button>
            `;
        }
    }, 500);
}

// تصدير الدوال للنطاق العام
window.exportData = exportData;
window.importData = importData;
window.searchContent = searchContent;
window.goToResult = goToResult;
window.logout = logout;
window.syncAllToFirebase = syncAllToFirebase;
window.loadAllFromFirebase = loadAllFromFirebase;
window.addFirebaseButtonsToAdmin = addFirebaseButtonsToAdmin;
window.firebaseReady = firebaseReady;
window.saveData = saveData;
window.loadData = loadData;
window.updateNavbar = updateNavbar;
window.renderSections = renderSections;
window.trackView = trackView;