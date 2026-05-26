import { db } from "./firebase.js";
import { doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const KEY = "viewed_links";

function get() {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
}

function set(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export async function registerView(id) {
    const data = get();
    const now = Date.now();

    // منع التسجيل المتكرر خلال 10 دقائق
    if (data[id] && now - data[id] < 600000) return;

    data[id] = now;
    set(data);

    try {
        await updateDoc(doc(db, "links", id), {
            views: increment(1)
        });
        console.log(`✅ تم تسجيل مشاهدة للرابط ${id}`);
    } catch (e) {
        console.error("خطأ في تسجيل المشاهدة:", e);
    }
}
