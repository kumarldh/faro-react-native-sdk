"use strict";
/**
 * Jest setup file for React Native tests
 * Mocks third-party React Native dependencies
 */
// Mock react-native-device-info
jest.mock('react-native-device-info', () => {
    const mockDeviceInfo = {
        getBrand: jest.fn(() => 'Apple'),
        getDeviceId: jest.fn(() => 'iPhone14,2'),
        getModel: jest.fn(() => 'iPhone 13 Pro'),
        getSystemName: jest.fn(() => 'iOS'),
        getSystemVersion: jest.fn(() => '16.0'),
        getVersion: jest.fn(() => '1.0.0'),
        isTablet: jest.fn(() => false),
        isEmulatorSync: jest.fn(() => false),
        getTotalMemorySync: jest.fn(() => 6442450944), // 6GB in bytes
        getUsedMemorySync: jest.fn(() => 2147483648), // 2GB in bytes
        getBatteryLevel: jest.fn(() => Promise.resolve(0.75)),
        getCarrier: jest.fn(() => Promise.resolve('T-Mobile')),
        isPowerSaveMode: jest.fn(() => Promise.resolve(false)),
        isBatteryCharging: jest.fn(() => Promise.resolve(false)),
    };
    return Object.assign({ __esModule: true, default: mockDeviceInfo }, mockDeviceInfo);
});
// Mock @react-native-async-storage/async-storage
// Using a global storage object that can be accessed by tests
global.mockAsyncStorage = {};
const mockAsyncStorageImpl = {
    getItem: jest.fn((key) => {
        var _a;
        const storage = global.mockAsyncStorage;
        return Promise.resolve((_a = storage[key]) !== null && _a !== void 0 ? _a : null);
    }),
    setItem: jest.fn((key, value) => {
        const storage = global.mockAsyncStorage;
        storage[key] = value;
        return Promise.resolve();
    }),
    removeItem: jest.fn((key) => {
        const storage = global.mockAsyncStorage;
        delete storage[key];
        return Promise.resolve();
    }),
    clear: jest.fn(() => {
        global.mockAsyncStorage = {};
        return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => {
        const storage = global.mockAsyncStorage;
        return Promise.resolve(Object.keys(storage));
    }),
    multiGet: jest.fn((keys) => {
        const storage = global.mockAsyncStorage;
        return Promise.resolve(keys.map((key) => { var _a; return [key, (_a = storage[key]) !== null && _a !== void 0 ? _a : null]; }));
    }),
    multiSet: jest.fn((keyValuePairs) => {
        const storage = global.mockAsyncStorage;
        keyValuePairs.forEach(([key, value]) => {
            storage[key] = value;
        });
        return Promise.resolve();
    }),
    multiRemove: jest.fn((keys) => {
        const storage = global.mockAsyncStorage;
        keys.forEach((key) => delete storage[key]);
        return Promise.resolve();
    }),
};
jest.mock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: mockAsyncStorageImpl,
}));
// Ensure Platform.Version is properly mocked
// The react-native preset mocks Platform, but we need to ensure Version is accessible
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'ios',
    Version: '16.0',
    select: jest.fn((obj) => obj.ios || obj.default),
}), { virtual: true });
// Mock fetch API globals for HTTP instrumentation tests
if (typeof global.Response === 'undefined') {
    global.Response = class Response {
        constructor(body, init) {
            var _a, _b;
            this.body = body;
            this.status = (_a = init === null || init === void 0 ? void 0 : init.status) !== null && _a !== void 0 ? _a : 200;
            this.statusText = (_b = init === null || init === void 0 ? void 0 : init.statusText) !== null && _b !== void 0 ? _b : 'OK';
            this.ok = this.status >= 200 && this.status < 300;
        }
    };
}
if (typeof global.Request === 'undefined') {
    global.Request = class Request {
        constructor(input, init) {
            var _a, _b, _c, _d;
            if (typeof input === 'string') {
                this.url = input;
                this.method = (_a = init === null || init === void 0 ? void 0 : init.method) !== null && _a !== void 0 ? _a : 'GET';
            }
            else if (input instanceof URL) {
                this.url = input.href;
                this.method = (_b = init === null || init === void 0 ? void 0 : init.method) !== null && _b !== void 0 ? _b : 'GET';
            }
            else {
                // input is a Request object
                const req = input;
                this.url = req.url;
                this.method = (_d = (_c = init === null || init === void 0 ? void 0 : init.method) !== null && _c !== void 0 ? _c : req.method) !== null && _d !== void 0 ? _d : 'GET';
            }
        }
    };
}
if (typeof global.URL === 'undefined') {
    global.URL = class URL {
        constructor(url) {
            this.href = url;
        }
    };
}
/**
 * Minimal XMLHttpRequest for Jest (Node has no XHR). Patches in XHRInstrumentation
 * tests attach to this prototype; send() completes asynchronously like a real request.
 */
if (typeof global.XMLHttpRequest === 'undefined') {
    class MockXMLHttpRequest {
        constructor() {
            this.readyState = 0;
            this.status = 200;
            this.statusText = 'OK';
            this.onreadystatechange = null;
            this.listeners = new Map();
        }
        open(_method, _url) {
            // Real open is replaced by instrumentation; baseline is a no-op.
        }
        send(_body) {
            // Synchronous completion matches test doubles and ensures Faro pushEvent runs in the same turn as send().
            this.readyState = MockXMLHttpRequest.DONE;
            const ev = { type: 'readystatechange' };
            if (this.onreadystatechange) {
                this.onreadystatechange.call(this, ev);
            }
            const load = this.listeners.get('load');
            if (load) {
                load.forEach((fn) => {
                    fn.call(this, ev);
                });
            }
        }
        setRequestHeader(_name, _value) { }
        getResponseHeader(_name) {
            return null;
        }
        addEventListener(type, listener) {
            let set = this.listeners.get(type);
            if (!set) {
                set = new Set();
                this.listeners.set(type, set);
            }
            set.add(listener);
        }
        removeEventListener(type, listener) {
            var _a;
            (_a = this.listeners.get(type)) === null || _a === void 0 ? void 0 : _a.delete(listener);
        }
        abort() { }
    }
    MockXMLHttpRequest.DONE = 4;
    global.XMLHttpRequest = MockXMLHttpRequest;
}
//# sourceMappingURL=setupTests.js.map