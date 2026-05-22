/**
 * PerformanceObserver polyfill for React Native iOS
 *
 * React Native 0.84's native PerformanceObserver has a bug on iOS that throws
 * `bad_variant_access` when the observer callback runs and calls getEntries().
 * This happens in NativePerformance.createObserver when the native bridge
 * returns data that causes a C++ variant access error.
 *
 * OpenTelemetry's FetchInstrumentation (and other libs) may use PerformanceObserver
 * for resource timing. We provide a no-op polyfill on React Native iOS to prevent
 * the crash while preserving refresh rate vitals and other functionality.
 *
 * @see https://github.com/facebook/react-native/issues (PerformanceObserver iOS)
 */
/**
 * Apply React Native performance API compatibility patches.
 *
 * Resource Timing lookup is patched on all platforms because OTel web
 * instrumentation can probe it. The PerformanceObserver replacement is
 * iOS-only to avoid the native bad_variant_access crash.
 */
export declare function applyPerformanceObserverPolyfill(): void;
