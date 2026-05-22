import { BaseInstrumentation } from '@grafana/faro-core';
import type { TracingInstrumentationOptions } from './types';
/**
 * TracingInstrumentation for React Native
 *
 * Enables distributed tracing with OpenTelemetry for React Native applications.
 *
 * IMPORTANT: Infinite loop prevention
 * - Uses internalLogger for debugging instead of console
 * - Collector URLs are added to ignoreUrls in HTTP instrumentation
 * - BatchSpanProcessor delays span export to avoid blocking
 * - No console logging during trace export
 *
 * Example usage:
 * ```ts
 * import { initializeFaro } from '@grafana/faro-react-native';
 * import { TracingInstrumentation } from '@grafana/faro-react-native-tracing';
 *
 * initializeFaro({
 *   // ... other config
 *   instrumentations: [
 *     new TracingInstrumentation({
 *       propagateTraceHeaderCorsUrls: [/https:\\/\\/my-api\\.com/],
 *     }),
 *   ],
 * });
 * ```
 */
export declare class TracingInstrumentation extends BaseInstrumentation {
    private options;
    name: string;
    version: string;
    static SCHEDULED_BATCH_DELAY_MS: number;
    private provider?;
    constructor(options?: TracingInstrumentationOptions);
    initialize(): void;
    /**
     * Get ignore URLs from all transports to avoid tracing collector requests
     * CRITICAL: This prevents infinite loops where trace exports trigger more traces
     */
    private getIgnoreUrls;
    /**
     * Shutdown the tracer provider
     */
    shutdown(): Promise<void>;
}
