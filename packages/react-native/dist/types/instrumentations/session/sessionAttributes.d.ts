/**
 * Session attributes for React Native
 * These attributes are automatically included with every telemetry event
 *
 * Core attributes match Flutter SDK format, with additional mobile-specific
 * monitoring fields (memory, device type, battery, etc.)
 *
 * SDK name, core version, and npm adapter are on Faro meta `sdk` (`getSdkMeta` in `metas/sdk.ts`).
 *
 * `react_native_version` is the host app's React Native **framework** version from `Platform`, not the Faro package.
 */
export interface SessionAttributes {
    /** Host app's React Native framework version (e.g. "0.75.1") from `Platform.constants`. */
    react_native_version: string;
    /** Operating system ("iOS" or "Android") */
    device_os?: string;
    /** OS version (e.g., "17.0" for iOS, "15" for Android) */
    device_os_version?: string;
    /** Detailed OS info (e.g., "iOS 17.0" or "Android 15 (SDK 35)") */
    device_os_detail?: string;
    /** Device manufacturer (e.g., "apple", "samsung") */
    device_manufacturer?: string;
    /** Raw model identifier (e.g., "iPhone16,1", "SM-A155F") */
    device_model?: string;
    /** Human-readable model name (e.g., "iPhone 15 Pro") */
    device_model_name?: string;
    /** Device brand (e.g., "iPhone", "samsung") */
    device_brand?: string;
    /** Whether device is physical or emulator ("true" or "false") */
    device_is_physical?: string;
    /** Unique device ID (UUID) */
    device_id?: string;
    /** Device type ("mobile" or "tablet") */
    device_type?: string;
    /** Total device memory in bytes */
    device_memory_total?: string;
    /** Currently used memory in bytes */
    device_memory_used?: string;
    /** Battery level percentage (e.g., "85") - empty if unavailable */
    device_battery_level?: string;
    /** Whether device is charging ("true" or "false") - empty if unavailable */
    device_is_charging?: string;
    /** Whether low power mode is enabled ("true" or "false") - empty if unavailable */
    device_low_power_mode?: string;
    /** Mobile carrier name (e.g., "Verizon") - empty if unavailable */
    device_carrier?: string;
}
/**
 * Session attributes without device props when async collection or DeviceInfo is unavailable.
 * No synchronous DeviceInfo reads — use {@link getSessionAttributes} or the package async `initializeFaro`.
 */
export declare function minimalSessionDeviceAttributes(): SessionAttributes;
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
export declare function getSessionAttributes(): Promise<SessionAttributes>;
/**
 * Await full async session device attributes (battery, carrier, etc.), then fall back to
 * {@link minimalSessionDeviceAttributes} if anything throws. Used by async `initializeFaro`.
 */
export declare function loadSessionDeviceAttributesForInit(): Promise<SessionAttributes>;
