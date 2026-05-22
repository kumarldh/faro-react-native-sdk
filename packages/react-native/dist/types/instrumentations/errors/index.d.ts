import { BaseInstrumentation } from '@grafana/faro-core';
export { ErrorMechanism } from './const';
export type { ErrorMechanismType } from './const';
export interface ErrorsInstrumentationOptions {
    /**
     * Patterns to ignore errors by message
     * @example [/network timeout/i, /cancelled/i]
     */
    ignoreErrors?: RegExp[];
    /**
     * Enable error deduplication (default: true)
     * Prevents sending the same error multiple times within a time window
     */
    enableDeduplication?: boolean;
    /**
     * Deduplication time window in milliseconds (default: 5000)
     * Errors with same message/stack within this window are considered duplicates
     */
    deduplicationWindow?: number;
    /**
     * Maximum number of errors to track for deduplication (default: 50)
     * Older errors are removed when this limit is reached
     */
    maxDeduplicationEntries?: number;
    /**
     * Bundle filename for Hermes/minified release lines (`func@line:col`).
     * Must match the Metro plugin source map `file` field (default `bundle.js`).
     */
    releaseBundleFilename?: string;
}
/**
 * Errors instrumentation for React Native
 *
 * Features:
 * - Captures unhandled errors and promise rejections using ErrorUtils
 * - Parses React Native stack traces (dev, release, Metro bundler formats)
 * - Adds platform context (OS, version, Hermes engine)
 * - Error deduplication to prevent duplicate reports
 * - Configurable error filtering
 *
 * @example
 * ```tsx
 * import { ErrorsInstrumentation, initializeFaro } from '@grafana/faro-react-native';
 *
 * await initializeFaro({
 *   // ...config
 *   instrumentations: [
 *     new ErrorsInstrumentation({
 *       ignoreErrors: [/network timeout/i, /cancelled/i],
 *       enableDeduplication: true,
 *       deduplicationWindow: 5000,
 *     }),
 *   ],
 * });
 * ```
 */
export declare class ErrorsInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native-errors";
    readonly version = "1.0.0";
    private originalErrorHandler?;
    private unhandledRejectionListener?;
    private options;
    private errorFingerprints;
    constructor(options?: ErrorsInstrumentationOptions);
    initialize(): void;
    private setupGlobalErrorHandler;
    private setupUnhandledRejectionHandler;
    /**
     * Check if error should be ignored based on ignoreErrors patterns
     */
    private shouldIgnoreError;
    /**
     * Check if error is a duplicate based on message and stack
     */
    private isDuplicateError;
    /**
     * Add error fingerprint for deduplication tracking
     */
    private addErrorFingerprint;
    /**
     * Remove error fingerprints older than the deduplication window
     */
    private cleanupOldFingerprints;
    unpatch(): void;
}
