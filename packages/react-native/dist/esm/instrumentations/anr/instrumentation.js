var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NativeModules, Platform } from 'react-native';
import { BaseInstrumentation, VERSION } from '@grafana/faro-core';
import { ErrorMechanism } from '../errors/const';
/**
 * Default timeout for ANR detection (5 seconds, matching Android's threshold)
 */
const DEFAULT_TIMEOUT = 5000;
/**
 * Default polling interval for ANR status (60 seconds, matching Flutter SDK)
 */
const DEFAULT_POLLING_INTERVAL = 60000;
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
export class ANRInstrumentation extends BaseInstrumentation {
    constructor(options = {}) {
        var _a, _b;
        super();
        this.name = '@grafana/faro-react-native:instrumentation-anr';
        this.version = VERSION;
        this.pollingIntervalId = null;
        this.options = {
            timeout: (_a = options.timeout) !== null && _a !== void 0 ? _a : DEFAULT_TIMEOUT,
            pollingInterval: (_b = options.pollingInterval) !== null && _b !== void 0 ? _b : DEFAULT_POLLING_INTERVAL,
        };
    }
    initialize() {
        // ANR detection is only available on Android
        if (Platform.OS !== 'android') {
            this.logDebug('ANR detection is only available on Android');
            return;
        }
        const nativeModule = this.getNativeModule();
        if (!nativeModule) {
            this.logWarn('Native module not available for ANR detection');
            return;
        }
        this.logDebug('Initializing ANR detection instrumentation');
        // Start native ANR tracking
        this.startNativeTracking(nativeModule);
        // Set up polling for ANR status
        this.pollingIntervalId = setInterval(() => {
            this.checkANRStatus(nativeModule);
        }, this.options.pollingInterval);
    }
    getNativeModule() {
        const { FaroReactNativeModule } = NativeModules;
        if (!FaroReactNativeModule) {
            return null;
        }
        return FaroReactNativeModule;
    }
    startNativeTracking(nativeModule) {
        try {
            if (typeof nativeModule.startANRTracking === 'function') {
                nativeModule.startANRTracking({
                    timeout: this.options.timeout,
                });
                this.logDebug('Started native ANR tracking');
            }
        }
        catch (error) {
            this.logError('Failed to start native ANR tracking', error);
        }
    }
    checkANRStatus(nativeModule) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof nativeModule.getANRStatus !== 'function') {
                    return;
                }
                const anrList = (yield nativeModule.getANRStatus());
                if (anrList && anrList.length > 0) {
                    // Push measurement for ANR count (matching Flutter pattern)
                    this.api.pushMeasurement({
                        type: 'anr',
                        values: { anr_count: anrList.length },
                    }, { skipDedupe: true });
                    // Push each ANR as an error with type='ANR' for filtering (Sentry-aligned)
                    for (const anrJson of anrList) {
                        try {
                            const anr = JSON.parse(anrJson);
                            this.api.pushError(new Error('ANR (Application Not Responding)'), {
                                context: {
                                    duration: String(anr.duration),
                                    mechanism: ErrorMechanism.ANR,
                                    stacktrace: anr.stacktrace,
                                    timestamp: String(anr.timestamp),
                                },
                                type: 'ANR',
                            });
                        }
                        catch (_a) {
                            // If parsing fails, still log the raw ANR
                            this.api.pushError(new Error('ANR (Application Not Responding)'), {
                                context: {
                                    mechanism: ErrorMechanism.ANR,
                                    raw: anrJson,
                                },
                                type: 'ANR',
                            });
                        }
                    }
                    this.logDebug(`Recorded ${anrList.length} ANR event(s)`);
                }
            }
            catch (error) {
                this.logError('Failed to check ANR status', error);
            }
        });
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
        // Stop native tracking
        if (Platform.OS === 'android') {
            const nativeModule = this.getNativeModule();
            if (nativeModule && typeof nativeModule.stopANRTracking === 'function') {
                try {
                    nativeModule.stopANRTracking();
                }
                catch (error) {
                    this.logError('Failed to stop native ANR tracking', error);
                }
            }
        }
        this.logDebug('ANR instrumentation stopped');
    }
}
//# sourceMappingURL=instrumentation.js.map