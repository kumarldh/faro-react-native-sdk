import { BaseInstrumentation } from '@grafana/faro-core';
import type { FrameMonitoringOptions } from './types';
/**
 * Frame Monitoring Instrumentation for React Native.
 *
 * Monitors frame rendering performance and detects slow/frozen frames.
 * Uses native CADisplayLink (iOS) and Choreographer (Android) for accurate metrics.
 *
 * ## Slow Frame Detection
 * Slow frames are detected using **event-based grouping** to report user-perceptible jank:
 * - Tracks consecutive frames below `targetFps` as a single "slow frame event"
 * - Only counts events lasting ≥50ms (~3 frames at 60fps) to filter noise
 * - This prevents reporting normal microsecond variations as slow frames
 * - Reports meaningful performance degradation that affects user experience
 *
 * ## Frozen Frame Detection
 * Frozen frames are individual frames exceeding `frozenFrameThresholdMs` (default 100ms).
 * These represent severe jank where the app appears unresponsive.
 *
 * Sends measurements via Faro API:
 * - `app_refresh_rate`: Current refresh rate in FPS
 * - `app_frames_rate`: Number of slow frame events (not individual frames)
 * - `app_frozen_frame`: Number of frozen frames (exceeding frozenFrameThresholdMs)
 *
 * @example
 * ```typescript
 * import { initializeFaro, FrameMonitoringInstrumentation } from '@grafana/faro-react-native';
 *
 * initializeFaro({
 *   url: 'https://collector.example.com',
 *   instrumentations: [
 *     new FrameMonitoringInstrumentation({
 *       targetFps: 60,
 *       frozenFrameThresholdMs: 100,
 *       refreshRatePollingInterval: 30000,
 *     }),
 *   ],
 * });
 * ```
 */
export declare class FrameMonitoringInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native:instrumentation-frame-monitoring";
    readonly version = "2.3.1";
    private readonly options;
    private pollingIntervalId;
    private eventEmitter;
    private eventSubscriptions;
    constructor(options?: FrameMonitoringOptions);
    /**
     * Check if refresh rate vitals are enabled in Faro config.
     * Reads from faro.config.refreshRateVitals (single source of truth).
     */
    private get refreshRateVitalsEnabled();
    initialize(): void;
    private getNativeModule;
    private startNativeMonitoring;
    private setupEventListeners;
    private startPolling;
    private pollFrameMetrics;
    private handleRefreshRate;
    private handleSlowFrames;
    private handleFrozenFrame;
    /**
     * Clean up resources when instrumentation is disabled.
     */
    unpatch(): void;
}
