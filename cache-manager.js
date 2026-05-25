// ========== Cache Manager ==========
// ضع هذا الملف في مجلد المشروع واستدعيه في كل الصفحات

var CacheManager = {
    CACHE_VERSION: 'v2',
    CACHE_DURATION: 60 * 60 * 1000, // ساعة واحدة (عدلها حسب الحاجة)
    
    // حفظ البيانات
    set: function(key, data) {
        try {
            var cacheData = {
                data: data,
                timestamp: Date.now(),
                version: this.CACHE_VERSION
            };
            localStorage.setItem(key, JSON.stringify(cacheData));
            return true;
        } catch(e) {
            console.error('Cache save error:', e);
            return false;
        }
    },
    
    // قراءة البيانات
    get: function(key) {
        try {
            var cached = localStorage.getItem(key);
            if (!cached) return null;
            
            var cacheData = JSON.parse(cached);
            
            // التحقق من صلاحية الكاش
            if (cacheData.version !== this.CACHE_VERSION) return null;
            
            var age = Date.now() - cacheData.timestamp;
            if (age > this.CACHE_DURATION) return null;
            
            return cacheData.data;
        } catch(e) {
            console.error('Cache read error:', e);
            return null;
        }
    },
    
    // حذف كاش معين
    remove: function(key) {
        localStorage.removeItem(key);
    },
    
    // مسح كل الكاش
    clearAll: function() {
        var keysToKeep = ['loggedUser', 'training_system_users'];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (keysToKeep.indexOf(key) === -1) {
                localStorage.removeItem(key);
            }
        }
    },
    
    // تحديث الكاش (حذف قديم وجلب جديد)
    refresh: function(key, loadFunction) {
        this.remove(key);
        return loadFunction();
    }
};

// تصدير للمتصفح
window.CacheManager = CacheManager;