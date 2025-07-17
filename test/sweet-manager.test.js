// const {SweetManager} = require('../src/SweetManager');
// const {DatabaseManager }= require('../src/DatabaseManager');


import { SweetManager } from '../src/SweetManager.js';
import { DatabaseManager } from '../src/DatabaseManager.js';

describe('SweetManager', () => {
    let sweetManager;
    let dbManager;

    beforeEach(async () => {
        dbManager = new DatabaseManager();
        await dbManager.init();
        sweetManager = new SweetManager(dbManager);
    });

    afterEach(async () => {
        if (dbManager.db) {
            await dbManager.clearAllSweets();
        }
    });

    describe('Validation', () => {
        test('should validate sweet with all required fields', () => {
            const sweet = {
                name: 'Kaju Katli',
                category: 'Nut-Based',
                price: 50,
                quantity: 10
            };

            const errors = sweetManager.validateSweet(sweet);
            expect(errors).toHaveLength(0);
        });

        test('should return error for missing name', () => {
            const sweet = {
                name: '',
                category: 'Nut-Based',
                price: 50,
                quantity: 10
            };

            const errors = sweetManager.validateSweet(sweet);
            expect(errors).toContain('Sweet name is required');
        });

        test('should return error for invalid category', () => {
            const sweet = {
                name: 'Test Sweet',
                category: 'Invalid Category',
                price: 50,
                quantity: 10
            };

            const errors = sweetManager.validateSweet(sweet);
            expect(errors).toContain('Valid category is required');
        });

        test('should return error for invalid price', () => {
            const sweet = {
                name: 'Test Sweet',
                category: 'Nut-Based',
                price: 0,
                quantity: 10
            };

            const errors = sweetManager.validateSweet(sweet);
            expect(errors).toContain('Price must be greater than 0');
        });

        test('should return error for negative quantity', () => {
            const sweet = {
                name: 'Test Sweet',
                category: 'Nut-Based',
                price: 50,
                quantity: -5
            };

            const errors = sweetManager.validateSweet(sweet);
            expect(errors).toContain('Quantity must be 0 or greater');
        });

        test('should return multiple errors for multiple invalid fields', () => {
            const sweet = {
                name: '',
                category: 'Invalid',
                price: -10,
                quantity: -5
            };

            const errors = sweetManager.validateSweet(sweet);
            expect(errors.length).toBeGreaterThan(1);
        });
    });

    describe('Category Management', () => {
        test('should return predefined categories', () => {
            const categories = sweetManager.getCategories();
            expect(categories).toEqual(['Nut-Based', 'Vegetable-Based', 'Milk-Based']);
        });

        test('should accept valid categories', () => {
            const validCategories = ['Nut-Based', 'Vegetable-Based', 'Milk-Based'];
            
            validCategories.forEach(category => {
                const sweet = {
                    name: 'Test Sweet',
                    category: category,
                    price: 50,
                    quantity: 10
                };
                const errors = sweetManager.validateSweet(sweet);
                expect(errors).toHaveLength(0);
            });
        });
    });

    describe('Sweet Management', () => {
        test('should add valid sweet', async () => {
            const sweet = {
                name: 'Kaju Katli',
                category: 'Nut-Based',
                price: 50,
                quantity: 10
            };

            const result = await sweetManager.addSweet(sweet);
            expect(result).toBeDefined();
        });

        test('should throw error when adding invalid sweet', async () => {
            const sweet = {
                name: '',
                category: 'Invalid',
                price: 0,
                quantity: -5
            };

            await expect(sweetManager.addSweet(sweet)).rejects.toThrow();
        });

        test('should update existing sweet', async () => {
            const sweet = {
                name: 'Kaju Katli',
                category: 'Nut-Based',
                price: 50,
                quantity: 10
            };

            const id = await sweetManager.addSweet(sweet);
            const updatedSweet = {
                id: id,
                name: 'Updated Kaju Katli',
                category: 'Nut-Based',
                price: 60,
                quantity: 15
            };

            await sweetManager.updateSweet(updatedSweet);
            const retrieved = await sweetManager.getSweetById(id);
            expect(retrieved.name).toBe('Updated Kaju Katli');
            expect(retrieved.price).toBe(60);
        });

        test('should delete sweet', async () => {
            const sweet = {
                name: 'Kaju Katli',
                category: 'Nut-Based',
                price: 50,
                quantity: 10
            };

            const id = await sweetManager.addSweet(sweet);
            await sweetManager.deleteSweet(id);
            const retrieved = await sweetManager.getSweetById(id);
            expect(retrieved).toBeUndefined();
        });

        test('should get all sweets', async () => {
            const sweet1 = { name: 'Sweet 1', category: 'Nut-Based', price: 25, quantity: 10 };
            const sweet2 = { name: 'Sweet 2', category: 'Milk-Based', price: 30, quantity: 5 };

            await sweetManager.addSweet(sweet1);
            await sweetManager.addSweet(sweet2);

            const allSweets = await sweetManager.getAllSweets();
            expect(allSweets).toHaveLength(2);
        });
    });

    describe('Search Functionality', () => {
        beforeEach(async () => {
            await sweetManager.addSweet({ name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 10 });
            await sweetManager.addSweet({ name: 'Gajar Halwa', category: 'Vegetable-Based', price: 30, quantity: 15 });
            await sweetManager.addSweet({ name: 'Gulab Jamun', category: 'Milk-Based', price: 10, quantity: 50 });
        });

        test('should search by name', async () => {
            const results = await sweetManager.searchSweets('Kaju', '', '');
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('Kaju Katli');
        });

        test('should search by category', async () => {
            const results = await sweetManager.searchSweets('', 'Milk-Based', '');
            expect(results).toHaveLength(1);
            expect(results[0].category).toBe('Milk-Based');
        });

        test('should search by max price', async () => {
            const results = await sweetManager.searchSweets('', '', 30);
            expect(results).toHaveLength(2);
            expect(results.every(sweet => sweet.price <= 30)).toBe(true);
        });

        test('should search with combined filters', async () => {
            const results = await sweetManager.searchSweets('', 'Nut-Based', 100);
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('Kaju Katli');
        });
    });

    describe('Purchase Operations', () => {
        test('should purchase sweet successfully', async () => {
            const sweet = { name: 'Test Sweet', category: 'Nut-Based', price: 25, quantity: 10 };
            const id = await sweetManager.addSweet(sweet);

            const result = await sweetManager.purchaseSweet(id, 3);
            expect(result.quantity).toBe(7);
        });

        test('should throw error for insufficient stock', async () => {
            const sweet = { name: 'Test Sweet', category: 'Nut-Based', price: 25, quantity: 5 };
            const id = await sweetManager.addSweet(sweet);

            await expect(sweetManager.purchaseSweet(id, 10)).rejects.toThrow('Not enough stock available');
        });

        test('should throw error for non-existent sweet', async () => {
            await expect(sweetManager.purchaseSweet(999, 1)).rejects.toThrow('Sweet not found');
        });
    });

    describe('Restock Operations', () => {
        test('should restock sweet successfully', async () => {
            const sweet = { name: 'Test Sweet', category: 'Nut-Based', price: 25, quantity: 10 };
            const id = await sweetManager.addSweet(sweet);

            const result = await sweetManager.restockSweet(id, 5);
            expect(result.quantity).toBe(15);
        });

        test('should throw error for invalid restock quantity', async () => {
            const sweet = { name: 'Test Sweet', category: 'Nut-Based', price: 25, quantity: 10 };
            const id = await sweetManager.addSweet(sweet);

            await expect(sweetManager.restockSweet(id, 0)).rejects.toThrow('Restock quantity must be greater than 0');
        });

        test('should throw error for non-existent sweet', async () => {
            await expect(sweetManager.restockSweet(999, 5)).rejects.toThrow('Sweet not found');
        });
    });
});