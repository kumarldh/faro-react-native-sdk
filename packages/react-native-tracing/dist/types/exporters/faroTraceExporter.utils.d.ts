import { type IResourceSpans } from '@opentelemetry/otlp-transformer/build/src/trace/internal-types';
/**
 * Send Faro events for CLIENT spans (HTTP requests, navigation, etc.)
 *
 * IMPORTANT: This function is called during trace export and must be careful to avoid infinite loops.
 *
 * Infinite loop prevention strategy:
 * 1. Only process SPAN_KIND_CLIENT spans (HTTP requests, etc.)
 * 2. Use faro.api.pushEvent which:
 *    - Does NOT trigger console logs if ConsoleInstrumentation is configured properly
 *    - Does NOT trigger HTTP instrumentation for collector URLs (they're ignored)
 * 3. Use internalLogger for debugging instead of console
 * 4. Never call console.log/warn/error in this function
 *
 * @param resourceSpans - OTLP resource spans from trace exporter
 */
export declare function sendFaroEvents(resourceSpans?: IResourceSpans[]): void;
