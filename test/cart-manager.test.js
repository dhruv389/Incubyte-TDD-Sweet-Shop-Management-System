import { CartManager } from '../src/CartManager.js';

describe('CartManager', () => {
    let cartManager;

    beforeEach(() => {
        cartManager = new CartManager();
    });

    describe('Cart Initialization', () => {
        test('should initialize with empty cart', () => {
            expect(cartManager.isEmpty()).toBe(true);
            expect(cartManager.getItems()).toHaveLength(0);
            expect(cartManager.getTotal()).toBe(0);
        });
    });

    describe('Adding Items to Cart', () => {
        test('should add item to cart', async () => {
            const sweet = { id: 1, name: 'Kaju Katli', price: 50 };

            await cartManager.addToCart(sweet, 2);

            const items = cartManager.getItems();
            expect(items).toHaveLength(1);
            expect(items[0]).toMatchObject({
                id: 1,
                name: 'Kaju Katli',
                price: 50,
                quantity: 2
            });
        });

        test('should increase quantity when adding same item', async () => {
            const sweet = { id: 1, name: 'Kaju Katli', price: 50 };

            await cartManager.addToCart(sweet, 2);
            await cartManager.addToCart(sweet, 3);

            const items = cartManager.getItems();
            expect(items).toHaveLength(1);
            expect(items[0].quantity).toBe(5);
        });

        test('should throw error for invalid sweet data', async () => {
            await expect(cartManager.addToCart(null, 1)).rejects.toThrow('Invalid sweet data');
            await expect(cartManager.addToCart({}, 1)).rejects.toThrow('Invalid sweet data');
            await expect(cartManager.addToCart({ id: 1 }, 1)).rejects.toThrow('Invalid sweet data');
        });

        test('should throw error for invalid quantity', async () => {
            const sweet = { id: 1, name: 'Kaju Katli', price: 50 };

            await expect(cartManager.addToCart(sweet, 0)).rejects.toThrow('Quantity must be greater than 0');
            await expect(cartManager.addToCart(sweet, -1)).rejects.toThrow('Quantity must be greater than 0');
        });
    });

    describe('Removing Items from Cart', () => {
        test('should remove item from cart', async () => {
            const sweet = { id: 1, name: 'Kaju Katli', price: 50 };

            await cartManager.addToCart(sweet, 2);
            cartManager.removeFromCart(1);

            expect(cartManager.isEmpty()).toBe(true);
        });

        test('should not affect cart when removing non-existent item', async () => {
            const sweet = { id: 1, name: 'Kaju Katli', price: 50 };

            await cartManager.addToCart(sweet, 2);
            cartManager.removeFromCart(999);

            expect(cartManager.getItems()).toHaveLength(1);
        });
    });

    describe('Updating Item Quantities', () => {
        test('should update item quantity', async () => {
            const sweet = { id: 1, name: 'Kaju Katli', price: 50 };

            await cartManager.addToCart(sweet, 2);
            cartManager.updateQuantity(1, 5);

            const item = cartManager.getItem(1);
            expect(item.quantity).toBe(5);
        });

        test('should remove item when quantity is 0 or negative', async () => {
            const sweet = { id: 1, name: 'Kaju Katli', price: 50 };

            await cartManager.addToCart(sweet, 2);
            cartManager.updateQuantity(1, 0);

            expect(cartManager.isEmpty()).toBe(true);
        });
    });

    describe('Cart Calculations', () => {
        test('should calculate total correctly', async () => {
            const sweet1 = { id: 1, name: 'Kaju Katli', price: 50 };
            const sweet2 = { id: 2, name: 'Gulab Jamun', price: 10 };

            await cartManager.addToCart(sweet1, 2); // 50 * 2 = 100
            await cartManager.addToCart(sweet2, 3); // 10 * 3 = 30

            expect(cartManager.getTotal()).toBe(130);
        });

        test('should calculate item count correctly', async () => {
            const sweet1 = { id: 1, name: 'Kaju Katli', price: 50 };
            const sweet2 = { id: 2, name: 'Gulab Jamun', price: 10 };

            await cartManager.addToCart(sweet1, 2);
            await cartManager.addToCart(sweet2, 3);

            expect(cartManager.getItemCount()).toBe(5);
        });

        test('should return 0 for empty cart calculations', () => {
            expect(cartManager.getTotal()).toBe(0);
            expect(cartManager.getItemCount()).toBe(0);
        });
    });

    describe('Cart State Management', () => {
        test('should clear cart', async () => {
            const sweet = { id: 1, name: 'Kaju Katli', price: 50 };

            await cartManager.addToCart(sweet, 2);
            cartManager.clear();

            expect(cartManager.isEmpty()).toBe(true);
            expect(cartManager.getTotal()).toBe(0);
        });

        test('should get specific item', async () => {
            const sweet = { id: 1, name: 'Kaju Katli', price: 50 };

            await cartManager.addToCart(sweet, 2);
            const item = cartManager.getItem(1);

            expect(item).toMatchObject({
                id: 1,
                name: 'Kaju Katli',
                price: 50,
                quantity: 2
            });
        });

        test('should return undefined for non-existent item', () => {
            const item = cartManager.getItem(999);
            expect(item).toBeUndefined();
        });

        test('should return copy of items to prevent external modification', async () => {
            const sweet = { id: 1, name: 'Kaju Katli', price: 50 };

            await cartManager.addToCart(sweet, 2);
            const items = cartManager.getItems();

            items.push({ id: 999, name: 'Fake', price: 1, quantity: 1 });

            expect(cartManager.getItems()).toHaveLength(1); // Should still be 1
        });
    });
});
