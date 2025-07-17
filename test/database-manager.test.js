// const {DatabaseManager} = require('../src/DatabaseManager');
import { DatabaseManager } from '../src/DatabaseManager.js';

describe('DatabaseManager', () => {
    let dbManager;
    
    beforeEach(async () => {
        dbManager = new DatabaseManager();
        await dbManager.init();
    });

    afterEach(async () => {
        if (dbManager.db) {
            await dbManager.clearAllSweets();
        }
    });

    describe('Database Initialization', () => {
        test('should initialize database successfully', async () => {
            expect(dbManager.db).toBeDefined();
            expect(dbManager.db.name).toBe('sweetShopDB');
            expect(dbManager.db.version).toBe(1);
        });

        test('should create sweets object store', async () => {
            expect(dbManager.db.objectStoreNames.contains('sweets')).toBe(true);
        });
    });

    describe('CRUD Operations', () => {
        test('should add a sweet to database', async () => {
            const sweet = {
                name: 'Test Sweet',
                category: 'Nut-Based',
                price: 25,
                quantity: 10
            };

            const result = await dbManager.addSweet(sweet);
            expect(result).toBeDefined();
            expect(typeof result).toBe('number');
        });

        test('should get all sweets from database', async () => {
            const sweet1 = { name: 'Sweet 1', category: 'Nut-Based', price: 25, quantity: 10 };
            const sweet2 = { name: 'Sweet 2', category: 'Milk-Based', price: 30, quantity: 5 };

            await dbManager.addSweet(sweet1);
            await dbManager.addSweet(sweet2);

            const allSweets = await dbManager.getAllSweets();
            expect(allSweets).toHaveLength(2);
            expect(allSweets[0]).toMatchObject(sweet1);
            expect(allSweets[1]).toMatchObject(sweet2);
        });

        test('should get sweet by ID', async () => {
            const sweet = { name: 'Test Sweet', category: 'Nut-Based', price: 25, quantity: 10 };
            const id = await dbManager.addSweet(sweet);

            const retrievedSweet = await dbManager.getSweetById(id);
            expect(retrievedSweet).toMatchObject(sweet);
            expect(retrievedSweet.id).toBe(id);
        });

        test('should update existing sweet', async () => {
            const sweet = { name: 'Test Sweet', category: 'Nut-Based', price: 25, quantity: 10 };
            const id = await dbManager.addSweet(sweet);

            const updatedSweet = { id, name: 'Updated Sweet', category: 'Milk-Based', price: 35, quantity: 15 };
            await dbManager.updateSweet(updatedSweet);

            const retrievedSweet = await dbManager.getSweetById(id);
            expect(retrievedSweet).toMatchObject(updatedSweet);
        });

        test('should delete sweet by ID', async () => {
            const sweet = { name: 'Test Sweet', category: 'Nut-Based', price: 25, quantity: 10 };
            const id = await dbManager.addSweet(sweet);

            await dbManager.deleteSweet(id);
            const retrievedSweet = await dbManager.getSweetById(id);
            expect(retrievedSweet).toBeUndefined();
        });

        test('should return undefined for non-existent sweet', async () => {
            const retrievedSweet = await dbManager.getSweetById(999);
            expect(retrievedSweet).toBeUndefined();
        });
    });

    describe('Database Operations', () => {
        test('should clear all sweets', async () => {
            await dbManager.addSweet({ name: 'Sweet 1', category: 'Nut-Based', price: 25, quantity: 10 });
            await dbManager.addSweet({ name: 'Sweet 2', category: 'Milk-Based', price: 30, quantity: 5 });

            await dbManager.clearAllSweets();
            const allSweets = await dbManager.getAllSweets();
            expect(allSweets).toHaveLength(0);
        });
    });
});