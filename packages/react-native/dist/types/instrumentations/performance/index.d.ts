import { BaseInstrumentation } from '@grafana/faro-core';
import type { PerformanceInstrumentationOptions } from './types';
/**
 * Measures React Native app performance metrics (CPU and Memory usage)
 *
 * Collects periodic performance metrics using native OS APIs:
 * - iOS: task_info() for memory, host_statistics() for CPU
 * - Android: /proc/[pid]/status for memory, /proc/[pid]/stat for CPU
 *
 * Implementation ported from Faro Flutter SDK with feature parity.
 *
 * **Key Features**:
 * - ✅ NO manual setup required - OS tracks metrics automatically!
 * - ✅ Periodic collection (default: every 30 seconds)
 * - ✅ Configurable per-metric enable/disable
 * - ✅ Differential CPU calculation (accurate usage percentages)
 * - ✅ Memory usage in KB (Resident Set Size)
 *
 * **Metrics Captured**:
 * - `mem_usage`: Current memory usage in KB (RSS - physical memory)
 * - `cpu_usage`: Current CPU usage percentage (0-100+)
 *
 * **Requirements**:
 * - iOS 13.4+ (any iOS that supports React Native)
 * - Android API 21+ for CPU (Android 5.0 Lollipop, ~99% of devices)
 * - Android any version for Memory
 *
 * @example
 * ```tsx
 * import { initializeFaro, getRNInstrumentations } from '@grafana/faro-react-native';
 *
 * initializeFaro({
 *   url: 'https://your-collector.com',
 *   instrumentations: [
 *     ...getRNInstrumentations({
 *       memoryUsageVitals: true,      // default: true
 *       cpuUsageVitals: true,          // default: true
 *       fetchVitalsInterval: 30000,    // default: 30s
 *     }),
 *   ],
 * });
 * ```
 */
export declare class PerformanceInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native:instrumentation-performance";
    readonly version = "2.3.1";
    private options;
    private intervalId;
    constructor(options?: PerformanceInstrumentationOptions);
    initialize(): void;
    private startPeriodicCollection;
    private collectMetrics;
    private collectMemoryUsage;
    private collectCpuUsage;
    unpatch(): void;
}
