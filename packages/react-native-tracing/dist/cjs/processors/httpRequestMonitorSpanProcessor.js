"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequestMonitorSpanProcessor = void 0;
var faro_react_native_1 = require("@grafana/faro-react-native");
var ATTR_HTTP_METHOD = 'http.method';
var ATTR_HTTP_STATUS_CODE = 'http.status_code';
var ATTR_HTTP_URL = 'http.url';
/**
 * Get string attribute from span.
 * Handles both SDK attribute format and OTLP-style attribute values.
 */
function getAttr(span, key) {
    var _a;
    var attrs = span.attributes;
    if (attrs == null)
        return undefined;
    var raw = typeof attrs['get'] === 'function' ? attrs['get'](key) : attrs[key];
    if (raw == null)
        return undefined;
    if (typeof raw === 'string')
        return raw.length > 0 ? raw : undefined;
    if (typeof raw === 'object' && raw !== null && 'stringValue' in raw) {
        var s = String((_a = raw.stringValue) !== null && _a !== void 0 ? _a : '');
        return s.length > 0 ? s : undefined;
    }
    var str = String(raw);
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
var HttpRequestMonitorSpanProcessor = /** @class */ (function () {
    function HttpRequestMonitorSpanProcessor(processor) {
        this.processor = processor;
    }
    HttpRequestMonitorSpanProcessor.prototype.onStart = function (span, parentContext) {
        var _a, _b;
        if (isHttpSpan(span)) {
            var url = (_a = getAttr(span, ATTR_HTTP_URL)) !== null && _a !== void 0 ? _a : '';
            var method = (_b = getAttr(span, ATTR_HTTP_METHOD)) !== null && _b !== void 0 ? _b : 'GET';
            var requestId = span.spanContext().spanId;
            var startTimeMs = Date.now();
            var payload = {
                requestId: requestId,
                url: url,
                method: method,
                startTime: startTimeMs,
            };
            (0, faro_react_native_1.notifyHttpRequestStart)(payload);
        }
        this.processor.onStart(span, parentContext);
    };
    HttpRequestMonitorSpanProcessor.prototype.onEnd = function (span) {
        var _a, _b;
        if (isHttpSpan(span)) {
            var url = (_a = getAttr(span, ATTR_HTTP_URL)) !== null && _a !== void 0 ? _a : '';
            var method = (_b = getAttr(span, ATTR_HTTP_METHOD)) !== null && _b !== void 0 ? _b : 'GET';
            var requestId = span.spanContext().spanId;
            var statusAttr = getAttr(span, ATTR_HTTP_STATUS_CODE);
            var status_1 = statusAttr != null ? parseInt(statusAttr, 10) : undefined;
            var spanWithTime = span;
            var startNs = spanWithTime.startTimeUnixNano;
            var endNs = spanWithTime.endTimeUnixNano;
            var startTimeMs = startNs != null && !Number.isNaN(Number(startNs)) ? Number(startNs) / 1000000 : Date.now();
            var endTimeMs = endNs != null && !Number.isNaN(Number(endNs)) ? Number(endNs) / 1000000 : Date.now();
            var payload = {
                requestId: requestId,
                url: url,
                method: method,
                startTime: startTimeMs,
                endTime: endTimeMs,
                status: !Number.isNaN(status_1) ? status_1 : undefined,
            };
            (0, faro_react_native_1.notifyHttpRequestEnd)(payload);
        }
        this.processor.onEnd(span);
    };
    HttpRequestMonitorSpanProcessor.prototype.forceFlush = function () {
        return this.processor.forceFlush();
    };
    HttpRequestMonitorSpanProcessor.prototype.shutdown = function () {
        return this.processor.shutdown();
    };
    return HttpRequestMonitorSpanProcessor;
}());
exports.HttpRequestMonitorSpanProcessor = HttpRequestMonitorSpanProcessor;
//# sourceMappingURL=httpRequestMonitorSpanProcessor.js.map