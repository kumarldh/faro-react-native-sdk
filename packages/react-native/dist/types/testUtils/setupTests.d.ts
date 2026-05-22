/**
 * Jest setup file for React Native tests
 * Mocks third-party React Native dependencies
 */
declare const mockAsyncStorageImpl: {
    getItem: jest.Mock<Promise<any>, [key: string], any>;
    setItem: jest.Mock<Promise<void>, [key: string, value: string], any>;
    removeItem: jest.Mock<Promise<void>, [key: string], any>;
    clear: jest.Mock<Promise<void>, [], any>;
    getAllKeys: jest.Mock<Promise<string[]>, [], any>;
    multiGet: jest.Mock<Promise<any[][]>, [keys: string[]], any>;
    multiSet: jest.Mock<Promise<void>, [keyValuePairs: [string, string][]], any>;
    multiRemove: jest.Mock<Promise<void>, [keys: string[]], any>;
};
