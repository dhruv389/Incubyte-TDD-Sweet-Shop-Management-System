import { DatabaseManager } from './DatabaseManager.js';

export class CartManager {
    
    constructor() {
        this.cart = [];
        this.ct=0;
        this.dbManager = new DatabaseManager();
        this.dbManager.init().then(() => {
            console.log('IndexedDB initialized successfully');
        }).catch(err => {
            console.error('Failed to init IndexedDB:', err);
        });

    }



   async addToCart(sweet, quantity) {

  
        if (!sweet || !sweet.id || !sweet.name || !sweet.price) {
            throw new Error('Invalid sweet data');
        }
        
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        
        const existingItem = this.cart.find(item => item.id === sweet.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: sweet.id,
                name: sweet.name,
                price: sweet.price,
                quantity: quantity
            });
        }
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
    }

    updateQuantity(id, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(id);
            return;
        }
        
        const item = this.cart.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
        }
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    clear() {
        this.cart = [];
    }

    getItems() {
        return [...this.cart]; // Return a copy to prevent external modification
    }

    isEmpty() {
        return this.cart.length === 0;
    }

    getItem(id) {
        return this.cart.find(item => item.id === id);
    }
}