export class SweetManager {
    constructor(dbManager) {
        this.db = dbManager;
        this.categories = ['Nut-Based', 'Vegetable-Based', 'Milk-Based'];
    }

    validateSweet(sweet) {
        const errors = [];
        
        if (!sweet.name || sweet.name.trim() === '') {
            errors.push('Sweet name is required');
        }
        
        if (!sweet.category || !this.categories.includes(sweet.category)) {
            errors.push('Valid category is required');
        }
        
        if (!sweet.price || sweet.price <= 0) {
            errors.push('Price must be greater than 0');
        }
        
        if (sweet.quantity < 0) {
            errors.push('Quantity must be 0 or greater');
        }
        
        return errors;
    }

    async addSweet(sweetData) {
        const errors = this.validateSweet(sweetData);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
        
        return await this.db.addSweet(sweetData);
    }

    async updateSweet(sweetData) {
        const errors = this.validateSweet(sweetData);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
        
        return await this.db.updateSweet(sweetData);
    }

    async deleteSweet(id) {
        return await this.db.deleteSweet(id);
    }

    async getAllSweets() {
        return await this.db.getAllSweets();
    }

    async getSweetById(id) {
        return await this.db.getSweetById(id);
    }

    async searchSweets(query, category, maxPrice) {
        const sweets = await this.getAllSweets();
        
        return sweets.filter(sweet => {
            const matchesQuery = !query || sweet.name.toLowerCase().includes(query.toLowerCase());
            const matchesCategory = !category || sweet.category === category;
            const matchesPrice = !maxPrice || sweet.price <= maxPrice;
            
            return matchesQuery && matchesCategory && matchesPrice;
        });
    }

    async purchaseSweet(id, quantity) {
        const sweet = await this.db.getSweetById(id);
        if (!sweet) {
            throw new Error('Sweet not found');
        }
        
        if (sweet.quantity < quantity) {
            throw new Error('Not enough stock available');
        }
        
        sweet.quantity -= quantity;
        await this.db.updateSweet(sweet);
        return sweet;
    }

    async restockSweet(id, quantity) {
        const sweet = await this.db.getSweetById(id);
        if (!sweet) {
            throw new Error('Sweet not found');
        }
        
        if (quantity <= 0) {
            throw new Error('Restock quantity must be greater than 0');
        }
        
        sweet.quantity += quantity;
        await this.db.updateSweet(sweet);
        return sweet;
    }

    getCategories() {
        return this.categories;
    }
}

// Export for Node.js (Jest) environment
// if (typeof module !== 'undefined' && module.exports) {
//     module.exports = SweetManager;
// }