"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.minimalSessionDeviceAttributes = minimalSessionDeviceAttributes;
exports.getSessionAttributes = getSessionAttributes;
exports.loadSessionDeviceAttributesForInit = loadSessionDeviceAttributesForInit;
var react_native_1 = require("react-native");
var react_native_device_info_1 = __importDefault(require("react-native-device-info"));
/**
 * React Native framework version from `Platform.constants` (host app runtime), not `@grafana/faro-react-native` semver.
 */
function getReactNativeVersion() {
    try {
        var version = react_native_1.Platform.constants.reactNativeVersion;
        if (version && typeof version === 'object') {
            var _a = version, major = _a.major, minor = _a.minor, patch = _a.patch, prerelease = _a.prerelease;
            var versionString = "".concat(major, ".").concat(minor, ".").concat(patch);
            if (prerelease) {
                versionString += "-rc.".concat(prerelease);
            }
            return versionString;
        }
        return 'unknown';
    }
    catch (_error) {
        return 'unknown';
    }
}
/**
 * Get device ID using react-native-device-info
 * Returns unique device identifier or 'unknown' on error
 */
function getDeviceId() {
    return __awaiter(this, void 0, void 0, function () {
        var _error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, react_native_device_info_1.default.getUniqueId()];
                case 1: 
                // getUniqueId returns a UUID that persists across app installations
                return [2 /*return*/, _a.sent()];
                case 2:
                    _error_1 = _a.sent();
                    return [2 /*return*/, 'unknown'];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get OS detail string matching Flutter SDK format
 * iOS: "iOS 17.0"
 * Android: "Android 15 (SDK 35)"
 */
function getDeviceOsDetail() {
    return __awaiter(this, void 0, void 0, function () {
        var systemName, systemVersion, apiLevel, _error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    systemName = react_native_device_info_1.default.getSystemName();
                    systemVersion = react_native_device_info_1.default.getSystemVersion();
                    if (!(react_native_1.Platform.OS === 'android')) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, react_native_device_info_1.default.getApiLevel()];
                case 2:
                    apiLevel = _a.sent();
                    return [2 /*return*/, "".concat(systemName, " ").concat(systemVersion, " (SDK ").concat(apiLevel, ")")];
                case 3:
                    _error_2 = _a.sent();
                    return [2 /*return*/, "".concat(systemName, " ").concat(systemVersion)];
                case 4: return [2 /*return*/, "".concat(systemName, " ").concat(systemVersion)];
            }
        });
    });
}
/**
 * Session attributes without device props when async collection or DeviceInfo is unavailable.
 * No synchronous DeviceInfo reads — use {@link getSessionAttributes} or the package async `initializeFaro`.
 */
function minimalSessionDeviceAttributes() {
    return {
        react_native_version: getReactNativeVersion(),
    };
}
/**
 * Get all session attributes
 * These attributes are automatically included with every telemetry event
 *
 * Core attributes matching Flutter SDK:
 * - react_native_version (RN framework in the host app)
 * - device_os, device_os_version, device_os_detail
 * - device_manufacturer, device_model, device_model_name
 * - device_brand, device_is_physical, device_id
 *
 * Additional monitoring attributes:
 * - device_type (mobile/tablet)
 * - device_memory_total, device_memory_used
 * - device_battery_level, device_is_charging, device_low_power_mode
 * - device_carrier
 */
