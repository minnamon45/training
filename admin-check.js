<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>لوحة التحكم - نظام إدارة التعليم والتطوير</title>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
    <script src="https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js"></script>
    <script src="cache-manager.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Tajawal', sans-serif; }
        body { background: #edf2f7; }
        
        /* ========== شريط التنقل المتجاوب ========== */
        .navbar {
            background: white;
            padding: 0.8rem 1rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.8rem;
        }
        .logo h2 { color: #1e3a5f; font-size: 1.1rem; }
        .logo span { color: #2b7a4b; }
        .nav-links { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .nav-links a, .nav-links button {
            text-decoration: none;
            padding: 0.4rem 0.8rem;
            border-radius: 2rem;
            font-weight: 500;
            cursor: pointer;
            border: none;
            font-size: 0.75rem;
        }
        .nav-links .home { background: #2b7a4b; color: white; }
        .nav-links .logout { background: #e53e3e; color: white; }
        .refresh-btn { background: #4299e1; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 2rem; cursor: pointer; font-size: 0.7rem; }
        
        /* ========== الحاوية الرئيسية ========== */
        .container { max-width: 1400px; margin: 1rem auto; padding: 0 1rem; }
        
        /* ========== التبويبات المتجاوبة ========== */
        .tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 0.5rem;
            justify-content: center;
        }
        .tab-btn {
            background: transparent;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 0.85rem;
            font-weight: bold;
            cursor: pointer;
            color: #4a5568;
            transition: 0.3s;
        }
        .tab-btn.active { background: linear-gradient(135deg, #1e3a5f, #2b7a4b); color: white; }
        
        .tab-content { display: none; animation: fadeIn 0.3s ease; }
        .tab-content.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        /* ========== البطاقات ========== */
        .admin-card {
            background: white;
            border-radius: 1rem;
            padding: 1rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .admin-card h3 {
            color: #1e3a5f;
            margin-bottom: 0.8rem;
            border-right: 4px solid #2b7a4b;
            padding-right: 0.8rem;
            font-size: 1rem;
        }
        
        /* ========== المدخلات ========== */
        input, select, textarea {
            width: 100%;
            padding: 0.6rem;
            margin: 0.4rem 0;
            border: 2px solid #e2e8f0;
            border-radius: 0.8rem;
            font-size: 0.85rem;
        }
        button {
            background: #2b7a4b;
            color: white;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 0.8rem;
            font-weight: bold;
            cursor: pointer;
            margin-top: 0.5rem;
            transition: 0.2s;
            font-size: 0.85rem;
        }
        button:hover { transform: translateY(-2px); opacity: 0.9; }
        
        /* ========== الجداول المتجاوبة ========== */
        .table-wrapper {
            overflow-x: auto;
            border-radius: 0.8rem;
            -webkit-overflow-scrolling: touch;
        }
        .sections-table, .links-table, .users-table, .materials-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.8rem;
            min-width: 500px;
        }
        .sections-table th, .links-table th, .users-table th, .materials-table th {
            background: linear-gradient(135deg, #1e3a5f, #2b7a4b);
            color: white;
            padding: 8px 6px;
            text-align: center;
            font-size: 0.75rem;
        }
        .sections-table td, .links-table td, .users-table td, .materials-table td {
            padding: 8px 6px;
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
            font-size: 0.7rem;
        }
        .sections-table tr:hover, .links-table tr:hover, .users-table tr:hover, .materials-table tr:hover { background: #f7fafc; }
        .sections-table .icon-cell { font-size: 1.2rem; }
        .sections-table .name-cell { text-align: right; font-weight: 500; }
        .sections-table .desc-cell { text-align: right; color: #4a5568; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sections-table .links-count { background: #e2e8f0; padding: 2px 8px; border-radius: 20px; font-weight: bold; display: inline-block; font-size: 0.7rem; }
        
        /* ========== الأزرار ========== */
        .action-buttons {
            display: flex;
            gap: 0.3rem;
            flex-wrap: wrap;
            justify-content: center;
        }
        .edit-btn, .delete-btn, .pin-btn {
            padding: 0.2rem 0.5rem;
            border-radius: 1rem;
            font-size: 0.65rem;
            border: none;
            cursor: pointer;
            color: white;
        }
        .edit-btn { background: #4299e1; }
        .delete-btn { background: #e53e3e; }
        .pin-btn { background: #ed8936; }
        
        /* ========== النوافذ المنبثقة ========== */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            justify-content: center;
            align-items: center;
            z-index: 1000;
            padding: 1rem;
        }
        .modal-content {
            background: white;
            border-radius: 1rem;
            padding: 1.2rem;
            width: 90%;
            max-width: 450px;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-content h3 {
            font-size: 1rem;
            margin-bottom: 1rem;
        }
        .modal-buttons { display: flex; gap: 0.8rem; margin-top: 1rem; }
        .modal-buttons button { flex: 1; padding: 0.5rem; font-size: 0.8rem; }
        .save-btn { background: #2b7a4b; }
        .cancel-btn { background: #a0aec0; }
        
        /* ========== الشارات والإحصائيات ========== */
        .stats-badge {
            display: inline-block;
            background: #e2e8f0;
            padding: 0.2rem 0.6rem;
            border-radius: 1rem;
            font-size: 0.7rem;
            margin: 0.2rem;
        }
        .user-avatar {
            width: 28px;
            height: 28px;
            background: #2b7a4b;
            color: white;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.7rem;
        }
        .material-type-badge {
            display: inline-block;
            padding: 0.15rem 0.5rem;
            border-radius: 1rem;
            font-size: 0.65rem;
            background: #e2e8f0;
        }
        
        /* ========== التنبيهات ========== */
        .toast-msg {
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            background: #2b7a4b;
            color: white;
            padding: 0.6rem;
            border-radius: 2rem;
            text-align: center;
            z-index: 1000;
            font-size: 0.8rem;
            max-width: calc(100% - 2rem);
            margin: 0 auto;
        }
        .toast-msg.error { background: #e53e3e; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        
        .footer { text-align: center; padding: 1rem; color: #718096; font-size: 0.7rem; margin-top: 1rem; }
        
        /* ========== شاشات صغيرة (هواتف) ========== */
        @media (max-width: 768px) {
            .navbar { flex-direction: column; text-align: center; }
            .tabs { justify-content: center; }
            .tab-btn { padding: 0.4rem 0.8rem; font-size: 0.75rem; }
            .admin-card { padding: 0.8rem; }
            .admin-card h3 { font-size: 0.9rem; }
            .sections-table th, .links-table th, .users-table th, .materials-table th { padding: 6px 4px; font-size: 0.65rem; }
            .sections-table td, .links-table td, .users-table td, .materials-table td { padding: 6px 4px; font-size: 0.6rem; }
            .action-buttons { flex-direction: column; gap: 0.2rem; }
            .edit-btn, .delete-btn, .pin-btn { padding: 0.15rem 0.4rem; font-size: 0.55rem; }
            .stats-badge { font-size: 0.6rem; padding: 0.15rem 0.5rem; }
        }
        
        /* ========== شاشات صغيرة جداً ========== */
        @media (max-width: 480px) {
            .container { padding: 0 0.8rem; }
            .logo h2 { font-size: 0.9rem; }
            .tab-btn { padding: 0.3rem 0.6rem; font-size: 0.7rem; }
            .sections-table .desc-cell { max-width: 80px; }
        }
        
        /* ========== أجهزة لوحية ========== */
        @media (min-width: 769px) and (max-width: 1024px) {
            .container { padding: 0 1.2rem; }
            .sections-table th, .links-table th { font-size: 0.7rem; }
        }
        
        /* ========== شاشات كبيرة ========== */
        @media (min-width: 1400px) {
            .container { max-width: 1600px; }
            .sections-table th, .links-table th { font-size: 0.9rem; padding: 12px; }
            .sections-table td, .links-table td { font-size: 0.85rem; padding: 10px; }
        }
    </style>
</head>
<body>
    <div id="app" style="text-align:center; padding:2rem;">⏳ جاري تحميل لوحة التحكم...</div>

    <script type="module">
        import { auth, db } from "./firebase.js";
        import { onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
        import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
        
        let isAdmin = false;
        let currentData = null;
        let currentEditId = null;
        let currentEditSectionId = null;
        let usersList = [];
        let trainingMaterials = [];
        
        const CACHE_KEYS = { SECTIONS: 'admin_sections_v2', LINKS: 'admin_links_v2', MATERIALS: 'admin_materials_v1' };
        
        function showToast(message, isError = false) {
            const toast = document.createElement('div');
            toast.className = 'toast-msg' + (isError ? ' error' : '');
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }
        
        function escapeHtml(text) { if (!text) return ''; const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
        
        async function checkAdminStatus(user) {
            try {
                const adminUIDs = ["rAvzMQ7ixeP2oPreQZPSedKxQFu1"];
                if (adminUIDs.includes(user.uid)) { isAdmin = true; return true; }
                const adminDoc = await getDocs(query(collection(db, "admins"), where("uid", "==", user.uid)));
                if (!adminDoc.empty) { isAdmin = true; return true; }
                const adminEmails = ["admin@test.com", "mina@test.com"];
                if (adminEmails.includes(user.email)) { isAdmin = true; return true; }
                isAdmin = false;
                return false;
            } catch (error) { console.error(error); isAdmin = false; return false; }
        }
        
        // ========== إحصائيات المواد ==========
        async function loadMaterialsStats() {
            try {
                const snapshot = await getDocs(collection(db, "training_materials"));
                let totalViews = 0, totalDownloads = 0;
                snapshot.forEach(doc => { const data = doc.data(); totalViews += data.views || 0; totalDownloads += data.downloads || 0; });
                const statsContainer = document.getElementById('materialsStats');
                if (statsContainer) {
                    statsContainer.innerHTML = `<div style="display: flex; gap: 0.5rem; flex-wrap: wrap;"><span class="stats-badge">📚 ${snapshot.size} مواد</span><span class="stats-badge">👁️ ${totalViews} مشاهدة</span><span class="stats-badge">📥 ${totalDownloads} تحميل</span></div>`;
                }
                return { totalViews, totalDownloads, totalMaterials: snapshot.size };
            } catch(error) { return { totalViews: 0, totalDownloads: 0, totalMaterials: 0 }; }
        }
        
        // ========== إدارة المستخدمين ==========
        async function fetchAllUsers() {
            try {
                const usersSnap = await getDocs(collection(db, "users"));
                usersList = [];
                usersSnap.forEach(doc => { usersList.push({ uid: doc.id, ...doc.data() }); });
                renderUsersList();
                return usersList;
            } catch (error) { return []; }
        }
        
        async function addNewUser() {
            const email = document.getElementById('newUserEmail')?.value;
            const password = document.getElementById('newUserPassword')?.value;
            const role = document.getElementById('newUserRole')?.value;
            if (!email || !password) { showToast('❌ الرجاء إدخال البريد وكلمة المرور', true); return; }
            if (password.length < 6) { showToast('❌ كلمة المرور 6 أحرف على الأقل', true); return; }
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "users", userCredential.user.uid), { uid: userCredential.user.uid, email, role: role || 'user', createdAt: new Date().toISOString(), createdBy: auth.currentUser?.uid });
                showToast(`✅ تم إنشاء المستخدم ${email}`);
                document.getElementById('newUserEmail').value = '';
                document.getElementById('newUserPassword').value = '';
                await fetchAllUsers();
            } catch (error) {
                let errorMsg = '❌ فشل إنشاء المستخدم';
                if (error.code === 'auth/email-already-in-use') errorMsg = '❌ البريد مستخدم بالفعل';
                else if (error.code === 'auth/invalid-email') errorMsg = '❌ البريد غير صالح';
                else if (error.code === 'auth/weak-password') errorMsg = '❌ كلمة المرور ضعيفة';
                showToast(errorMsg, true);
            }
        }
        
        async function deleteUserAccount(uid, email) {
            if (!confirm(`⚠️ هل أنت متأكد من حذف ${email}؟`)) return;
            try { await deleteDoc(doc(db, "users", uid)); showToast(`✅ تم حذف ${email}`); await fetchAllUsers(); } 
            catch (error) { showToast('❌ فشل الحذف', true); }
        }
        
        function renderUsersList() {
            const container = document.getElementById('usersList');
            if (!container) return;
            if (usersList.length === 0) { container.innerHTML = '<div style="text-align:center; padding:2rem;">📭 لا يوجد مستخدمين</div>'; return; }
            let html = '<div class="table-wrapper"><table class="users-table"><thead><tr><th>#</th><th>البريد الإلكتروني</th><th>الدور</th><th>تاريخ الإنشاء</th><th>العمليات</th></tr></thead><tbody>';
            usersList.forEach((user, index) => {
                html += `<tr><td style="width:35px;">${index+1}</span><td style="text-align:right;"><span class="user-avatar">${(user.email?.charAt(0)||'U').toUpperCase()}</span> ${escapeHtml(user.email||'-')}</span><td><span style="background:#e2e8f0; padding:0.15rem 0.6rem; border-radius:1rem;">${escapeHtml(user.role||'user')}</span></span><td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : '-'}</span><td class="action-buttons"><button class="delete-btn" onclick="window.deleteUserAccount('${user.uid}', '${escapeHtml(user.email)}')">🗑️</button></span></tr>`;
            });
            html += '</tbody>}</div>';
            container.innerHTML = html;
        }
        
        // ========== إدارة الأقسام والروابط ==========
        async function loadDataFromFirebase(forceRefresh = false) {
            try {
                let sections = [], links = [];
                if (!forceRefresh && window.CacheManager) {
                    const cachedSections = CacheManager.get(CACHE_KEYS.SECTIONS);
                    const cachedLinks = CacheManager.get(CACHE_KEYS.LINKS);
                    if (cachedSections && cachedLinks) { sections = cachedSections; links = cachedLinks; }
                }
                if (sections.length === 0) {
                    const sectionsSnap = await getDocs(collection(db, "sections"));
                    sections = sectionsSnap.docs.map(d => ({ id: parseInt(d.id), ...d.data() }));
                    const linksSnap = await getDocs(collection(db, "links"));
                    links = linksSnap.docs.map(d => ({ id: parseInt(d.id), ...d.data() }));
                    if (window.CacheManager) { CacheManager.set(CACHE_KEYS.SECTIONS, sections); CacheManager.set(CACHE_KEYS.LINKS, links); }
                }
                currentData = { sections: sections.map(s => ({ ...s, links: links.filter(l => l.sectionId === s.id) })) };
                return currentData;
            } catch(e) { return null; }
        }
        
        async function saveSection(section) { await setDoc(doc(db, "sections", section.id.toString()), section); if (window.CacheManager) CacheManager.remove(CACHE_KEYS.SECTIONS); }
        async function saveLink(link, sectionId) { await setDoc(doc(db, "links", link.id.toString()), { ...link, sectionId }); if (window.CacheManager) CacheManager.remove(CACHE_KEYS.LINKS); }
        async function deleteSectionFromFirebase(sectionId) {
            await deleteDoc(doc(db, "sections", sectionId.toString()));
            const linksSnap = await getDocs(query(collection(db, "links"), where("sectionId", "==", sectionId)));
            const batch = writeBatch(db);
            linksSnap.forEach(d => batch.delete(doc(db, "links", d.id)));
            await batch.commit();
            if (window.CacheManager) { CacheManager.remove(CACHE_KEYS.SECTIONS); CacheManager.remove(CACHE_KEYS.LINKS); }
        }
        async function deleteLinkFromFirebase(linkId) { await deleteDoc(doc(db, "links", linkId.toString())); if (window.CacheManager) CacheManager.remove(CACHE_KEYS.LINKS); }
        
        function renderSectionsList() {
            const container = document.getElementById('sectionsList');
            if (!container || !currentData) return;
            if (currentData.sections.length === 0) { container.innerHTML = '<div style="text-align:center; padding:2rem;">📭 لا توجد أقسام</div>'; return; }
            let html = `<div class="table-wrapper"><table class="sections-table"><thead><tr><th>#</th><th>الأيقونة</th><th>اسم القسم</th><th>الوصف</th><th>الروابط</th><th>العمليات</th></tr></thead><tbody>`;
            currentData.sections.forEach((s, i) => {
                html += `<tr><td style="width:35px;">${i+1}</span><td class="icon-cell">${s.icon||'📁'}</span><td class="name-cell">${escapeHtml(s.name)}</span><td class="desc-cell" title="${escapeHtml(s.description||'-')}">${escapeHtml(s.description||'-')}</span><td><span class="links-count">${s.links?.length||0}</span></span><td class="action-buttons"><button class="edit-btn" onclick="window.openEditSection(${s.id})">✏️</button><button class="delete-btn" onclick="window.deleteSection(${s.id})">🗑️</button></span></tr>`;
            });
            html += `</tbody>}</div>`;
            container.innerHTML = html;
        }
        
        function renderLinksList() {
            const container = document.getElementById('linksList');
            if (!container || !currentData) return;
            let allLinks = [];
            currentData.sections.forEach(section => {
                if (section.links && section.links.length > 0) {
                    section.links.forEach(link => { allLinks.push({ ...link, sectionName: section.name, sectionIcon: section.icon || '📁', sectionId: section.id }); });
                }
            });
            if (allLinks.length === 0) { container.innerHTML = '<div style="text-align:center; padding:2rem;">📭 لا توجد روابط</div>'; return; }
            let html = `<div class="table-wrapper"><table class="links-table"><thead><tr><th>#</th><th>القسم</th><th>العنوان</th><th>الرابط</th><th>النوع</th><th>👁️</th><th>📌</th><th>العمليات</th></tr></thead><tbody>`;
            allLinks.forEach((link, index) => {
                html += `<tr><td style="width:35px;">${index+1}</td><td><span style="background:#e2e8f0; padding:0.15rem 0.5rem; border-radius:1rem; font-size:0.65rem;">${link.sectionIcon} ${escapeHtml(link.sectionName)}</span></td><td style="text-align:right;">${escapeHtml(link.title)}</td><td style="direction:ltr; font-size:0.65rem;">${link.url ? link.url.substring(0,35)+'...' : '-'}</td><td><span style="background:${link.type==='internal'?'#bee3f8':'#fef5e7'}; padding:0.15rem 0.4rem; border-radius:1rem;">${link.type==='internal'?'داخلي':'خارجي'}</span></td><td>${link.views||0}</td><td>${link.pinned?'✅':'❌'}</td><td class="action-buttons"><button class="edit-btn" onclick="window.openEditLink(${link.sectionId},${link.id})">✏️</button><button class="pin-btn" onclick="window.togglePin(${link.sectionId},${link.id})">📌</button><button class="delete-btn" onclick="window.deleteLink(${link.sectionId},${link.id})">🗑️</button></td></tr>`;
            });
            html += `</tbody></div><div style="margin-top:0.8rem; text-align:center; font-size:0.65rem;">📊 إجمالي الروابط: ${allLinks.length}</div>`;
            container.innerHTML = html;
        }
        
        async function addSection() {
            const name = document.getElementById('sectionName')?.value;
            if (!name) { showToast('❌ الرجاء إدخال اسم القسم', true); return; }
            const sectionsSnap = await getDocs(collection(db, "sections"));
            let maxId = 0;
            sectionsSnap.forEach(d => { const id = parseInt(d.id); if (id > maxId) maxId = id; });
            const newSection = { id: maxId + 1, name, icon: document.getElementById('sectionIcon')?.value || '📁', description: document.getElementById('sectionDesc')?.value || '' };
            await saveSection(newSection);
            await loadDataFromFirebase(true);
            renderSectionsList(); renderLinksList();
            showToast('✅ تم إضافة القسم');
            ['sectionName','sectionIcon','sectionDesc'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
        }
        
        window.deleteSection = async (id) => { if(confirm('⚠️ هل أنت متأكد؟')){ await deleteSectionFromFirebase(id); await loadDataFromFirebase(true); renderSectionsList(); renderLinksList(); showToast('🗑️ تم الحذف'); } };
        window.openEditSection = (id) => { const section = currentData.sections.find(s => s.id === id); if(section){ currentEditId = id; document.getElementById('editSectionName').value = section.name; document.getElementById('editSectionIcon').value = section.icon || ''; document.getElementById('editSectionDesc').value = section.description || ''; document.getElementById('editSectionModal').style.display = 'flex'; } };
        window.saveSectionEdit = async () => { const section = currentData.sections.find(s => s.id === currentEditId); if(section){ section.name = document.getElementById('editSectionName').value; section.icon = document.getElementById('editSectionIcon').value || '📁'; section.description = document.getElementById('editSectionDesc').value; await saveSection(section); document.getElementById('editSectionModal').style.display = 'none'; await loadDataFromFirebase(true); renderSectionsList(); renderLinksList(); showToast('✅ تم التعديل'); } };
        
        async function addLink() {
            const sectionId = parseInt(document.getElementById('linkSection')?.value);
            const title = document.getElementById('linkTitle')?.value;
            if (!title) { showToast('❌ الرجاء إدخال عنوان الرابط', true); return; }
            const linksSnap = await getDocs(collection(db, "links"));
            let maxId = 0;
            linksSnap.forEach(d => { const id = parseInt(d.id); if(id > maxId) maxId = id; });
            const newLink = { id: maxId + 1, title, url: document.getElementById('linkUrl')?.value || '#', type: document.getElementById('linkType')?.value, views: 0, pinned: false };
            await saveLink(newLink, sectionId);
            await loadDataFromFirebase(true);
            renderLinksList();
            showToast('✅ تم إضافة الرابط');
            ['linkTitle','linkUrl'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
        }
        
        window.deleteLink = async (sectionId, linkId) => { if(confirm('⚠️ هل أنت متأكد؟')){ await deleteLinkFromFirebase(linkId); await loadDataFromFirebase(true); renderLinksList(); showToast('🗑️ تم الحذف'); } };
        window.openEditLink = (sectionId, linkId) => {
            const section = currentData.sections.find(s => s.id === sectionId);
            if(section){ const link = section.links.find(l => l.id === linkId); if(link){ currentEditSectionId = sectionId; currentEditId = linkId; document.getElementById('editLinkTitle').value = link.title; document.getElementById('editLinkUrl').value = link.url || ''; document.getElementById('editLinkType').value = link.type || 'internal'; document.getElementById('editLinkModal').style.display = 'flex'; } }
        };
        window.saveLinkEdit = async () => {
            const section = currentData.sections.find(s => s.id === currentEditSectionId);
            if(section){ const link = section.links.find(l => l.id === currentEditId); if(link){ link.title = document.getElementById('editLinkTitle').value; link.url = document.getElementById('editLinkUrl').value; link.type = document.getElementById('editLinkType').value; await saveLink(link, currentEditSectionId); document.getElementById('editLinkModal').style.display = 'none'; await loadDataFromFirebase(true); renderLinksList(); showToast('✅ تم التعديل'); } }
        };
        window.togglePin = async (sectionId, linkId) => {
            const section = currentData.sections.find(s => s.id === sectionId);
            if(section){ const link = section.links.find(l => l.id === linkId); if(link){ link.pinned = !link.pinned; await saveLink(link, sectionId); await loadDataFromFirebase(true); renderLinksList(); showToast(link.pinned ? '📌 تم التثبيت' : '📍 تم إلغاء التثبيت'); } }
        };
        
        // ========== إدارة المواد ==========
        async function loadTrainingMaterials(forceRefresh = false) {
            try {
                if (!forceRefresh && window.CacheManager) {
                    const cached = CacheManager.get(CACHE_KEYS.MATERIALS);
                    if (cached) { trainingMaterials = cached; renderMaterialsList(); return; }
                }
                const snapshot = await getDocs(collection(db, "training_materials"));
                trainingMaterials = [];
                snapshot.forEach(doc => { trainingMaterials.push({ id: doc.id, ...doc.data() }); });
                trainingMaterials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                if (window.CacheManager) CacheManager.set(CACHE_KEYS.MATERIALS, trainingMaterials);
                renderMaterialsList();
            } catch(error) { console.error(error); }
        }
        
        async function saveMaterial(material) {
            const docRef = material.id ? doc(db, "training_materials", material.id) : doc(collection(db, "training_materials"));
            if (!material.id) material.id = docRef.id;
            material.updatedAt = new Date().toISOString();
            await setDoc(docRef, material);
            if (window.CacheManager) CacheManager.remove(CACHE_KEYS.MATERIALS);
            await loadTrainingMaterials(true);
            await loadMaterialsStats();
            showToast('✅ تم حفظ المادة');
        }
        
        async function deleteMaterial(id) {
            if (confirm('⚠️ هل أنت متأكد من حذف هذه المادة؟')) {
                await deleteDoc(doc(db, "training_materials", id));
                if (window.CacheManager) CacheManager.remove(CACHE_KEYS.MATERIALS);
                await loadTrainingMaterials(true);
                await loadMaterialsStats();
                showToast('🗑️ تم الحذف');
            }
        }
        
        function openAddMaterialModal() {
            document.getElementById('materialId').value = '';
            document.getElementById('materialTitle').value = '';
            document.getElementById('materialDesc').value = '';
            document.getElementById('materialCategory').value = '';
            document.getElementById('materialType').value = 'pdf';
            document.getElementById('materialFileUrl').value = '';
            document.getElementById('materialModal').style.display = 'flex';
        }
        
        function openEditMaterialModal(material) {
            document.getElementById('materialId').value = material.id;
            document.getElementById('materialTitle').value = material.title;
            document.getElementById('materialDesc').value = material.description || '';
            document.getElementById('materialCategory').value = material.category || '';
            document.getElementById('materialType').value = material.type || 'pdf';
            document.getElementById('materialFileUrl').value = material.fileUrl || '';
            document.getElementById('materialModal').style.display = 'flex';
        }
        
        async function saveMaterialForm() {
            const material = {
                id: document.getElementById('materialId').value,
                title: document.getElementById('materialTitle').value,
                description: document.getElementById('materialDesc').value,
                category: document.getElementById('materialCategory').value,
                type: document.getElementById('materialType').value,
                fileUrl: document.getElementById('materialFileUrl').value,
                createdAt: new Date().toISOString(),
                views: 0, downloads: 0
            };
            if (!material.title) { showToast('❌ الرجاء إدخال عنوان المادة', true); return; }
            if (!material.fileUrl) { showToast('❌ الرجاء إدخال رابط الملف', true); return; }
            await saveMaterial(material);
            document.getElementById('materialModal').style.display = 'none';
        }
        
        function renderMaterialsList() {
            const container = document.getElementById('materialsList');
            if (!container) return;
            if (trainingMaterials.length === 0) { container.innerHTML = '<div style="text-align:center; padding:2rem;">📭 لا توجد مواد</div>'; return; }
            let html = '<div class="table-wrapper"><table class="materials-table"><thead><tr><th>#</th><th>العنوان</th><th>التصنيف</th><th>النوع</th><th>الرابط</th><th>👁️</th><th>📥</th><th>العمليات</th></tr></thead><tbody>';
            trainingMaterials.forEach((m, i) => {
                html += `<td><td style="width:35px;">${i+1}</td><td style="text-align:right;">${escapeHtml(m.title)}</span></td><td>${escapeHtml(m.category||'-')}</td><td><span class="material-type-badge">${m.type||'pdf'}</span></td><td style="direction:ltr; font-size:0.6rem;">${m.fileUrl ? m.fileUrl.substring(0,30)+'...' : '-'}</span><td><span style="background:#bee3f8; padding:0.15rem 0.4rem; border-radius:1rem;">${m.views||0}</span><td><span style="background:#c6f6d5; padding:0.15rem 0.4rem; border-radius:1rem;">${m.downloads||0}</span></td><td class="action-buttons"><button class="edit-btn" onclick='window.openEditMaterialModal(${JSON.stringify(m).replace(/'/g, "&#39;")})'>✏️</button><button class="delete-btn" onclick="window.deleteMaterial('${m.id}')">🗑️</button></span></tr>`;
            });
            html += '</tbody>}</div>';
            container.innerHTML = html;
        }
        
        // ========== استيراد/تصدير ==========
        async function exportAllToJSON() {
            const sectionsSnap = await getDocs(collection(db, "sections"));
            const linksSnap = await getDocs(collection(db, "links"));
            const usersSnap = await getDocs(collection(db, "users"));
            const materialsSnap = await getDocs(collection(db, "training_materials"));
            const data = { sections: sectionsSnap.docs.map(d => d.data()), links: linksSnap.docs.map(d => d.data()), users: usersSnap.docs.map(d => ({ uid: d.id, ...d.data() })), materials: materialsSnap.docs.map(d => d.data()) };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `backup_${new Date().toISOString().slice(0,19)}.json`; a.click(); URL.revokeObjectURL(a.href);
            showToast('📥 تم التصدير');
        }
        
        async function importBackupJSON(file) {
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.sections) { for (const section of data.sections) { await setDoc(doc(db, "sections", section.id.toString()), section); } }
                    if (data.links) { for (const link of data.links) { await setDoc(doc(db, "links", link.id.toString()), link); } }
                    if (data.materials) { for (const material of data.materials) { await setDoc(doc(db, "training_materials", material.id), material); } }
                    showToast('✅ تم الاستيراد');
                    if (window.CacheManager) { CacheManager.remove(CACHE_KEYS.SECTIONS); CacheManager.remove(CACHE_KEYS.LINKS); CacheManager.remove(CACHE_KEYS.MATERIALS); }
                    await loadDataFromFirebase(true);
                    await loadTrainingMaterials(true);
                    await loadMaterialsStats();
                    renderSectionsList(); renderLinksList();
                } catch (error) { showToast('❌ خطأ في الملف', true); }
            };
            reader.readAsText(file);
        }
        
        // ========== رفع Excel ==========
        let totalOperations = 0, completedOperations = 0;
        function updateUploadProgress() { const percent = totalOperations > 0 ? Math.floor((completedOperations / totalOperations) * 100) : 0; const bar = document.getElementById("uploadProgressBar"); if(bar) { bar.style.width = percent + "%"; bar.innerHTML = percent + "%"; } const doneSpan = document.getElementById("uploadDoneCount"); const totalSpan = document.getElementById("uploadTotalCount"); if(doneSpan) doneSpan.innerText = completedOperations; if(totalSpan) totalSpan.innerText = totalOperations; }
        function addUploadLog(msg, type) { const log = document.getElementById("uploadLog"); if(log) log.innerHTML += `<div class="${type||''}">${new Date().toLocaleTimeString()} - ${msg}</div>`; }
        function setUploadStatus(text) { const statusSpan = document.getElementById("uploadStatus"); if(statusSpan) statusSpan.innerText = text; }
        function readWorkbook(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = (e) => { const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' }); resolve(workbook); }; reader.onerror = reject; reader.readAsArrayBuffer(file); }); }
        function sheetToJson(workbook, sheetName) { const sheet = workbook.Sheets[sheetName]; return sheet ? XLSX.utils.sheet_to_json(sheet) : []; }
        function convertExcelDate(excelDate) { if (!excelDate) return ""; if (typeof excelDate === 'number') { const date = XLSX.SSF.parse_date_code(excelDate); return `${date.y}-${String(date.m).padStart(2,'0')}-${String(date.d).padStart(2,'0')}`; } return excelDate; }
        
        async function uploadEmployees(data) {
            setUploadStatus("رفع الموظفين..."); addUploadLog(`📥 رفع ${data.length} موظف`);
            for (let i = 0; i < data.length; i++) {
                const row = data[i]; const docId = String(row["Employee ID"] || row["employee_id"] || row["id"] || i).trim();
                await setDoc(doc(db, "employees", docId), { id: parseInt(docId) || docId, fullName: row["Full Name"] || row["full_name"] || row["name"] || "", department: row["Dep"] || row["department"] || "", position: row["Position"] || row["position"] || "", level: row["Level"] || row["level"] || "", hireDate: convertExcelDate(row["Hire Date"] || row["hire_date"]), status: row["Status"] || row["status"] || "Active" });
                completedOperations++; updateUploadProgress();
                if ((i+1) % 10 === 0) addUploadLog(`📊 ${i+1}/${data.length} موظف`);
            }
            addUploadLog(`✅ تم رفع ${data.length} موظف`, "success");
        }
        
        async function uploadTrainingData(prefix, workbook) {
            const courses = sheetToJson(workbook, "Courses"), sessions = sheetToJson(workbook, "Sessions"), enrollments = sheetToJson(workbook, "Enrollments");
            addUploadLog(`📚 ${prefix}: ${courses.length} كورس, ${sessions.length} جلسة, ${enrollments.length} تسجيل`);
            setUploadStatus(`${prefix} - الكورسات`);
            for (let i = 0; i < courses.length; i++) { const c = courses[i]; await setDoc(doc(db, `${prefix}_courses`, String(c.course_code||i).toLowerCase()), { course_code: c.course_code, course_name: c.course_name, category: c.category||"", duration_hours: parseFloat(c.duration_hours)||0 }); completedOperations++; updateUploadProgress(); }
            setUploadStatus(`${prefix} - الجلسات`);
            for (let i = 0; i < sessions.length; i++) { const s = sessions[i]; await setDoc(doc(db, `${prefix}_sessions`, String(s.session_code||i).toLowerCase()), { session_code: s.session_code, course_code: s.course_code, session_date: convertExcelDate(s.session_date), trainer_name: s.trainer_name||"" }); completedOperations++; updateUploadProgress(); }
            setUploadStatus(`${prefix} - التسجيلات`);
            for (let i = 0; i < enrollments.length; i++) { const e = enrollments[i]; await setDoc(doc(db, `${prefix}_enrollments`, `${String(e.employee_id||i)}_${String(e.session_code||"")}`), { employee_id: e.employee_id, session_code: e.session_code, enrollment_status: e.enrollment_status||"Completed", score: e.score ? parseFloat(e.score) : null }); completedOperations++; updateUploadProgress(); }
            addUploadLog(`✅ تم رفع ${prefix}`, "success");
        }
        
        window.startUpload = async () => {
            const employeesFile = document.getElementById("employeesFile")?.files[0], offjobFile = document.getElementById("offjobFile")?.files[0], onjobFile = document.getElementById("onjobFile")?.files[0];
            if (!employeesFile && !offjobFile && !onjobFile) { showToast("❌ اختر ملفاً واحداً على الأقل", true); return; }
            completedOperations = 0; totalOperations = 0;
            if (employeesFile) { const wb = await readWorkbook(employeesFile); totalOperations += sheetToJson(wb, "Sheet1").length; }
            if (offjobFile) { const wb = await readWorkbook(offjobFile); totalOperations += sheetToJson(wb, "Courses").length + sheetToJson(wb, "Sessions").length + sheetToJson(wb, "Enrollments").length; }
            if (onjobFile) { const wb = await readWorkbook(onjobFile); totalOperations += sheetToJson(wb, "Courses").length + sheetToJson(wb, "Sessions").length + sheetToJson(wb, "Enrollments").length; }
            const logBox = document.getElementById("uploadLog"); if(logBox) logBox.innerHTML = ""; updateUploadProgress(); setUploadStatus("بدء الرفع..."); addUploadLog("🚀 بدء رفع البيانات");
            try {
                if (employeesFile) { const wb = await readWorkbook(employeesFile); const data = sheetToJson(wb, "Sheet1"); if(data.length) await uploadEmployees(data); else addUploadLog("⚠️ لا توجد بيانات", "error"); }
                if (offjobFile) { const wb = await readWorkbook(offjobFile); await uploadTrainingData("offjob", wb); }
                if (onjobFile) { const wb = await readWorkbook(onjobFile); await uploadTrainingData("onjob", wb); }
                setUploadStatus("اكتمل الرفع ✅"); addUploadLog("🎉 تم رفع جميع البيانات!", "success"); showToast("✅ تم الرفع بنجاح");
                if (window.CacheManager) { CacheManager.remove(CACHE_KEYS.SECTIONS); CacheManager.remove(CACHE_KEYS.LINKS); }
                await loadDataFromFirebase(true); renderSectionsList(); renderLinksList();
            } catch(error) { setUploadStatus("فشل الرفع ❌"); addUploadLog(`❌ ${error.message}`, "error"); showToast("❌ فشل الرفع", true); }
        };
        
        async function refreshAdminData() { showToast("🔄 جاري التحديث..."); if(window.CacheManager){ CacheManager.remove(CACHE_KEYS.SECTIONS); CacheManager.remove(CACHE_KEYS.LINKS); CacheManager.remove(CACHE_KEYS.MATERIALS); } await loadDataFromFirebase(true); await loadTrainingMaterials(true); await loadMaterialsStats(); renderSectionsList(); renderLinksList(); await fetchAllUsers(); showToast("✅ تم التحديث"); }
        
        function logout() { signOut(auth).then(() => window.location.href = 'login.html'); }
        function closeModal(id) { document.getElementById(id).style.display = 'none'; }
        function switchTab(tab) { document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active')); document.getElementById(tab + 'Tab').classList.add('active'); document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); if (event && event.target) event.target.classList.add('active'); }
        
        async function loadAdminPage() {
            await loadDataFromFirebase(false);
            await loadTrainingMaterials(false);
            await fetchAllUsers();
            const stats = await loadMaterialsStats();
            const sectionsOptions = currentData?.sections.map(s => `<option value="${s.id}">${s.icon || '📁'} ${s.name}</option>`).join('');
            
            document.getElementById('app').innerHTML = `
                <div class="navbar"><div class="logo"><h2>🎓 <span>نظام</span> إدارة التعليم والتطوير</h2></div><div class="nav-links"><a href="index.html" class="home">🏠 الرئيسية</a><a href="#" onclick="window.logout()" class="logout">🚪 تسجيل خروج</a></div></div>
                <div class="container">
                    <div class="tabs"><button class="tab-btn active" onclick="window.switchTab('sections')">📂 الأقسام والروابط</button><button class="tab-btn" onclick="window.switchTab('materials')">📚 المواد التدريبية</button><button class="tab-btn" onclick="window.switchTab('users')">👥 المستخدمين</button><button class="tab-btn" onclick="window.switchTab('data')">💾 استيراد/تصدير</button></div>
                    
                    <div id="sectionsTab" class="tab-content active">
                        <div class="admin-card"><h3>➕ إضافة قسم</h3><div id="sectionMsg" class="msg"></div><input type="text" id="sectionName" placeholder="اسم القسم"><input type="text" id="sectionIcon" placeholder="الأيقونة (📁)"><input type="text" id="sectionDesc" placeholder="الوصف"><button onclick="window.addSection()">إضافة</button></div>
                        <div class="admin-card"><h3>📋 الأقسام</h3><div id="sectionsList"></div></div>
                        <div class="admin-card"><h3>🔗 إضافة رابط</h3><div id="linkMsg" class="msg"></div><select id="linkSection">${sectionsOptions}</select><input type="text" id="linkTitle" placeholder="عنوان الرابط"><input type="url" id="linkUrl" placeholder="الرابط"><select id="linkType"><option value="internal">داخلي</option><option value="external">خارجي</option></select><button onclick="window.addLink()">إضافة</button></div>
                        <div class="admin-card"><h3>📋 الروابط</h3><div id="linksList"></div></div>
                    </div>
                    
                    <div id="materialsTab" class="tab-content">
                        <div class="admin-card"><h3>📊 إحصائيات المواد</h3><div id="materialsStats"><div style="display:flex; gap:0.5rem; flex-wrap:wrap;"><span class="stats-badge">📚 ${stats.totalMaterials} مواد</span><span class="stats-badge">👁️ ${stats.totalViews} مشاهدة</span><span class="stats-badge">📥 ${stats.totalDownloads} تحميل</span></div></div></div>
                        <div class="admin-card"><h3>➕ إضافة مادة</h3><button onclick="window.openAddMaterialModal()" style="background:#2b7a4b;">➕ إضافة مادة</button></div>
                        <div class="admin-card"><h3>📋 المواد</h3><div id="materialsList"></div></div>
                    </div>
                    
                    <div id="usersTab" class="tab-content">
                        <div class="admin-card"><h3>➕ إضافة مستخدم</h3><div id="userMsg" class="msg"></div><input type="email" id="newUserEmail" placeholder="البريد الإلكتروني"><input type="password" id="newUserPassword" placeholder="كلمة المرور (6 أحرف)"><select id="newUserRole"><option value="user">👤 مستخدم</option><option value="admin">👑 أدمن</option></select><button onclick="window.addNewUser()">➕ إنشاء</button></div>
                        <div class="admin-card"><h3>📋 المستخدمين</h3><div id="usersList"></div></div>
                    </div>
                    
                    <div id="dataTab" class="tab-content">
                        <div class="admin-card" style="background:#fef5e7;"><h3>📁 JSON</h3><div class="backup-buttons"><button onclick="window.exportAllToJSON()" style="background:#4299e1;">📥 تصدير</button><button onclick="document.getElementById('jsonImportInput').click()" style="background:#9f7aea;">📤 استيراد</button><input type="file" id="jsonImportInput" accept=".json" style="display:none" onchange="window.importBackupJSON(this.files[0])"><button class="refresh-btn" onclick="window.refreshAdminData()">🔄 تحديث</button></div></div>
                        <div class="admin-card" style="background:#e8f0fe;"><h3>📥 Excel</h3><div class="import-grid"><div class="import-card"><h4>👥 الموظفين</h4><input type="file" id="employeesFile" accept=".xlsx, .xls"></div><div class="import-card"><h4>📘 Off Job</h4><input type="file" id="offjobFile" accept=".xlsx, .xls"></div><div class="import-card"><h4>📗 On Job</h4><input type="file" id="onjobFile" accept=".xlsx, .xls"></div></div><button onclick="window.startUpload()" style="background:#2b7a4b; width:100%;">🚀 رفع البيانات</button>
                        <div class="progress-container"><div class="progress-bar" id="uploadProgressBar">0%</div></div>
                        <div class="upload-stats">العمليات: <span id="uploadDoneCount">0</span> / <span id="uploadTotalCount">0</span><br>الحالة: <span id="uploadStatus">انتظار...</span></div>
                        <div class="upload-log" id="uploadLog"></div></div>
                    </div>
                </div>
                <div id="editSectionModal" class="modal"><div class="modal-content"><h3>✏️ تعديل القسم</h3><input type="text" id="editSectionName" placeholder="الاسم"><input type="text" id="editSectionIcon" placeholder="الأيقونة"><input type="text" id="editSectionDesc" placeholder="الوصف"><div class="modal-buttons"><button class="save-btn" onclick="window.saveSectionEdit()">حفظ</button><button class="cancel-btn" onclick="window.closeModal('editSectionModal')">إلغاء</button></div></div></div>
                <div id="editLinkModal" class="modal"><div class="modal-content"><h3>✏️ تعديل الرابط</h3><input type="text" id="editLinkTitle" placeholder="العنوان"><input type="url" id="editLinkUrl" placeholder="الرابط"><select id="editLinkType"><option value="internal">داخلي</option><option value="external">خارجي</option></select><div class="modal-buttons"><button class="save-btn" onclick="window.saveLinkEdit()">حفظ</button><button class="cancel-btn" onclick="window.closeModal('editLinkModal')">إلغاء</button></div></div></div>
                <div id="materialModal" class="modal"><div class="modal-content"><h3>📚 مادة تدريبية</h3><input type="hidden" id="materialId"><input type="text" id="materialTitle" placeholder="العنوان *"><textarea id="materialDesc" placeholder="الوصف" rows="3"></textarea><input type="text" id="materialCategory" placeholder="التصنيف"><select id="materialType"><option value="pdf">📄 PDF</option><option value="video">🎥 فيديو</option><option value="ppt">📊 PowerPoint</option><option value="doc">📝 Word</option><option value="excel">📈 Excel</option><option value="image">🖼️ صورة</option><option value="link">🔗 رابط</option><option value="other">📁 أخرى</option></select><input type="url" id="materialFileUrl" placeholder="رابط الملف *"><div class="modal-buttons"><button class="save-btn" onclick="window.saveMaterialForm()">حفظ</button><button class="cancel-btn" onclick="window.closeModal('materialModal')">إلغاء</button></div></div></div>
                <div class="footer"><p>© 2025 نظام إدارة التعليم والتطوير</p></div>
            `;
            renderSectionsList(); renderLinksList(); renderUsersList(); renderMaterialsList();
            window.addSection = addSection; window.addLink = addLink; window.logout = logout; window.closeModal = closeModal; 
            window.switchTab = switchTab; window.exportAllToJSON = exportAllToJSON; window.refreshAdminData = refreshAdminData; 
            window.addNewUser = addNewUser; window.deleteUserAccount = deleteUserAccount; window.importBackupJSON = importBackupJSON;
            window.openAddMaterialModal = openAddMaterialModal; window.openEditMaterialModal = openEditMaterialModal;
            window.saveMaterialForm = saveMaterialForm; window.deleteMaterial = deleteMaterial;
        }
        
        onAuthStateChanged(auth, async (user) => {
            if (!user) { window.location.href = 'login.html'; return; }
            const adminStatus = await checkAdminStatus(user);
            if (!adminStatus) { showToast("❌ غير مصرح بالدخول - هذا القسم للأدمن فقط", true); setTimeout(() => { window.location.href = 'index.html'; }, 1500); return; }
            await loadAdminPage();
        });
    </script>
</body>
</html>
