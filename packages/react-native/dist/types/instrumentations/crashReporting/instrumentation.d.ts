import { BaseInstrumentation } from '@grafana/faro-core';
import type { CrashReportingOptions } from './types';
/**
 * Crash Reporting Instrumentation (Experimental).
 *
 * Retrieves crash reports from previous app sessions and sends them via Faro API.
 *
 * **Platform Support**:
 * - **Android**: Uses ApplicationExitInfo API (Android 11+ / API 30+)
 *   Captures: CRASH, CRASH_NATIVE, ANR, LOW_MEMORY, EXCESSIVE_RESOURCE_USAGE
 * - **iOS**: Uses PLCrashReporter (requires adding dependency to podspec)
 *   Captures: Signal crashes (SIGSEGV, SIGABRT, etc.) and Mach exceptions
 *
 * **Note**: This instrumentation only retrieves crash data from previous sessions.
 * The crash itself terminates the app, so the report is sent on next app launch.
 *
 * @example
 * ```typescript
 * import { initializeFaro, CrashReportingInstrumentation } from '@grafana/faro-react-native';
 *
 * initializeFaro({
 *   url: 'https://collector.example.com',
 *   instrumentations: [
 *     new CrashReportingInstrumentation(),
 *   ],
 * });
 * ```
 */
export declare class CrashReportingInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native:instrumentation-crash";
    readonly version = "2.3.1";
    private readonly options;
    constructor(options?: CrashReportingOptions);
    initialize(): Promise<void>;
    /**
     * Wait for session attributes to be populated.
     *
     * Crash reports are sent in a new session, so we need to wait for
     * SessionInstrumentation to finish collecting device info, OS version, etc.
     * before sending the crash report. Otherwise, the crash report will be missing
     * session metadata.
     *
     * This checks for multiple device-specific attributes that are collected
     * asynchronously (device_id, device_os_detail, device_model_name) to ensure
     * the async getSessionAttributes() call has completed.
     *
     * @param maxWaitMs Maximum time to wait in milliseconds (default 10000ms)
     */
    private waitForSessionAttributes;
    private getNativeModule;
    private processCrashReports;
    private sendCrashReport;
    /**
     * Build error message matching Flutter SDK format:
     * "{reason}: {description}, status: {status}"
     */
    private getErrorMessage;
}
