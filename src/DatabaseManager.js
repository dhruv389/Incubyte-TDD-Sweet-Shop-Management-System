export class DatabaseManager {
    constructor() {
        this.dbName = 'sweetShopDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('sweets')) {
                    const store = db.createObjectStore('sweets', { keyPath: 'id', autoIncrement: true });
                    store.createIndex('name', 'name', { unique: false });
                    store.createIndex('category', 'category', { unique: false });
                    store.createIndex('price', 'price', { unique: false });
                }
            };
        });
    }

    async addSweet(sweet) {
        const transaction = this.db.transaction(['sweets'], 'readwrite');
        const store = transaction.objectStore('sweets');
        return new Promise((resolve, reject) => {
            const request = store.add(sweet);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateSweet(sweet) {
        const transaction = this.db.transaction(['sweets'], 'readwrite');
        const store = transaction.objectStore('sweets');
        return new Promise((resolve, reject) => {
            const request = store.put(sweet);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteSweet(id) {
        const transaction = this.db.transaction(['sweets'], 'readwrite');
        const store = transaction.objectStore('sweets');
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllSweets() {
        const transaction = this.db.transaction(['sweets'], 'readonly');
        const store = transaction.objectStore('sweets');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getSweetById(id) {
        const transaction = this.db.transaction(['sweets'], 'readonly');
        const store = transaction.objectStore('sweets');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async clearAllSweets() {
        const transaction = this.db.transaction(['sweets'], 'readwrite');
        const store = transaction.objectStore('sweets');
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// Export for Node.js (Jest) environment
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = DatabaseManager;
// }