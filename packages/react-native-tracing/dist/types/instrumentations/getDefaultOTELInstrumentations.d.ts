import type { DefaultInstrumentationsOptions, InstrumentationOption } from '../types';
/**
 * Get default OTEL instrumentations for React Native
 *
 * This function creates the default OpenTelemetry instrumentations for React Native:
 * - FetchInstrumentation: Traces fetch() API calls
 * - XMLHttpRequestInstrumentation: Optional for apps that use XHR/axios directly
 *
 * IMPORTANT: Infinite loop prevention
 * - ignoreUrls is used to exclude Faro collector URLs
 * - ignoreNetworkEvents is true to avoid duplicate events
 * - No console logging during instrumentation
 *
 * @param options - Configuration options
 * @returns Array of OTEL instrumentations
 */
export declare function getDefaultOTELInstrumentations(options?: DefaultInstrumentationsOptions): InstrumentationOption[];
