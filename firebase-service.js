// firebase-service.js
const firebaseConfig = {
    apiKey: "AIzaSyA_P5crHXs4XvZVl73n6ikNodLTpsw25mk",
    authDomain: "training-2a75b.firebaseapp.com",
    projectId: "training-2a75b",
    storageBucket: "training-2a75b.firebasestorage.app",
    messagingSenderId: "849904887764",
    appId: "1:849904887764:web:b012d60c77b1851c169841"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ========== دوال مساعدة ==========
async function loadFromFirebase(collectionName) {
    try {
        const snapshot = await db.collection(collectionName).get();
        const data = [];
        snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        console.error(`خطأ في تحميل ${collectionName}:`, error);
        return [];
    }
}

async function saveToFirebase(collectionName, data, idField = 'id') {
    try {
        for (const item of data) {
            const docId = item[idField]?.toString();
            if (docId) {
                await db.collection(collectionName).doc(docId).set(item);
            }
        }
        return true;
    } catch (error) {
        console.error(`خطأ في حفظ ${collectionName}:`, error);
        return false;
    }
}

// ========== دوال خاصة ببيانات النظام ==========
async function syncUsersToFirebase(users) {
    return await saveToFirebase('users', users);
}

async function syncSectionsToFirebase(sections) {
    return await saveToFirebase('sections', sections);
}

async function syncLinksToFirebase(links) {
    return await saveToFirebase('links', links);
}

async function syncEmployeesToFirebase(employees) {
    return await saveToFirebase('employees', employees);
}

async function syncTrainingDataToFirebase(type, data) {
    const collectionName = type === 'offjob' ? 'training_offjob' : 'training_onjob';
    return await saveToFirebase(collectionName, [data], 'id');
}

// ========== تحميل جميع البيانات من Firebase ==========
async function loadAllFromFirebase() {
    const [users, sections, links, employees, trainingOffJob, trainingOnJob] = await Promise.all([
        loadFromFirebase('users'),
        loadFromFirebase('sections'),
        loadFromFirebase('links'),
        loadFromFirebase('employees'),
        loadFromFirebase('training_offjob'),
        loadFromFirebase('training_onjob')
    ]);
    
    return { users, sections, links, employees, trainingOffJob, trainingOnJob };
}

// ========== مزامنة مع localStorage ==========
async function syncLocalToFirebase() {
    const users = JSON.parse(localStorage.getItem('training_system_users') || '[]');
    const sections = JSON.parse(localStorage.getItem('training_system_sections') || '[]');
    const links = JSON.parse(localStorage.getItem('training_system_links') || '[]');
    const employees = JSON.parse(localStorage.getItem('hr_employees_data') || '[]');
    const trainingOffJob = JSON.parse(localStorage.getItem('training_data_offjob') || '{}');
    const trainingOnJob = JSON.parse(localStorage.getItem('training_data_onjob') || '{}');
    
    await syncUsersToFirebase(users);
    await syncSectionsToFirebase(sections);
    await syncLinksToFirebase(links);
    await syncEmployeesToFirebase(employees);
    await syncTrainingDataToFirebase('offjob', trainingOffJob);
    await syncTrainingDataToFirebase('onjob', trainingOnJob);
    
    console.log('✅ تم مزامنة البيانات مع Firebase');
    return true;
}

async function syncFirebaseToLocal() {
    const data = await loadAllFromFirebase();
    
    if (data.users.length) localStorage.setItem('training_system_users', JSON.stringify(data.users));
    if (data.sections.length) localStorage.setItem('training_system_sections', JSON.stringify(data.sections));
    if (data.links.length) localStorage.setItem('training_system_links', JSON.stringify(data.links));
    if (data.employees.length) localStorage.setItem('hr_employees_data', JSON.stringify(data.employees));
    if (data.trainingOffJob.length) localStorage.setItem('training_data_offjob', JSON.stringify(data.trainingOffJob[0]));
    if (data.trainingOnJob.length) localStorage.setItem('training_data_onjob', JSON.stringify(data.trainingOnJob[0]));
    
    console.log('✅ تم تحميل البيانات من Firebase');
    return data;
}

// تصدير الدوال
window.firebaseService = {
    syncLocalToFirebase,
    syncFirebaseToLocal,
    loadAllFromFirebase,
    syncUsersToFirebase,
    syncSectionsToFirebase,
    syncLinksToFirebase,
    syncEmployeesToFirebase,
    loadFromFirebase
};