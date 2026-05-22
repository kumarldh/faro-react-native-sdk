/**
 * PerformanceObserver polyfill for React Native iOS
 *
 * React Native 0.84's native PerformanceObserver has a bug on iOS that throws
 * `bad_variant_access` when the observer callback runs and calls getEntries().
 * This happens in NativePerformance.createObserver when the native bridge
 * returns data that causes a C++ variant access error.
 *
 * OpenTelemetry's FetchInstrumentation (and other libs) may use PerformanceObserver
 * for resource timing. We provide a no-op polyfill on React Native iOS to prevent
 * the crash while preserving refresh rate vitals and other functionality.
 *
 * @see https://github.com/facebook/react-native/issues (PerformanceObserver iOS)
 */
import { Platform } from 'react-native';
const globalObj = (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof global !== 'undefined' && global) ||
    (typeof window !== 'undefined' && window) ||
    {};
const RESOURCE_ENTRY_TYPE = 'resource';
const FARO_RESOURCE_TIMING_PATCH = '__faroResourceTimingPatch';
/**
 * No-op PerformanceObserver that matches the Web API interface.
 * Prevents crashes when React Native's native implementation throws.
 */
class NoopPerformanceObserver {
    constructor(_callback) {
        // Callback is never invoked - avoids triggering the native bug
    }
    observe(_options) {
        // No-op
    }
    disconnect() {
        // No-op
    }
    takeRecords() {
        return [];
    }
}
NoopPerformanceObserver.supportedEntryTypes = [];
/**
 * Apply React Native performance API compatibility patches.
 *
 * Resource Timing lookup is patched on all platforms because OTel web
 * instrumentation can probe it. The PerformanceObserver replacement is
 * iOS-only to avoid the native bad_variant_access crash.
 */
export function applyPerformanceObserverPolyfill() {
    const record = globalObj;
    patchUnsupportedResourceTimingLookup(record);
    if (Platform.OS !== 'ios') {
        return;
    }
    const existing = record['PerformanceObserver'];
    if (existing && existing.name === 'NoopPerformanceObserver') {
        return; // Already applied
    }
    try {
        record['PerformanceObserver'] = NoopPerformanceObserver;
    }
    catch (_a) {
        // Ignore if global is frozen (e.g. in some test environments)
    }
}
function patchUnsupportedResourceTimingLookup(record) {
    const performance = record['performance'];
    if (!(performance === null || performance === void 0 ? void 0 : performance.getEntriesByType) || performance.getEntriesByType[FARO_RESOURCE_TIMING_PATCH]) {
        return;
    }
    const originalGetEntriesByType = performance.getEntriesByType.bind(performance);
    const patchedGetEntriesByType = ((entryType) => {
        if (entryType === RESOURCE_ENTRY_TYPE) {
            // OTel web fetch instrumentation probes browser Resource Timing APIs.
            // React Native does not expose resource entries, and calling through emits
            // "Deprecated API for given entry type." warnings in development.
            return [];
        }
        return originalGetEntriesByType(entryType);
    });
    patchedGetEntriesByType[FARO_RESOURCE_TIMING_PATCH] = true;
    try {
        performance.getEntriesByType = patchedGetEntriesByType;
    }
    catch (_a) {
        // Ignore if performance is read-only in a test or host environment.
    }
}
//# sourceMappingURL=performanceObserverPolyfill.js.map