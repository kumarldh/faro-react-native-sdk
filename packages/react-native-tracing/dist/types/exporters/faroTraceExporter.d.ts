import type { ExportResult } from '@opentelemetry/core';
import type { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import type { FaroTraceExporterConfig } from '../types';
/**
 * FaroTraceExporter for React Native
 *
 * Exports OpenTelemetry spans to Faro backend using pushTraces API.
 *
 * IMPORTANT: To avoid infinite loops:
 * - Uses internalLogger instead of console
 * - Does NOT log during export (except errors)
 * - Relies on Faro's internal deduplication
 */
export declare class FaroTraceExporter implements SpanExporter {
    private config;
    private _isShutdown;
    constructor(config: FaroTraceExporterConfig);
    export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
    shutdown(): Promise<void>;
    forceFlush(): Promise<void>;
}
