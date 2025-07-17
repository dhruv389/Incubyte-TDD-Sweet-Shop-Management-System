// Test setup file for Jest
const FDBFactory = require('fake-indexeddb/lib/FDBFactory');
const FDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');

// Setup fake IndexedDB for testing
global.indexedDB = new FDBFactory();
global.IDBKeyRange = FDBKeyRange;

// Mock window object for browser-specific code
global.window = {
    indexedDB: global.indexedDB,
    IDBKeyRange: global.IDBKeyRange
};

// Suppress console.log during tests unless explicitly needed
global.console = {
    ...console,
    log: jest.fn(),
    error: console.error,
    warn: console.warn,
    info: console.info
};