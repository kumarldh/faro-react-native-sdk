import { Platform } from 'react-native';
/**
 * Convert a numeric value to a performance timing string (rounded to nearest ms)
 * Follows the same pattern as web SDK for consistency
 */
export function toPerformanceTimingString(value) {
    if (value == null || typeof value !== 'number') {
        return 'unknown';
    }
    // Round to nearest millisecond and ensure non-negative
    return Math.round(value > 0 ? value : 0).toString();
}
/**
 * Get current platform information
 */
export function getPlatformInfo() {
    return {
        platform: Platform.OS,
        platformVersion: Platform.Version.toString(),
    };
}
/**
 * Get current timestamp in milliseconds
 * Uses performance.now() for high-resolution timing
 */
export function now() {
    if (typeof performance !== 'undefined' && performance.now) {
        return performance.now();
    }
    return Date.now();
}
/**
 * Simple performance marker for tracking timing
 */
export class PerformanceMarker {
    constructor() {
        this.startTime = now();
    }
    /**
     * Mark the end time and return duration
     */
    end() {
        this.endTime = now();
        return this.getDuration();
    }
    /**
     * Get duration in milliseconds
     * If not ended, returns time elapsed so far
     */
    getDuration() {
        var _a;
        const end = (_a = this.endTime) !== null && _a !== void 0 ? _a : now();
        return end - this.startTime;
    }
    /**
     * Get the start time
     */
    getStartTime() {
        return this.startTime;
    }
    /**
     * Check if marker has been ended
     */
    hasEnded() {
        return this.endTime !== undefined;
    }
}
/**
 * Global timing storage for tracking app lifecycle
 */
class PerformanceTimingStore {
    constructor() {
        this.timings = new Map();
        this.markers = new Map();
    }
    /**
     * Store a timing value
     */
    set(key, value) {
        this.timings.set(key, value);
    }
    /**
     * Get a timing value
     */
    get(key) {
        return this.timings.get(key);
    }
    /**
     * Start a performance marker
     */
    startMarker(key) {
        const marker = new PerformanceMarker();
        this.markers.set(key, marker);
        return marker;
    }
    /**
     * End a performance marker and return duration
     */
    endMarker(key) {
        const marker = this.markers.get(key);
        if (!marker) {
            return undefined;
        }
        return marker.end();
    }
    /**
     * Get a performance marker
     */
    getMarker(key) {
        return this.markers.get(key);
    }
    /**
     * Check if a marker exists
     */
    hasMarker(key) {
        return this.markers.has(key);
    }
    /**
     * Clear all timings and markers
     */
    clear() {
        this.timings.clear();
        this.markers.clear();
    }
}
/**
 * Global performance timing store
 * Used to track app-wide performance metrics
 */
export const performanceStore = new PerformanceTimingStore();
//# sourceMappingURL=performanceUtils.js.map