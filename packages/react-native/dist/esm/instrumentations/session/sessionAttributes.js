var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
/**
 * React Native framework version from `Platform.constants` (host app runtime), not `@grafana/faro-react-native` semver.
 */
function getReactNativeVersion() {
    try {
        const version = Platform.constants.reactNativeVersion;
        if (version && typeof version === 'object') {
            const { major, minor, patch, prerelease } = version;
            let versionString = `${major}.${minor}.${patch}`;
            if (prerelease) {
                versionString += `-rc.${prerelease}`;
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
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // getUniqueId returns a UUID that persists across app installations
            return yield DeviceInfo.getUniqueId();
        }
        catch (_error) {
            return 'unknown';
        }
    });
}
/**
 * Get OS detail string matching Flutter SDK format
 * iOS: "iOS 17.0"
 * Android: "Android 15 (SDK 35)"
 */
function getDeviceOsDetail() {
    return __awaiter(this, void 0, void 0, function* () {
        const systemName = DeviceInfo.getSystemName();
        const systemVersion = DeviceInfo.getSystemVersion();
        if (Platform.OS === 'android') {
            try {
                const apiLevel = yield DeviceInfo.getApiLevel();
                return `${systemName} ${systemVersion} (SDK ${apiLevel})`;
            }
            catch (_error) {
                return `${systemName} ${systemVersion}`;
            }
        }
        return `${systemName} ${systemVersion}`;
    });
}
/**
 * Session attributes without device props when async collection or DeviceInfo is unavailable.
 * No synchronous DeviceInfo reads — use {@link getSessionAttributes} or the package async `initializeFaro`.
 */
export function minimalSessionDeviceAttributes() {
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
export function getSessionAttributes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get device ID asynchronously
            const deviceId = yield getDeviceId();
            const deviceOsDetail = yield getDeviceOsDetail();
            // Get synchronous device info
            const systemName = DeviceInfo.getSystemName();
            const systemVersion = DeviceInfo.getSystemVersion();
            const manufacturer = DeviceInfo.getManufacturerSync();
            const model = DeviceInfo.getModel();
            const deviceName = DeviceInfo.getDeviceNameSync();
            const brand = DeviceInfo.getBrand();
            const isEmulator = DeviceInfo.isEmulatorSync();
            const isTablet = DeviceInfo.isTablet();
            // Memory info
            const totalMemory = DeviceInfo.getTotalMemorySync();
            const usedMemory = DeviceInfo.getUsedMemorySync();
            const reactNativeVersion = getReactNativeVersion();
            // Try to get async device info (battery, carrier)
            let batteryLevel;
            let isCharging;
            let lowPowerMode;
            let carrier;
            try {
                const battery = yield DeviceInfo.getBatteryLevel();
                if (battery >= 0) {
                    batteryLevel = String(Math.round(battery * 100));
                }
            }
            catch (_error) {
                // Battery info not available
            }
            try {
                isCharging = String(yield DeviceInfo.isBatteryCharging());
            }
            catch (_error) {
                // Charging status not available
            }
            try {
                if ('isPowerSaveMode' in DeviceInfo) {
                    lowPowerMode = String(yield DeviceInfo.isPowerSaveMode());
                }
            }
            catch (_error) {
                // Low power mode not available
            }
            try {
                const carrierName = yield DeviceInfo.getCarrier();
                if (carrierName && carrierName !== 'unknown') {
                    carrier = carrierName;
                }
            }
            catch (_error) {
                // Carrier not available
            }
            const attributes = {
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
            return attributes;
        }
        catch (_error) {
            return minimalSessionDeviceAttributes();
        }
    });
}
/**
 * Await full async session device attributes (battery, carrier, etc.), then fall back to
 * {@link minimalSessionDeviceAttributes} if anything throws. Used by async `initializeFaro`.
 */
export function loadSessionDeviceAttributesForInit() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield getSessionAttributes();
        }
        catch (_a) {
            return minimalSessionDeviceAttributes();
        }
    });
}
//# sourceMappingURL=sessionAttributes.js.map