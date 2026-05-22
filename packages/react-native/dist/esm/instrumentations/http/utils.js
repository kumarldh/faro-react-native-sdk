/**
 * Parse URL for scheme and host. Returns empty strings if parsing fails.
 */
export function parseUrlParts(url) {
    try {
        const parsed = new URL(url);
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
export function buildFetchEventAttributes(payload) {
    const { scheme, host } = parseUrlParts(payload.url);
    const durationNs = payload.duration != null ? String(Math.round(payload.duration * 1000000)) : '';
    const statusCode = payload.status != null ? String(payload.status) : '0';
    const attrs = {
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