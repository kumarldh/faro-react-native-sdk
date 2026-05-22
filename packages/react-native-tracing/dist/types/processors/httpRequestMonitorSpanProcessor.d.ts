import type { Context } from '@opentelemetry/api';
import type { ReadableSpan, Span, SpanProcessor } from '@opentelemetry/sdk-trace-base';
/**
 * SpanProcessor that notifies httpRequestMonitor when HTTP spans start and end.
 *
 * This enables user action correlation (UserActionController halt logic) when
 * TracingInstrumentation is used instead of HttpInstrumentation.
 *
 * IMPORTANT: Must not use console or trigger any instrumentation to avoid loops.
 */
export declare class HttpRequestMonitorSpanProcessor implements SpanProcessor {
    private readonly processor;
    constructor(processor: SpanProcessor);
    onStart(span: Span, parentContext: Context): void;
    onEnd(span: ReadableSpan): void;
    forceFlush(): Promise<void>;
    shutdown(): Promise<void>;
}
