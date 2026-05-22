"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrlParts = parseUrlParts;
exports.buildFetchEventAttributes = buildFetchEventAttributes;
/**
 * Parse URL for scheme and host. Returns empty strings if parsing fails.
 */
function parseUrlParts(url) {
    try {
        var parsed = new URL(url);
        return {
            scheme: parsed.protocol.replace(':', '') || 'http',
            host: parsed.host || '',
        };
    }
    catch (_a) {
        return { scheme: 'http', host: '' };
    }
}
/**
 * Build Web SDK-style event attributes for faro.tracing.fetch.
 * Aligns with Grafana HTTP insights and Frontend Observability plugin.
 */
function buildFetchEventAttributes(payload) {
    var _a = parseUrlParts(payload.url), scheme = _a.scheme, host = _a.host;
    var durationNs = payload.duration != null ? String(Math.round(payload.duration * 1000000)) : '';
    var statusCode = payload.status != null ? String(payload.status) : '0';
    var attrs = {
        'http.url': payload.url,
        'http.method': payload.method,
        'http.scheme': scheme,
        'http.host': host,
        'http.status_code': statusCode,
        duration_ns: durationNs,
    };
    if (payload.requestSize != null) {
        attrs['http.request_size'] = String(payload.requestSize);
    }
    if (payload.responseSize != null) {
        attrs['http.response_size'] = String(payload.responseSize);
    }
    if (payload.error) {
        attrs['http.error'] = payload.error;
    }
    return attrs;
}
//# sourceMappingURL=utils.js.map