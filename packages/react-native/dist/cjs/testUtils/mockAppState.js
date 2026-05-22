"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockAppState = mockAppState;
/**
 * Mock AppState for testing
 */
function mockAppState() {
    var listeners = new Set();
    var mockAppState = {
        currentState: 'active',
        addEventListener: jest.fn(function (event, handler) {
            if (event === 'change') {
                listeners.add(handler);
            }
            return {
                remove: jest.fn(function () {
                    listeners.delete(handler);
                }),
            };
        }),
        removeEventListener: jest.fn(function (event, handler) {
            if (event === 'change') {
                listeners.delete(handler);
            }
        }),
    };
    jest.mock('react-native/Libraries/AppState/AppState', function () { return mockAppState; });
    return {
        setCurrentState: function (state) {
            mockAppState.currentState = state;
        },
        triggerChange: function (state) {
            mockAppState.currentState = state;
            listeners.forEach(function (listener) { return listener(state); });
        },
    };
}
//# sourceMappingURL=mockAppState.js.map