"use strict";
/**
 * Jest setup file for React Native tests
 * Mocks third-party React Native dependencies
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// Mock react-native-device-info
jest.mock('react-native-device-info', function () {
    var mockDeviceInfo = {
        getBrand: jest.fn(function () { return 'Apple'; }),
        getDeviceId: jest.fn(function () { return 'iPhone14,2'; }),
        getModel: jest.fn(function () { return 'iPhone 13 Pro'; }),
        getSystemName: jest.fn(function () { return 'iOS'; }),
        getSystemVersion: jest.fn(function () { return '16.0'; }),
        getVersion: jest.fn(function () { return '1.0.0'; }),
        isTablet: jest.fn(function () { return false; }),
        isEmulatorSync: jest.fn(function () { return false; }),
        getTotalMemorySync: jest.fn(function () { return 6442450944; }), // 6GB in bytes
        getUsedMemorySync: jest.fn(function () { return 2147483648; }), // 2GB in bytes
        getBatteryLevel: jest.fn(function () { return Promise.resolve(0.75); }),
        getCarrier: jest.fn(function () { return Promise.resolve('T-Mobile'); }),
        isPowerSaveMode: jest.fn(function () { return Promise.resolve(false); }),
        isBatteryCharging: jest.fn(function () { return Promise.resolve(false); }),
    };
    return __assign({ __esModule: true, default: mockDeviceInfo }, mockDeviceInfo);
});
// Mock @react-native-async-storage/async-storage
// Using a global storage object that can be accessed by tests
global.mockAsyncStorage = {};
var mockAsyncStorageImpl = {
    getItem: jest.fn(function (key) {
        var _a;
        var storage = global.mockAsyncStorage;
        return Promise.resolve((_a = storage[key]) !== null && _a !== void 0 ? _a : null);
    }),
    setItem: jest.fn(function (key, value) {
        var storage = global.mockAsyncStorage;
        storage[key] = value;
        return Promise.resolve();
    }),
    removeItem: jest.fn(function (key) {
        var storage = global.mockAsyncStorage;
        delete storage[key];
        return Promise.resolve();
    }),
    clear: jest.fn(function () {
        global.mockAsyncStorage = {};
        return Promise.resolve();
    }),
    getAllKeys: jest.fn(function () {
        var storage = global.mockAsyncStorage;
        return Promise.resolve(Object.keys(storage));
    }),
    multiGet: jest.fn(function (keys) {
        var storage = global.mockAsyncStorage;
        return Promise.resolve(keys.map(function (key) { var _a; return [key, (_a = storage[key]) !== null && _a !== void 0 ? _a : null]; }));
    }),
    multiSet: jest.fn(function (keyValuePairs) {
        var storage = global.mockAsyncStorage;
        keyValuePairs.forEach(function (_a) {
            var key = _a[0], value = _a[1];
            storage[key] = value;
        });
        return Promise.resolve();
    }),
    multiRemove: jest.fn(function (keys) {
        var storage = global.mockAsyncStorage;
        keys.forEach(function (key) { return delete storage[key]; });
        return Promise.resolve();
    }),
};
jest.mock('@react-native-async-storage/async-storage', function () { return ({
    __esModule: true,
    default: mockAsyncStorageImpl,
}); });
// Ensure Platform.Version is properly mocked
// The react-native preset mocks Platform, but we need to ensure Version is accessible
jest.mock('react-native/Libraries/Utilities/Platform', function () { return ({
    OS: 'ios',
    Version: '16.0',
    select: jest.fn(function (obj) { return obj.ios || obj.default; }),
}); }, { virtual: true });
// Mock fetch API globals for HTTP instrumentation tests
if (typeof global.Response === 'undefined') {
    global.Response = /** @class */ (function () {
        function Response(body, init) {
            var _a, _b;
            this.body = body;
            this.status = (_a = init === null || init === void 0 ? void 0 : init.status) !== null && _a !== void 0 ? _a : 200;
            this.statusText = (_b = init === null || init === void 0 ? void 0 : init.statusText) !== null && _b !== void 0 ? _b : 'OK';
            this.ok = this.status >= 200 && this.status < 300;
        }
        return Response;
    }());
}
if (typeof global.Request === 'undefined') {
    global.Request = /** @class */ (function () {
        function Request(input, init) {
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
                var req = input;
                this.url = req.url;
                this.method = (_d = (_c = init === null || init === void 0 ? void 0 : init.method) !== null && _c !== void 0 ? _c : req.method) !== null && _d !== void 0 ? _d : 'GET';
            }
        }
        return Request;
    }());
}
if (typeof global.URL === 'undefined') {
    global.URL = /** @class */ (function () {
        function URL(url) {
            this.href = url;
        }
        return URL;
    }());
}
/**
 * Minimal XMLHttpRequest for Jest (Node has no XHR). Patches in XHRInstrumentation
 * tests attach to this prototype; send() completes asynchronously like a real request.
 */
if (typeof global.XMLHttpRequest === 'undefined') {
    var MockXMLHttpRequest_1 = /** @class */ (function () {
        function MockXMLHttpRequest() {
            this.readyState = 0;
            this.status = 200;
            this.statusText = 'OK';
            this.onreadystatechange = null;
            this.listeners = new Map();
        }
        MockXMLHttpRequest.prototype.open = function (_method, _url) {
            // Real open is replaced by instrumentation; baseline is a no-op.
        };
        MockXMLHttpRequest.prototype.send = function (_body) {
            var _this = this;
            // Synchronous completion matches test doubles and ensures Faro pushEvent runs in the same turn as send().
            this.readyState = MockXMLHttpRequest.DONE;
            var ev = { type: 'readystatechange' };
            if (this.onreadystatechange) {
                this.onreadystatechange.call(this, ev);
            }
            var load = this.listeners.get('load');
            if (load) {
                load.forEach(function (fn) {
                    fn.call(_this, ev);
                });
            }
        };
        MockXMLHttpRequest.prototype.setRequestHeader = function (_name, _value) { };
        MockXMLHttpRequest.prototype.getResponseHeader = function (_name) {
            return null;
        };
        MockXMLHttpRequest.prototype.addEventListener = function (type, listener) {
            var set = this.listeners.get(type);
            if (!set) {
                set = new Set();
                this.listeners.set(type, set);
            }
            set.add(listener);
        };
        MockXMLHttpRequest.prototype.removeEventListener = function (type, listener) {
            var _a;
            (_a = this.listeners.get(type)) === null || _a === void 0 ? void 0 : _a.delete(listener);
        };
        MockXMLHttpRequest.prototype.abort = function () { };
        MockXMLHttpRequest.DONE = 4;
        return MockXMLHttpRequest;
    }());
    global.XMLHttpRequest = MockXMLHttpRequest_1;
}
//# sourceMappingURL=setupTests.js.map