import { DatabaseManager } from './DatabaseManager.js';
import { SweetManager } from './SweetManager.js';
import  {CartManager}  from './CartManager.js';

import { UIManager } from './UIManager.js';

// Declare variables without initializing
let dbManager, sweetManager, cartManager, ui;

async function initApp() {
    try {
        dbManager = new DatabaseManager();
        await dbManager.init();
        
        sweetManager = new SweetManager(dbManager);
        cartManager = new CartManager();
        ui = new UIManager(sweetManager, cartManager);
        
        // Only expose to window AFTER initialization is complete
        window.ui = ui;
        
        console.log('Sweet Shop Management System initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

// Start the application and handle the promise
initApp().catch(console.error);