var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { BaseInstrumentation, VERSION } from '@grafana/faro-core';
/**
 * Default configuration values matching Flutter SDK's hardcoded values.
 * These are React Native-specific advanced options for customization.
 */
const DEFAULT_TARGET_FPS = 60;
const DEFAULT_FROZEN_FRAME_THRESHOLD_MS = 100;
const DEFAULT_REFRESH_RATE_POLLING_INTERVAL = 30000;
const DEFAULT_NORMALIZED_REFRESH_RATE = 60;
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
export class FrameMonitoringInstrumentation extends BaseInstrumentation {
    constructor(options = {}) {
        var _a, _b, _c, _d;
        super();
        this.name = '@grafana/faro-react-native:instrumentation-frame-monitoring';
        this.version = VERSION;
        this.pollingIntervalId = null;
        this.eventEmitter = null;
        this.eventSubscriptions = [];
        this.options = {
            targetFps: (_a = options.targetFps) !== null && _a !== void 0 ? _a : DEFAULT_TARGET_FPS,
            frozenFrameThresholdMs: (_b = options.frozenFrameThresholdMs) !== null && _b !== void 0 ? _b : DEFAULT_FROZEN_FRAME_THRESHOLD_MS,
            refreshRatePollingInterval: (_c = options.refreshRatePollingInterval) !== null && _c !== void 0 ? _c : DEFAULT_REFRESH_RATE_POLLING_INTERVAL,
            normalizedRefreshRate: (_d = options.normalizedRefreshRate) !== null && _d !== void 0 ? _d : DEFAULT_NORMALIZED_REFRESH_RATE,
        };
    }
    /**
     * Check if refresh rate vitals are enabled in Faro config.
     * Reads from faro.config.refreshRateVitals (single source of truth).
     */
    get refreshRateVitalsEnabled() {
        var _a;
        // Access config via this.config which is set by BaseInstrumentation after initialization
        const config = this.config;
        return (_a = config === null || config === void 0 ? void 0 : config.refreshRateVitals) !== null && _a !== void 0 ? _a : false;
    }
    initialize() {
        this.logDebug('Initializing frame monitoring instrumentation');
        const nativeModule = this.getNativeModule();
        if (!nativeModule) {
            this.logWarn('Native module not available for frame monitoring');
            return;
        }
        // Start native frame monitoring with configuration
        this.startNativeMonitoring(nativeModule);
        // Set up event listeners for real-time frame events (Android pattern)
        this.setupEventListeners(nativeModule);
        // Set up polling for periodic metrics collection (iOS pattern)
        this.startPolling();
    }
    getNativeModule() {
        const { FaroReactNativeModule } = NativeModules;
        if (!FaroReactNativeModule) {
            return null;
        }
        return FaroReactNativeModule;
    }
    startNativeMonitoring(nativeModule) {
        try {
            if (typeof nativeModule.startFrameMonitoring === 'function') {
                nativeModule.startFrameMonitoring({
                    targetFps: this.options.targetFps,
                    frozenFrameThresholdMs: this.options.frozenFrameThresholdMs,
                    normalizedRefreshRate: this.options.normalizedRefreshRate,
                });
                this.logDebug('Started native frame monitoring');
            }
        }
        catch (error) {
            this.logError('Failed to start native frame monitoring', error);
        }
    }
    setupEventListeners(nativeModule) {
        // Android uses event-based approach for frozen frames only
        // Slow frames are retrieved via polling (like iOS) to avoid flooding
        if (Platform.OS === 'android') {
            try {
                this.eventEmitter = new NativeEventEmitter(nativeModule);
                // Listen for frozen frame events
                const frozenFrameSubscription = this.eventEmitter.addListener('onFrozenFrame', (data) => {
                    // Support both formats: number (legacy) or object (with duration)
                    if (typeof data === 'number') {
                        this.handleFrozenFrame(data, 0);
                    }
                    else {
                        this.handleFrozenFrame(data.count, data.durationMs || 0);
                    }
                });
                this.eventSubscriptions.push(frozenFrameSubscription);
                // Listen for refresh rate events (only when refreshRateVitals is enabled in config)
                if (this.refreshRateVitalsEnabled) {
                    const refreshRateSubscription = this.eventEmitter.addListener('onRefreshRate', (refreshRate) => {
                        this.handleRefreshRate(refreshRate);
                    });
                    this.eventSubscriptions.push(refreshRateSubscription);
                }
                this.logDebug('Set up Android frame event listeners');
            }
            catch (error) {
                this.logError('Failed to set up frame event listeners', error);
            }
        }
    }
    startPolling() {
        // Both iOS and Android use polling approach for slow frames
        // This provides consistent behavior and avoids flooding with events
        this.pollingIntervalId = setInterval(() => {
            this.pollFrameMetrics();
        }, this.options.refreshRatePollingInterval);
    }
    pollFrameMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            const nativeModule = this.getNativeModule();
            if (!nativeModule) {
                return;
            }
            try {
                // Get refresh rate (only send when refreshRateVitals is enabled in config)
                if (this.refreshRateVitalsEnabled) {
                    if (typeof nativeModule.getRefreshRate === 'function') {
                        const refreshRate = yield nativeModule.getRefreshRate();
                        if (refreshRate !== null && refreshRate > 0) {
                            this.handleRefreshRate(refreshRate);
                        }
                    }
                }
                // Get full frame metrics if available
                if (typeof nativeModule.getFrameMetrics === 'function') {
                    const metrics = (yield nativeModule.getFrameMetrics());
                    if (metrics) {
                        if (this.refreshRateVitalsEnabled && metrics.refreshRate > 0) {
                            this.handleRefreshRate(metrics.refreshRate);
                        }
                        if (metrics.slowFrames > 0) {
                            this.handleSlowFrames(metrics.slowFrames);
                        }
                        if (metrics.frozenFrames > 0) {
                            this.handleFrozenFrame(metrics.frozenFrames, metrics.frozenDurationMs);
                        }
                    }
                }
            }
            catch (error) {
                this.logError('Failed to poll frame metrics', error);
            }
        });
    }
    handleRefreshRate(refreshRate) {
        this.api.pushMeasurement({
            type: 'app_refresh_rate',
            values: { refresh_rate: refreshRate },
        }, { skipDedupe: true });
    }
    handleSlowFrames(count) {
        // Note: Despite the name "slow_frames", this count represents slow frame EVENTS, not individual frames.
        // Each event is a period of consecutive slow frames lasting ≥50ms (~3 frames at 60fps).
        this.api.pushMeasurement({
            type: 'app_frames_rate',
            values: { slow_frames: count },
        }, { skipDedupe: true });
    }
    handleFrozenFrame(count, durationMs) {
        // Only send frozen frame events if duration is greater than 0
        // This filters out any erroneous 0ms frozen frames
        if (durationMs > 0) {
            // 🔍 TEMP DEBUG LOG - Remove after analysis
            console.log(`[Faro DEBUG ${Platform.OS.toUpperCase()}] 🧊 SENDING frozen frame: count=${count}, duration=${durationMs}ms`);
            this.api.pushMeasurement({
                type: 'app_frozen_frame',
                values: {
                    frozen_frames: count,
                    frozen_duration: durationMs,
                },
            }, { skipDedupe: true });
        }
    }
    /**
     * Clean up resources when instrumentation is disabled.
     */
    unpatch() {
        // Stop polling
        if (this.pollingIntervalId !== null) {
            clearInterval(this.pollingIntervalId);
            this.pollingIntervalId = null;
        }
        // Remove event subscriptions
        for (const subscription of this.eventSubscriptions) {
            subscription.remove();
        }
        this.eventSubscriptions = [];
        this.eventEmitter = null;
        // Stop native monitoring
        const nativeModule = this.getNativeModule();
        if (nativeModule && typeof nativeModule.stopFrameMonitoring === 'function') {
            try {
                nativeModule.stopFrameMonitoring();
            }
            catch (error) {
                this.logError('Failed to stop native frame monitoring', error);
            }
        }
        this.logDebug('Frame monitoring instrumentation stopped');
    }
}
//# sourceMappingURL=instrumentation.js.map