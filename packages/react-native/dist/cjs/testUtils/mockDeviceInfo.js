"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockDeviceInfo = mockDeviceInfo;
/**
 * Mock react-native-device-info for testing
 */
function mockDeviceInfo() {
    jest.mock('react-native-device-info', function () { return ({
        default: {
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
        },
    }); });
}
//# sourceMappingURL=mockDeviceInfo.js.map