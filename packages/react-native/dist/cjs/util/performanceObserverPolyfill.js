"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPerformanceObserverPolyfill = applyPerformanceObserverPolyfill;
var react_native_1 = require("react-native");
var globalObj = (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof global !== 'undefined' && global) ||
    (typeof window !== 'undefined' && window) ||
    {};
var RESOURCE_ENTRY_TYPE = 'resource';
var FARO_RESOURCE_TIMING_PATCH = '__faroResourceTimingPatch';
/**
 * No-op PerformanceObserver that matches the Web API interface.
 * Prevents crashes when React Native's native implementation throws.
 */
var NoopPerformanceObserver = /** @class */ (function () {
    function NoopPerformanceObserver(_callback) {
        // Callback is never invoked - avoids triggering the native bug
    }
    NoopPerformanceObserver.prototype.observe = function (_options) {
        // No-op
    };
    NoopPerformanceObserver.prototype.disconnect = function () {
        // No-op
    };
    NoopPerformanceObserver.prototype.takeRecords = function () {
        return [];
    };
    NoopPerformanceObserver.supportedEntryTypes = [];
    return NoopPerformanceObserver;
}());
/**
 * Apply React Native performance API compatibility patches.
 *
 * Resource Timing lookup is patched on all platforms because OTel web
 * instrumentation can probe it. The PerformanceObserver replacement is
 * iOS-only to avoid the native bad_variant_access crash.
 */
function applyPerformanceObserverPolyfill() {
    var record = globalObj;
    patchUnsupportedResourceTimingLookup(record);
    if (react_native_1.Platform.OS !== 'ios') {
        return;
    }
    var existing = record['PerformanceObserver'];
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
    var performance = record['performance'];
    if (!(performance === null || performance === void 0 ? void 0 : performance.getEntriesByType) || performance.getEntriesByType[FARO_RESOURCE_TIMING_PATCH]) {
        return;
    }
    var originalGetEntriesByType = performance.getEntriesByType.bind(performance);
    var patchedGetEntriesByType = (function (entryType) {
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