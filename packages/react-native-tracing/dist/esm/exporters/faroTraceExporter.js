var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ExportResultCode } from '@opentelemetry/core';
import { createExportTraceServiceRequest } from '@opentelemetry/otlp-transformer/build/src/trace/internal';
import { createInternalLogger } from '@grafana/faro-core';
const internalLogger = createInternalLogger();
import { sendFaroEvents } from './faroTraceExporter.utils';
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
export class FaroTraceExporter {
    constructor(config) {
        this.config = config;
        this._isShutdown = false;
    }
    export(spans, resultCallback) {
        if (this._isShutdown) {
            internalLogger.error('FaroTraceExporter: Cannot export spans, exporter is shut down');
            resultCallback({ code: ExportResultCode.FAILED });
            return;
        }
        try {
            // Convert spans to OTLP format
            const traceEvent = createExportTraceServiceRequest(spans, { useHex: true, useLongBits: false });
            // Send traces to Faro
            this.config.api.pushTraces(traceEvent);
            // Send Faro events for CLIENT spans (HTTP requests, etc.)
            // This is done WITHOUT logging to avoid infinite loops
            sendFaroEvents(traceEvent.resourceSpans);
            resultCallback({ code: ExportResultCode.SUCCESS });
        }
        catch (error) {
            // Only log critical errors
            internalLogger.error('FaroTraceExporter: Failed to export spans', error);
            resultCallback({ code: ExportResultCode.FAILED });
        }
    }
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            this._isShutdown = true;
            return Promise.resolve(undefined);
        });
    }
    forceFlush() {
        return __awaiter(this, void 0, void 0, function* () {
            // No-op for now - spans are sent immediately via pushTraces
            return Promise.resolve(undefined);
        });
    }
}
//# sourceMappingURL=faroTraceExporter.js.map