function getSessionAttributes() {
    return __awaiter(this, void 0, void 0, function () {
        var deviceId, deviceOsDetail, systemName, systemVersion, manufacturer, model, deviceName, brand, isEmulator, isTablet, totalMemory, usedMemory, reactNativeVersion, batteryLevel, isCharging, lowPowerMode, carrier, battery, _error_3, _a, _error_4, _b, _error_5, carrierName, _error_6, attributes, _error_7;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 17, , 18]);
                    return [4 /*yield*/, getDeviceId()];
                case 1:
                    deviceId = _c.sent();
                    return [4 /*yield*/, getDeviceOsDetail()];
                case 2:
                    deviceOsDetail = _c.sent();
                    systemName = react_native_device_info_1.default.getSystemName();
                    systemVersion = react_native_device_info_1.default.getSystemVersion();
                    manufacturer = react_native_device_info_1.default.getManufacturerSync();
                    model = react_native_device_info_1.default.getModel();
                    deviceName = react_native_device_info_1.default.getDeviceNameSync();
                    brand = react_native_device_info_1.default.getBrand();
                    isEmulator = react_native_device_info_1.default.isEmulatorSync();
                    isTablet = react_native_device_info_1.default.isTablet();
                    totalMemory = react_native_device_info_1.default.getTotalMemorySync();
                    usedMemory = react_native_device_info_1.default.getUsedMemorySync();
                    reactNativeVersion = getReactNativeVersion();
                    batteryLevel = void 0;
                    isCharging = void 0;
                    lowPowerMode = void 0;
                    carrier = void 0;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, react_native_device_info_1.default.getBatteryLevel()];
                case 4:
                    battery = _c.sent();
                    if (battery >= 0) {
                        batteryLevel = String(Math.round(battery * 100));
                    }
                    return [3 /*break*/, 6];
                case 5:
                    _error_3 = _c.sent();
                    return [3 /*break*/, 6];
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    _a = String;
                    return [4 /*yield*/, react_native_device_info_1.default.isBatteryCharging()];
                case 7:
                    isCharging = _a.apply(void 0, [_c.sent()]);
                    return [3 /*break*/, 9];
                case 8:
                    _error_4 = _c.sent();
                    return [3 /*break*/, 9];
                case 9:
                    _c.trys.push([9, 12, , 13]);
                    if (!('isPowerSaveMode' in react_native_device_info_1.default)) return [3 /*break*/, 11];
                    _b = String;
                    return [4 /*yield*/, react_native_device_info_1.default.isPowerSaveMode()];
                case 10:
                    lowPowerMode = _b.apply(void 0, [_c.sent()]);
                    _c.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    _error_5 = _c.sent();
                    return [3 /*break*/, 13];
                case 13:
                    _c.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, react_native_device_info_1.default.getCarrier()];
                case 14:
                    carrierName = _c.sent();
                    if (carrierName && carrierName !== 'unknown') {
                        carrier = carrierName;
                    }
                    return [3 /*break*/, 16];
                case 15:
                    _error_6 = _c.sent();
                    return [3 /*break*/, 16];
                case 16:
                    attributes = {
                        react_native_version: reactNativeVersion,
                        device_os: systemName,
                        device_os_version: systemVersion,
                        device_os_detail: deviceOsDetail,
                        device_manufacturer: manufacturer.toLowerCase(),
                        device_model: model,
                        device_model_name: deviceName,
                        device_brand: brand,
                        device_is_physical: String(!isEmulator),
                        device_id: deviceId,
                        device_type: isTablet ? 'tablet' : 'mobile',
                        device_memory_total: String(totalMemory),
                        device_memory_used: String(usedMemory),
                        device_battery_level: batteryLevel,
                        device_is_charging: isCharging,
                        device_low_power_mode: lowPowerMode,
                        device_carrier: carrier,
                    };
                    return [2 /*return*/, attributes];
                case 17:
                    _error_7 = _c.sent();
                    return [2 /*return*/, minimalSessionDeviceAttributes()];
                case 18: return [2 /*return*/];
            }
        });
    });
}
/**
 * Await full async session device attributes (battery, carrier, etc.), then fall back to
 * {@link minimalSessionDeviceAttributes} if anything throws. Used by async `initializeFaro`.
 */
function loadSessionDeviceAttributesForInit() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getSessionAttributes()];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, minimalSessionDeviceAttributes()];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=sessionAttributes.js.map