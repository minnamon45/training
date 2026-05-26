// cache-manager.js - بدون تغيير جوهري، لكن إضافة support للـ modules
(function(global) {
    const CACHE_VERSION = 'v2';
    const CACHE_DURATION = 3600000;
    
    const CacheManager = {
        CACHE_VERSION,
        CACHE_DURATION,
        
        set(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now(), version: CACHE_VERSION }));
            } catch(e) { console.warn("Cache set failed", e); }
        },
        
        get(key) {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            try {
                const c = JSON.parse(raw);
                if (c.version !== CACHE_VERSION) return null;
                if (Date.now() - c.timestamp > CACHE_DURATION) return null;
                return c.data;
            } catch { return null; }
        },
        
        remove(key) { localStorage.removeItem(key); },
        
        clearAll() {
            Object.keys(localStorage).forEach(k => {
                if (!["loggedUser"].includes(k)) localStorage.removeItem(k);
            });
        }
    };
    
    global.CacheManager = CacheManager;
    if (typeof module !== 'undefined' && module.exports) module.exports = CacheManager;
})(window);
