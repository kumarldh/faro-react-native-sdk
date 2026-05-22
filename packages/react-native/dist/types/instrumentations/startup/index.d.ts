import { BaseInstrumentation } from '@grafana/faro-core';
import type { StartupInstrumentationOptions } from './types';
/**
 * Measures React Native app startup time for both cold and warm starts.
 *
 * Uses native OS APIs for cold start and AppState for warm start:
 * - iOS: sysctl() to query kernel for process start time
 * - Android: Process.getStartElapsedRealtime() from Android OS (API 24+)
 *
 * Implementation aligned with Faro Flutter SDK:
 * https://github.com/grafana/faro-flutter-sdk
 *
 * **Key Features**:
 * - ✅ NO AppDelegate/MainActivity setup required - OS tracks process start automatically!
 * - ✅ Cold start: appStartDuration from native, coldStart: 1
 * - ✅ Warm start: appStartDuration (time to first frame after resume), coldStart: 0
 *
 * **Metrics Captured** (matches Flutter SDK format):
 * - Cold start: `appStartDuration`, `coldStart: 1`
 * - Warm start: `appStartDuration`, `coldStart: 0`
 *
 * **Requirements**:
 * - iOS 13.4+ (any iOS that supports React Native)
 * - Android API 24+ (Android 7.0 Nougat, ~99% of devices as of 2025)
 *
 * @example
 * ```tsx
 * import { initializeFaro } from '@grafana/faro-react-native';
 *
 * initializeFaro({
 *   app: { name: 'my-app', version: '1.0.0' },
 *   url: 'https://your-collector.com',
 * });
 * ```
 * StartupInstrumentation is included by default via makeRNConfig.
 */
export declare class StartupInstrumentation extends BaseInstrumentation {
    private options;
    readonly name = "@grafana/faro-react-native:instrumentation-startup";
    readonly version = "2.3.1";
    /** 0 = came from background (warm start eligible), null = never backgrounded */
    private warmStartTimestamp;
    private appStateSubscription;
    constructor(options?: StartupInstrumentationOptions);
    initialize(): void;
    /**
     * Captures cold start duration from native (process start to Faro init).
     * Matches Flutter SDK: appStartDuration + coldStart: 1
     */
    private captureColdStartMetrics;
    /**
     * Tracks warm start: when app resumes from background, measures time to first frame.
     * Matches Flutter SDK: setWarmStart on resume, getWarmStart after postFrameCallback.
     */
    private setupWarmStartTracking;
    unpatch(): void;
}
