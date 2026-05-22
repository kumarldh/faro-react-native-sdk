/**
 * Mock AsyncStorage for testing
 */
export function mockAsyncStorage() {
    const storage = {};
    const mockAsyncStorage = {
        getItem: jest.fn((key) => { var _a; return Promise.resolve((_a = storage[key]) !== null && _a !== void 0 ? _a : null); }),
        setItem: jest.fn((key, value) => {
            storage[key] = value;
            return Promise.resolve();
        }),
        removeItem: jest.fn((key) => {
            delete storage[key];
            return Promise.resolve();
        }),
        clear: jest.fn(() => {
            Object.keys(storage).forEach((key) => delete storage[key]);
            return Promise.resolve();
        }),
        getAllKeys: jest.fn(() => Promise.resolve(Object.keys(storage))),
        multiGet: jest.fn((keys) => Promise.resolve(keys.map((key) => { var _a; return [key, (_a = storage[key]) !== null && _a !== void 0 ? _a : null]; }))),
        multiSet: jest.fn((keyValuePairs) => {
            keyValuePairs.forEach(([key, value]) => {
                storage[key] = value;
            });
            return Promise.resolve();
        }),
        multiRemove: jest.fn((keys) => {
            keys.forEach((key) => delete storage[key]);
            return Promise.resolve();
        }),
    };
    jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
    return {
        storage,
        mockClear: () => {
            Object.keys(storage).forEach((key) => delete storage[key]);
            jest.clearAllMocks();
        },
    };
}
//# sourceMappingURL=mockAsyncStorage.js.map