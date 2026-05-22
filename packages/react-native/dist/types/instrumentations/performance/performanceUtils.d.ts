/**
 * Convert a numeric value to a performance timing string (rounded to nearest ms)
 * Follows the same pattern as web SDK for consistency
 */
export declare function toPerformanceTimingString(value: number | null | undefined): string;
/**
 * Get current platform information
 */
export declare function getPlatformInfo(): {
    platform: string;
    platformVersion: string;
};
/**
 * Get current timestamp in milliseconds
 * Uses performance.now() for high-resolution timing
 */
export declare function now(): number;
/**
 * Simple performance marker for tracking timing
 */
export declare class PerformanceMarker {
    private startTime;
    private endTime?;
    constructor();
    /**
     * Mark the end time and return duration
     */
    end(): number;
    /**
     * Get duration in milliseconds
     * If not ended, returns time elapsed so far
     */
    getDuration(): number;
    /**
     * Get the start time
     */
    getStartTime(): number;
    /**
     * Check if marker has been ended
     */
    hasEnded(): boolean;
}
/**
 * Global timing storage for tracking app lifecycle
 */
declare class PerformanceTimingStore {
    private timings;
    private markers;
    /**
     * Store a timing value
     */
    set(key: string, value: number): void;
    /**
     * Get a timing value
     */
    get(key: string): number | undefined;
    /**
     * Start a performance marker
     */
    startMarker(key: string): PerformanceMarker;
    /**
     * End a performance marker and return duration
     */
    endMarker(key: string): number | undefined;
    /**
     * Get a performance marker
     */
    getMarker(key: string): PerformanceMarker | undefined;
    /**
     * Check if a marker exists
     */
    hasMarker(key: string): boolean;
    /**
     * Clear all timings and markers
     */
    clear(): void;
}
/**
 * Global performance timing store
 * Used to track app-wide performance metrics
 */
export declare const performanceStore: PerformanceTimingStore;
export {};
