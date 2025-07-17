import { SweetManager } from './SweetManager.js';


export class UIManager {
    constructor(sweetManager, cartManager) {
        this.sweetManager = sweetManager;
        this.cartManager = cartManager;
        this.editingSweet = null;
        
        this.initializeEventListeners();
        this.loadInitialData();
    }

    initializeEventListeners() {
        // Navigation
        document.getElementById('userBtn').addEventListener('click', () => this.showSection('user'));
        document.getElementById('ownerBtn').addEventListener('click', () => this.showSection('owner'));

        // Search and filter
        document.getElementById('searchInput').addEventListener('input', () => this.filterProducts());
        document.getElementById('categoryFilter').addEventListener('change', () => this.filterProducts());
        document.getElementById('maxPrice').addEventListener('input', () => this.filterProducts());

        // Sweet form
        document.getElementById('sweetForm').addEventListener('submit', (e) => this.handleSweetSubmit(e));
        document.getElementById('cancelEdit').addEventListener('click', () => this.cancelEdit());

        // Cart
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());
    }

    showSection(section) {
        const userSection = document.getElementById('userSection');
        const ownerSection = document.getElementById('ownerSection');
        const currentSection = document.getElementById('currentSection');
        
        // Update sidebar active state
        document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active-section'));
        
        if (section === 'user') {
            userSection.classList.remove('hidden');
            ownerSection.classList.add('hidden');
            currentSection.textContent = 'Customer View';
            document.getElementById('userBtn').classList.add('active-section');
            this.displayProducts();
        } else {
            userSection.classList.add('hidden');
            ownerSection.classList.remove('hidden');
            currentSection.textContent = 'Owner Panel';
            document.getElementById('ownerBtn').classList.add('active-section');
            this.displayOwnerProducts();
        }
    }

    async loadInitialData() {
        try {
            const sweets = await this.sweetManager.getAllSweets();
            if (sweets.length === 0) {
                // Add sample data with more variety
                await this.sweetManager.addSweet({
                    name: 'Kaju Katli',
                    category: 'Nut-Based',
                    price: 50,
                    quantity: 20
                });
                await this.sweetManager.addSweet({
                    name: 'Gajar Halwa',
                    category: 'Vegetable-Based',
                    price: 30,
                    quantity: 15
                });
                await this.sweetManager.addSweet({
                    name: 'Gulab Jamun',
                    category: 'Milk-Based',
                    price: 10,
                    quantity: 50
                });
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
        
        this.displayProducts();
        this.updateCartDisplay();
    }

    async displayProducts() {
    try {
        const sweets = await this.sweetManager.getAllSweets();
        // Sort by quantity (lowest first) to prioritize low stock items
        const sortedSweets = sweets.sort((a, b) => a.quantity - b.quantity);
        const container = document.getElementById('productsDisplay');
        
        container.innerHTML = sortedSweets.map(sweet => {
            const isLowStock = sweet.quantity <= 5;
            const isOutOfStock = sweet.quantity === 0;
            
            return `
                <div class="glass-dark rounded-xl p-6 card-hover ${isLowStock && !isOutOfStock ? 'border-2 border-red-500 shadow-red-500/20' : ''} ${isOutOfStock ? 'border-2 border-red-600 shadow-red-600/30' : ''}">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-white mb-2">${sweet.name}</h3>
                            <span class="px-3 py-1 bg-blue-500 bg-opacity-30 text-blue-300 rounded-full text-sm">${sweet.category}</span>
                        </div>
                        <div class="text-right">
                            <p class="text-2xl font-bold text-green-400">₹${sweet.price}</p>
                            <p class="text-sm ${isLowStock ? 'text-red-400 font-semibold' : 'text-gray-400'}">
                                Stock: ${sweet.quantity}
                                ${isLowStock && !isOutOfStock ? ' ⚠️' : ''}
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center space-x-2">
                            ${sweet.quantity > 5 ? 
                                `<div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                 <span class="text-green-400 text-sm">In Stock</span>` :
                                sweet.quantity > 0 ?
                                `<div class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                 <span class="text-yellow-400 text-sm font-semibold">Low Stock</span>` :
                                `<div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                 <span class="text-red-400 text-sm font-semibold">Out of Stock</span>`
                            }
                        </div>
                        
                        <button onclick="ui.addToCart(${sweet.id}, '${sweet.name}', ${sweet.price}, ${sweet.quantity})" 
                                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sweet.quantity === 0 ? 'opacity-50 cursor-not-allowed' : 'btn-glow hover:shadow-lg'}" 
                                ${sweet.quantity === 0 ? 'disabled' : ''}>
                           🛒
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        this.showMessage('Error loading products', 'error');
    }
}

async displayOwnerProducts() {
    try {
        const sweets = await this.sweetManager.getAllSweets();
        // Sort by quantity (lowest first) to prioritize low stock items
        const sortedSweets = sweets.sort((a, b) => a.quantity - b.quantity);
        const container = document.getElementById('ownerProductsDisplay');
        
        container.innerHTML = sortedSweets.map(sweet => {
            const isLowStock = sweet.quantity <= 5;
            const isOutOfStock = sweet.quantity === 0;
            
            return `
                <div class="glass-dark rounded-xl p-6 card-hover ${isLowStock && !isOutOfStock ? 'border-2 border-red-500 shadow-red-500/20' : ''} ${isOutOfStock ? 'border-2 border-red-600 shadow-red-600/30' : ''}">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-white mb-2">${sweet.name}</h3>
                            <div class="flex items-center space-x-4 text-sm text-gray-400">
                                <span class="px-2 py-1 bg-blue-500 bg-opacity-30 text-blue-300 rounded">${sweet.category}</span>
                                <span class="text-green-400 font-semibold">₹${sweet.price}</span>
                                <span class="flex items-center ${sweet.quantity <= 5 ? 'text-red-400 font-semibold' : 'text-gray-400'}">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                    </svg>
                                    Stock: ${sweet.quantity}
                                    ${isLowStock && !isOutOfStock ? ' ⚠️' : ''}
                                    ${isOutOfStock ? ' ❌' : ''}
                                </span>
                            </div>
                        </div>
                        
                        <div class="flex space-x-3">
                            <button onclick="ui.editSweet(${sweet.id})" 
                                    class="p-3 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-lg hover:bg-opacity-30 transition-all duration-200 hover:shadow-lg"
                                    title="Edit Sweet">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            
                            <button onclick="ui.deleteSweet(${sweet.id})" 
                                    class="p-3 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-all duration-200 hover:shadow-lg"
                                    title="Delete Sweet">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                            
                            <button onclick="ui.restockSweet(${sweet.id})" 
                                    class="p-3 ${isLowStock ? 'bg-green-500 bg-opacity-30 text-green-300 shadow-green-500/20' : 'bg-green-500 bg-opacity-20 text-green-400'} rounded-lg hover:bg-opacity-40 transition-all duration-200 hover:shadow-lg"
                                    title="Restock Sweet">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        this.showMessage('Error loading products', 'error');
    }
}



    async filterProducts() {
        const query = document.getElementById('searchInput').value;
        const category = document.getElementById('categoryFilter').value;
        const maxPrice = document.getElementById('maxPrice').value;
        
        try {
            const filteredSweets = await this.sweetManager.searchSweets(query, category, maxPrice);
            const container = document.getElementById('productsDisplay');
            
            container.innerHTML = filteredSweets.map(sweet => `
                <div class="glass-dark rounded-xl p-6 card-hover">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-white mb-2">${sweet.name}</h3>
                            <span class="px-3 py-1 bg-blue-500 bg-opacity-30 text-blue-300 rounded-full text-sm">${sweet.category}</span>
                        </div>
                        <div class="text-right">
                            <p class="text-2xl font-bold text-green-400">₹${sweet.price}</p>
                            <p class="text-sm text-gray-400">Stock: ${sweet.quantity}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center space-x-2">
                            ${sweet.quantity > 0 ? 
                                `<div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                 <span class="text-green-400 text-sm">In Stock</span>` :
                                `<div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                 <span class="text-red-400 text-sm">Out of Stock</span>`
                            }
                        </div>
                        
                        <button onclick="ui.addToCart(${sweet.id}, '${sweet.name}', ${sweet.price}, ${sweet.quantity})" 
                                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sweet.quantity === 0 ? 'opacity-50 cursor-not-allowed' : 'btn-glow'}" 
                                ${sweet.quantity === 0 ? 'disabled' : ''}>
                           🛍️
                            Add to Cart
                        </button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            this.showMessage('Error loading products', 'error');
        }
    }

    // Cart Management Methods - Fixed according to third file
    async addToCart(id, name, price, stock) {
        if (stock === 0) {
            this.showMessage('Item out of stock', 'error');
            return;
        }
        
        const quantity = 1; // Default quantity
        this.cartManager.addToCart({ id, name, price }, quantity);
        this.updateCartDisplay();
        this.showMessage('Item added to cart', 'success');
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const items = this.cartManager.getItems();
        
        cartCount.textContent = items.length;
        cartTotal.textContent = this.cartManager.getTotal();
        
        cartItems.innerHTML = items.map(item => `
            <div class="flex justify-between items-center p-2 bg-black bg-opacity-20 rounded mb-2">
                <div class="flex-1">
                    <span class="text-white font-medium">${item.name}</span>
                    <span class="text-gray-400 ml-2">x${item.quantity}</span>
                </div>
                <div class="text-right">
                    <span class="text-green-400">₹${item.price * item.quantity}</span>
                    <button onclick="ui.removeFromCart(${item.id})" 
                            class="ml-2 text-red-400 hover:text-red-300">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    removeFromCart(id) {
        this.cartManager.removeFromCart(id);
        this.updateCartDisplay();
        this.showMessage('Item removed from cart', 'info');
    }

    async checkout() {
        const items = this.cartManager.getItems();
        if (items.length === 0) {
            this.showMessage('Cart is empty', 'error');
            return;
        }

        try {
            for (const item of items) {
                await this.sweetManager.purchaseSweet(item.id, item.quantity);
            }
            
            this.cartManager.clear();
            this.updateCartDisplay();
            this.displayProducts();
            this.showMessage('Purchase successful!', 'success');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    // Owner Panel Methods
    async handleSweetSubmit(e) {
        e.preventDefault();
        
        const sweetData = {
            name: document.getElementById('sweetName').value,
            category: document.getElementById('sweetCategory').value,
            price: parseFloat(document.getElementById('sweetPrice').value),
            quantity: parseInt(document.getElementById('sweetQuantity').value)
        };
        
        try {
            if (this.editingSweet) {
                sweetData.id = this.editingSweet.id;
                await this.sweetManager.updateSweet(sweetData);
                this.showMessage('Sweet updated successfully!', 'success');
                this.cancelEdit();
            } else {
                await this.sweetManager.addSweet(sweetData);
                this.showMessage('Sweet added successfully!', 'success');
            }
            
            this.resetForm();
            this.displayOwnerProducts();
            document.getElementById('formError').classList.add('hidden');
        } catch (error) {
            document.getElementById('formError').textContent = error.message;
            document.getElementById('formError').classList.remove('hidden');
        }
    }

    async editSweet(id) {
        try {
            const sweet = await this.sweetManager.db.getSweetById(id);
            if (sweet) {
                this.editingSweet = sweet;
                document.getElementById('sweetId').value = sweet.id;
                document.getElementById('sweetName').value = sweet.name;
                document.getElementById('sweetCategory').value = sweet.category;
                document.getElementById('sweetPrice').value = sweet.price;
                document.getElementById('sweetQuantity').value = sweet.quantity;
                
                document.getElementById('cancelEdit').classList.remove('hidden');
                document.querySelector('button[type="submit"]').textContent = 'Update Sweet';
            }
        } catch (error) {
            this.showMessage('Error loading sweet data', 'error');
        }
    }

    cancelEdit() {
        this.editingSweet = null;
        this.resetForm();
        document.getElementById('cancelEdit').classList.add('hidden');
        document.querySelector('button[type="submit"]').textContent = 'Save Sweet';
    }

    resetForm() {
        document.getElementById('sweetForm').reset();
        document.getElementById('sweetId').value = '';
    }

    async deleteSweet(id) {
        if (confirm('Are you sure you want to delete this sweet?')) {
            try {
                await this.sweetManager.deleteSweet(id);
                this.showMessage('Sweet deleted successfully!', 'success');
                this.displayOwnerProducts();
            } catch (error) {
                this.showMessage('Error deleting sweet', 'error');
            }
        }
    }

    async restockSweet(id) {
        const quantity = prompt('Enter quantity to add:');
        if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
            try {
                await this.sweetManager.restockSweet(id, parseInt(quantity));
                this.showMessage('Sweet restocked successfully!', 'success');
                this.displayOwnerProducts();
            } catch (error) {
                this.showMessage('Error restocking sweet', 'error');
            }
        }
    }

    // Utility Methods
    showMessage(message, type) {
        const messageContainer = document.getElementById('messageContainer');
        const messageElement = document.createElement('div');
        
        const bgColors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };
        
        messageElement.className = `${bgColors[type]} text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300`;
        messageElement.textContent = message;
        
        messageContainer.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
}