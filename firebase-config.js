// ========== Firebase Configuration ==========

const firebaseConfig = {

    apiKey: "AIzaSyA_P5crHXs4XvZVl73n6ikNodLTpsw25mk",

    authDomain: "training-2a75b.firebaseapp.com",

    projectId: "training-2a75b",

    storageBucket: "training-2a75b.firebasestorage.app",

    messagingSenderId: "849904887764",

    appId: "1:849904887764:web:b012d60c77b1851c169841"
};

// متغيرات عامة
let db = null;

let auth = null;

let firebaseReady = false;

let firebaseInitialized = false;

// ========== تهيئة Firebase ==========

function initFirebase() {

    // منع التهيئة المتكررة
    if (firebaseInitialized) return;

    // التأكد من تحميل Firebase SDK
    if (typeof firebase !== 'undefined') {

        try {

            // إنشاء التطبيق مرة واحدة فقط
            if (firebase.apps.length === 0) {

                firebase.initializeApp(firebaseConfig);
            }

            // Firestore
            db = firebase.firestore();

            // Authentication
            auth = firebase.auth();

            firebaseReady = true;

            firebaseInitialized = true;

            console.log('✅ Firebase initialized successfully');

            // حفظ بالخارج للاستخدام العام
            window.db = db;

            window.auth = auth;

            window.firebaseReady = firebaseReady;

            // إطلاق حدث جاهزية Firebase
            window.dispatchEvent(new Event('firebase-ready'));

        } catch (e) {

            console.error('❌ Firebase init error:', e);

            firebaseReady = false;
        }

    } else {

        console.warn('⚠️ Firebase SDK not loaded');
    }
}

// تشغيل التهيئة
initFirebase();

// ========== Authentication Functions ==========

// تسجيل الدخول
async function loginUser(email, password) {

    try {

        const userCredential =
            await auth.signInWithEmailAndPassword(
                email,
                password
            );

        console.log('✅ Login success');

        return userCredential;

    } catch (error) {

        console.error('❌ Login error:', error);

        throw error;
    }
}

// تسجيل الخروج
async function logoutUser() {

    try {

        await auth.signOut();

        console.log('✅ Logout success');

        window.location.href = 'login.html';

    } catch (error) {

        console.error('❌ Logout error:', error);
    }
}

// إنشاء مستخدم جديد
async function createUser(email, password, userData = {}) {

    try {

        const userCredential =
            await auth.createUserWithEmailAndPassword(
                email,
                password
            );

        const user = userCredential.user;

        // حفظ بيانات المستخدم
        await db.collection("users")
            .doc(user.uid)
            .set({

                uid: user.uid,

                email: user.email,

                role: userData.role || "user",

                name: userData.name || "",

                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

        console.log('✅ User created');

        return userCredential;

    } catch (error) {

        console.error('❌ Create user error:', error);

        throw error;
    }
}

// التحقق من المستخدم الحالي
function checkAuth(callback) {

    auth.onAuthStateChanged(async (user) => {

        if (!user) {

            callback(null);

            return;
        }

        try {

            const doc =
                await db.collection("users")
                .doc(user.uid)
                .get();

            if (doc.exists) {

                callback({

                    auth: user,

                    data: doc.data()
                });

            } else {

                callback(null);
            }

        } catch (error) {

            console.error(error);

            callback(null);
        }

    });
}

// ========== Firestore Functions ==========

// حفظ بيانات
async function firebaseSet(collectionName, docId, data) {

    if (!firebaseReady || !db) {

        console.warn('Firebase not ready');

        return false;
    }

    try {

        await db.collection(collectionName)
            .doc(docId.toString())
            .set(data, { merge: true });

        console.log(`✅ Saved: ${collectionName}/${docId}`);

        return true;

    } catch (error) {

        console.error(error);

        return false;
    }
}

// قراءة مستند
async function firebaseGet(collectionName, docId) {

    if (!firebaseReady || !db) {

        return null;
    }

    try {

        const docRef =
            await db.collection(collectionName)
            .doc(docId.toString())
            .get();

        if (docRef.exists) {

            return {

                id: docRef.id,

                ...docRef.data()
            };
        }

        return null;

    } catch (error) {

        console.error(error);

        return null;
    }
}

// قراءة Collection
async function firebaseGetCollection(collectionName) {

    if (!firebaseReady || !db) {

        return [];
    }

    try {

        const snapshot =
            await db.collection(collectionName).get();

        const results = [];

        snapshot.forEach(doc => {

            results.push({

                id: doc.id,

                ...doc.data()
            });
        });

        return results;

    } catch (error) {

        console.error(error);

        return [];
    }
}

// حذف مستند
async function firebaseDelete(collectionName, docId) {

    if (!firebaseReady || !db) {

        return false;
    }

    try {

        await db.collection(collectionName)
            .doc(docId.toString())
            .delete();

        return true;

    } catch (error) {

        console.error(error);

        return false;
    }
}

// تحديث مستند
async function firebaseUpdate(collectionName, docId, data) {

    if (!firebaseReady || !db) {

        return false;
    }

    try {

        await db.collection(collectionName)
            .doc(docId.toString())
            .update(data);

        return true;

    } catch (error) {

        console.error(error);

        return false;
    }
}

// البحث
async function firebaseWhere(collectionName, field, operator, value) {

    if (!firebaseReady || !db) {

        return [];
    }

    try {

        const snapshot =
            await db.collection(collectionName)
            .where(field, operator, value)
            .get();

        const results = [];

        snapshot.forEach(doc => {

            results.push({

                id: doc.id,

                ...doc.data()
            });
        });

        return results;

    } catch (error) {

        console.error(error);

        return [];
    }
}

// ========== Global Export ==========

window.firebaseService = {

    db: () => db,

    auth: () => auth,

    ready: () => firebaseReady,

    login: loginUser,

    logout: logoutUser,

    createUser: createUser,

    checkAuth: checkAuth,

    set: firebaseSet,

    get: firebaseGet,

    getCollection: firebaseGetCollection,

    delete: firebaseDelete,

    update: firebaseUpdate,

    where: firebaseWhere
};