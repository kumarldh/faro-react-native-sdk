import { BaseInstrumentation } from '@grafana/faro-core';
import type { ANRInstrumentationOptions } from './types';
/**
 * ANR (Application Not Responding) Detection Instrumentation.
 *
 * Detects when the main/UI thread is blocked for extended periods on Android.
 * Uses a background thread that posts tasks to the main thread and monitors
 * if they complete within the timeout.
 *
 * **Note**: ANR detection is only available on Android. iOS does not have
 * the same ANR concept as Android's system watchdog.
 *
 * Sends telemetry via Faro API:
 * - Measurement: `anr` with `anr_count` value (for dashboards)
 * - Error: Each ANR with `type: 'ANR'`, stack trace, duration, timestamp (Sentry-aligned)
 *
 * @example
 * ```typescript
 * import { initializeFaro, ANRInstrumentation } from '@grafana/faro-react-native';
 *
 * initializeFaro({
 *   url: 'https://collector.example.com',
 *   instrumentations: [
 *     new ANRInstrumentation({
 *       timeout: 5000,        // 5 second threshold
 *       pollingInterval: 60000, // Poll every 60 seconds
 *     }),
 *   ],
 * });
 * ```
 */
export declare class ANRInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native:instrumentation-anr";
    readonly version = "2.3.1";
    private readonly options;
    private pollingIntervalId;
    constructor(options?: ANRInstrumentationOptions);
    initialize(): void;
    private getNativeModule;
    private startNativeTracking;
    private checkANRStatus;
    /**
     * Clean up resources when instrumentation is disabled.
     */
    unpatch(): void;
}
