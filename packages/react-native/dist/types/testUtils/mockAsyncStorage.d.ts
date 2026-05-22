/**
 * Mock AsyncStorage for testing
 */
export declare function mockAsyncStorage(): {
    storage: Record<string, string>;
    mockClear: () => void;
};
