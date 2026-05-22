"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockReactNativeModules = mockReactNativeModules;
/**
 * Mock React Native global modules for testing
 */
function mockReactNativeModules() {
    // Mock Platform
    jest.mock('react-native/Libraries/Utilities/Platform', function () { return ({
        OS: 'ios',
        Version: '16.0',
        select: jest.fn(function (obj) { return obj.ios; }),
    }); });
    // Mock Dimensions
    jest.mock('react-native/Libraries/Utilities/Dimensions', function () { return ({
        get: jest.fn(function () { return ({
            width: 375,
            height: 812,
            scale: 3,
            fontScale: 1,
        }); }),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    }); });
}
//# sourceMappingURL=mockReactNativeModules.js.map