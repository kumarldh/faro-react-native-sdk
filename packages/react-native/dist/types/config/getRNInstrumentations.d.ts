import type { Instrumentation } from '@grafana/faro-core';
import type { ReactNativeConfig } from './types';
/**
 * Returns the default set of instrumentations for React Native.
 *
 * Reads all options from the Faro config (single source of truth).
 * Property names are aligned with Flutter SDK FaroConfig:
 * - cpuUsageVitals, memoryUsageVitals, anrTracking, refreshRateVitals
 * - enableCrashReporting, enableErrorReporting
 * - fetchVitalsInterval, ignoreUrls
 *
 * @example
 * ```ts
 * const config: ReactNativeConfig = {
 *   app: { name: 'my-app', version: '1.0.0' },
 *   cpuUsageVitals: true,
 *   memoryUsageVitals: true,
 *   anrTracking: true,
 *   refreshRateVitals: true,
 *   enableCrashReporting: true,
 *   fetchVitalsInterval: 30000,
 *   instrumentations: getRNInstrumentations(config),
 * };
 * ```
 */
export declare function getRNInstrumentations(config?: Partial<ReactNativeConfig>): Instrumentation[];
