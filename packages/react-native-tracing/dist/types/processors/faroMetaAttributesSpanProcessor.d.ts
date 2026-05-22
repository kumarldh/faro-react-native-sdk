import type { Context } from '@opentelemetry/api';
import type { ReadableSpan, Span, SpanProcessor } from '@opentelemetry/sdk-trace-base';
import type { Metas } from '@grafana/faro-core';
/**
 * Span processor that adds Faro meta attributes to spans
 *
 * This processor enriches spans with:
 * - Session ID
 * - User information (email, id, username, etc.)
 *
 * IMPORTANT: This processor delegates to a wrapped processor and does NOT log
 * to avoid infinite loops.
 */
export declare class FaroMetaAttributesSpanProcessor implements SpanProcessor {
    private processor;
    private metas;
    constructor(processor: SpanProcessor, metas: Metas);
    forceFlush(): Promise<void>;
    onStart(span: Span, parentContext: Context): void;
    onEnd(span: ReadableSpan): void;
    shutdown(): Promise<void>;
}
