import { notifyHttpRequestEnd, notifyHttpRequestStart, } from '@grafana/faro-react-native';
const ATTR_HTTP_METHOD = 'http.method';
const ATTR_HTTP_STATUS_CODE = 'http.status_code';
const ATTR_HTTP_URL = 'http.url';
/**
 * Get string attribute from span.
 * Handles both SDK attribute format and OTLP-style attribute values.
 */
function getAttr(span, key) {
    var _a;
    const attrs = span.attributes;
    if (attrs == null)
        return undefined;
    const raw = typeof attrs['get'] === 'function' ? attrs['get'](key) : attrs[key];
    if (raw == null)
        return undefined;
    if (typeof raw === 'string')
        return raw.length > 0 ? raw : undefined;
    if (typeof raw === 'object' && raw !== null && 'stringValue' in raw) {
        const s = String((_a = raw.stringValue) !== null && _a !== void 0 ? _a : '');
        return s.length > 0 ? s : undefined;
    }
    const str = String(raw);
    return str.length > 0 ? str : undefined;
}
/**
 * Check if a span is an HTTP span (from FetchInstrumentation).
 */
function isHttpSpan(span) {
    return getAttr(span, ATTR_HTTP_URL) != null || getAttr(span, ATTR_HTTP_METHOD) != null;
}
/**
 * SpanProcessor that notifies httpRequestMonitor when HTTP spans start and end.
 *
 * This enables user action correlation (UserActionController halt logic) when
 * TracingInstrumentation is used instead of HttpInstrumentation.
 *
 * IMPORTANT: Must not use console or trigger any instrumentation to avoid loops.
 */
export class HttpRequestMonitorSpanProcessor {
    constructor(processor) {
        this.processor = processor;
    }
    onStart(span, parentContext) {
        var _a, _b;
        if (isHttpSpan(span)) {
            const url = (_a = getAttr(span, ATTR_HTTP_URL)) !== null && _a !== void 0 ? _a : '';
            const method = (_b = getAttr(span, ATTR_HTTP_METHOD)) !== null && _b !== void 0 ? _b : 'GET';
            const requestId = span.spanContext().spanId;
            const startTimeMs = Date.now();
            const payload = {
                requestId,
                url,
                method,
                startTime: startTimeMs,
            };
            notifyHttpRequestStart(payload);
        }
        this.processor.onStart(span, parentContext);
    }
    onEnd(span) {
        var _a, _b;
        if (isHttpSpan(span)) {
            const url = (_a = getAttr(span, ATTR_HTTP_URL)) !== null && _a !== void 0 ? _a : '';
            const method = (_b = getAttr(span, ATTR_HTTP_METHOD)) !== null && _b !== void 0 ? _b : 'GET';
            const requestId = span.spanContext().spanId;
            const statusAttr = getAttr(span, ATTR_HTTP_STATUS_CODE);
            const status = statusAttr != null ? parseInt(statusAttr, 10) : undefined;
            const spanWithTime = span;
            const startNs = spanWithTime.startTimeUnixNano;
            const endNs = spanWithTime.endTimeUnixNano;
            const startTimeMs = startNs != null && !Number.isNaN(Number(startNs)) ? Number(startNs) / 1000000 : Date.now();
            const endTimeMs = endNs != null && !Number.isNaN(Number(endNs)) ? Number(endNs) / 1000000 : Date.now();
            const payload = {
                requestId,
                url,
                method,
                startTime: startTimeMs,
                endTime: endTimeMs,
                status: !Number.isNaN(status) ? status : undefined,
            };
            notifyHttpRequestEnd(payload);
        }
        this.processor.onEnd(span);
    }
    forceFlush() {
        return this.processor.forceFlush();
    }
    shutdown() {
        return this.processor.shutdown();
    }
}
//# sourceMappingURL=httpRequestMonitorSpanProcessor.js.map