"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceStore = exports.PerformanceMarker = void 0;
exports.toPerformanceTimingString = toPerformanceTimingString;
exports.getPlatformInfo = getPlatformInfo;
exports.now = now;
var react_native_1 = require("react-native");
/**
 * Convert a numeric value to a performance timing string (rounded to nearest ms)
 * Follows the same pattern as web SDK for consistency
 */
function toPerformanceTimingString(value) {
    if (value == null || typeof value !== 'number') {
        return 'unknown';
    }
    // Round to nearest millisecond and ensure non-negative
    return Math.round(value > 0 ? value : 0).toString();
}
/**
 * Get current platform information
 */
function getPlatformInfo() {
    return {
        platform: react_native_1.Platform.OS,
        platformVersion: react_native_1.Platform.Version.toString(),
    };
}
/**
 * Get current timestamp in milliseconds
 * Uses performance.now() for high-resolution timing
 */
function now() {
    if (typeof performance !== 'undefined' && performance.now) {
        return performance.now();
    }
    return Date.now();
}
/**
 * Simple performance marker for tracking timing
 */
var PerformanceMarker = /** @class */ (function () {
    function PerformanceMarker() {
        this.startTime = now();
    }
    /**
     * Mark the end time and return duration
     */
    PerformanceMarker.prototype.end = function () {
        this.endTime = now();
        return this.getDuration();
    };
    /**
     * Get duration in milliseconds
     * If not ended, returns time elapsed so far
     */
    PerformanceMarker.prototype.getDuration = function () {
        var _a;
        var end = (_a = this.endTime) !== null && _a !== void 0 ? _a : now();
        return end - this.startTime;
    };
    /**
     * Get the start time
     */
    PerformanceMarker.prototype.getStartTime = function () {
        return this.startTime;
    };
    /**
     * Check if marker has been ended
     */
    PerformanceMarker.prototype.hasEnded = function () {
        return this.endTime !== undefined;
    };
    return PerformanceMarker;
}());
exports.PerformanceMarker = PerformanceMarker;
/**
 * Global timing storage for tracking app lifecycle
 */
var PerformanceTimingStore = /** @class */ (function () {
    function PerformanceTimingStore() {
        this.timings = new Map();
        this.markers = new Map();
    }
    /**
     * Store a timing value
     */
    PerformanceTimingStore.prototype.set = function (key, value) {
        this.timings.set(key, value);
    };
    /**
     * Get a timing value
     */
    PerformanceTimingStore.prototype.get = function (key) {
        return this.timings.get(key);
    };
    /**
     * Start a performance marker
     */
    PerformanceTimingStore.prototype.startMarker = function (key) {
        var marker = new PerformanceMarker();
        this.markers.set(key, marker);
        return marker;
    };
    /**
     * End a performance marker and return duration
     */
    PerformanceTimingStore.prototype.endMarker = function (key) {
        var marker = this.markers.get(key);
        if (!marker) {
            return undefined;
        }
        return marker.end();
    };
    /**
     * Get a performance marker
     */
    PerformanceTimingStore.prototype.getMarker = function (key) {
        return this.markers.get(key);
    };
    /**
     * Check if a marker exists
     */
    PerformanceTimingStore.prototype.hasMarker = function (key) {
        return this.markers.has(key);
    };
    /**
     * Clear all timings and markers
     */
    PerformanceTimingStore.prototype.clear = function () {
        this.timings.clear();
        this.markers.clear();
    };
    return PerformanceTimingStore;
}());
/**
 * Global performance timing store
 * Used to track app-wide performance metrics
 */
exports.performanceStore = new PerformanceTimingStore();
//# sourceMappingURL=performanceUtils.js.map