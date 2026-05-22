"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockAsyncStorage = mockAsyncStorage;
/**
 * Mock AsyncStorage for testing
 */
function mockAsyncStorage() {
    var storage = {};
    var mockAsyncStorage = {
        getItem: jest.fn(function (key) { var _a; return Promise.resolve((_a = storage[key]) !== null && _a !== void 0 ? _a : null); }),
        setItem: jest.fn(function (key, value) {
            storage[key] = value;
            return Promise.resolve();
        }),
        removeItem: jest.fn(function (key) {
            delete storage[key];
            return Promise.resolve();
        }),
        clear: jest.fn(function () {
            Object.keys(storage).forEach(function (key) { return delete storage[key]; });
            return Promise.resolve();
        }),
        getAllKeys: jest.fn(function () { return Promise.resolve(Object.keys(storage)); }),
        multiGet: jest.fn(function (keys) { return Promise.resolve(keys.map(function (key) { var _a; return [key, (_a = storage[key]) !== null && _a !== void 0 ? _a : null]; })); }),
        multiSet: jest.fn(function (keyValuePairs) {
            keyValuePairs.forEach(function (_a) {
                var key = _a[0], value = _a[1];
                storage[key] = value;
            });
            return Promise.resolve();
        }),
        multiRemove: jest.fn(function (keys) {
            keys.forEach(function (key) { return delete storage[key]; });
            return Promise.resolve();
        }),
    };
    jest.mock('@react-native-async-storage/async-storage', function () { return mockAsyncStorage; });
    return {
        storage: storage,
        mockClear: function () {
            Object.keys(storage).forEach(function (key) { return delete storage[key]; });
            jest.clearAllMocks();
        },
    };
}
//# sourceMappingURL=mockAsyncStorage.js.map