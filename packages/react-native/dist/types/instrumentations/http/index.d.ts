import { BaseInstrumentation } from '@grafana/faro-core';
export type { HttpRequestPayload } from './utils';
/**
 * HTTP instrumentation for React Native
 *
 * Tracks fetch API calls and emits faro.tracing.fetch events (Web SDK format).
 * Compatible with Grafana Frontend Observability HTTP insights.
 * Automatically captures:
 * - Request URL, method, and timing
 * - Response status codes (0 for network errors)
 * - Request duration
 * - Request/response size (bytes; best-effort)
 * - Network errors
 *
 * @example
 * ```tsx
 * import { initializeFaro } from '@grafana/faro-react-native';
 * import { HttpInstrumentation } from '@grafana/faro-react-native';
 *
 * initializeFaro({
 *   // ...config
 *   instrumentations: [
 *     new HttpInstrumentation({
 *       ignoredUrls: [/localhost/, /127\.0\.0\.1/],
 *     }),
 *   ],
 * });
 * ```
 */
export declare class HttpInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native:instrumentation-http";
    readonly version = "2.3.1";
    private originalFetch?;
    private ignoredUrls;
    private requests;
    constructor(options?: {
        ignoredUrls?: RegExp[];
    });
    initialize(): void;
    unpatch(): void;
    private isUrlIgnored;
    private patchFetch;
}
