import {} from 'react-native';
/**
 * Mock AppState for testing
 */
export function mockAppState() {
    const listeners = new Set();
    const mockAppState = {
        currentState: 'active',
        addEventListener: jest.fn((event, handler) => {
            if (event === 'change') {
                listeners.add(handler);
            }
            return {
                remove: jest.fn(() => {
                    listeners.delete(handler);
                }),
            };
        }),
        removeEventListener: jest.fn((event, handler) => {
            if (event === 'change') {
                listeners.delete(handler);
            }
        }),
    };
    jest.mock('react-native/Libraries/AppState/AppState', () => mockAppState);
    return {
        setCurrentState: (state) => {
            mockAppState.currentState = state;
        },
        triggerChange: (state) => {
            mockAppState.currentState = state;
            listeners.forEach((listener) => listener(state));
        },
    };
}
//# sourceMappingURL=mockAppState.js.map