import { BaseInstrumentation, genShortID, VERSION } from '@grafana/faro-core';
import { notifyHttpRequestEnd, notifyHttpRequestStart } from '../userActions/httpRequestMonitor';
import { getPushEventOptionsWithActionContext } from '../utils/actionContext';
import { buildFetchEventAttributes } from './utils';
const FARO_TRACING_FETCH_EVENT = 'faro.tracing.fetch';
/**
 * Compute request body size in bytes (best-effort).
 * FormData and ReadableStream do not expose length without consuming.
 */
function getRequestSize(body) {
    if (body == null)
        return undefined;
    if (typeof body === 'string')
        return new Blob([body]).size;
    if (body instanceof ArrayBuffer)
        return body.byteLength;
    if (ArrayBuffer.isView(body))
        return body.byteLength;
    if (typeof Blob !== 'undefined' && body instanceof Blob)
        return body.size;
    if (body instanceof URLSearchParams)
        return new Blob([body.toString()]).size;
    return undefined;
}
/**
 * HTTP instrumentation for React Native
 *
 * Tracks fetch API calls and emits faro.tracing.fetch events (Web SDK format).
 * Compatible with Grafana Frontend Observability HTTP insights.
 * Automatically captures:
 * - Request URL, method, and timing
 * - Response status codes (0 for network errors)
 * - Request duration
 * - Request/response size (bytes; best-effort)
 * - Network errors
 *
 * @example
 * ```tsx
 * import { initializeFaro } from '@grafana/faro-react-native';
 * import { HttpInstrumentation } from '@grafana/faro-react-native';
 *
 * initializeFaro({
 *   // ...config
 *   instrumentations: [
 *     new HttpInstrumentation({
 *       ignoredUrls: [/localhost/, /127\.0\.0\.1/],
 *     }),
 *   ],
 * });
 * ```
 */
export class HttpInstrumentation extends BaseInstrumentation {
    constructor(options = {}) {
        super();
        this.name = '@grafana/faro-react-native:instrumentation-http';
        this.version = VERSION;
        this.requests = new Map();
        this.ignoredUrls = options.ignoredUrls || [];
    }
    initialize() {
        this.logInfo('HTTP instrumentation initialized');
        this.patchFetch();
    }
    unpatch() {
        if (this.originalFetch) {
            global.fetch = this.originalFetch;
            this.originalFetch = undefined;
        }
        this.requests.clear();
    }
    isUrlIgnored(url) {
        var _a;
        // Ignore the Faro collector URL to avoid tracking our own telemetry
        if (url.includes('grafana.net/collect')) {
            return true;
        }
        // Check user-provided ignored URLs
        if (this.ignoredUrls.some((pattern) => pattern.test(url))) {
            return true;
        }
        // Check config ignore URLs (includes transport URLs)
        const configIgnoreUrls = ((_a = this.config) === null || _a === void 0 ? void 0 : _a.ignoreUrls) || [];
        if (configIgnoreUrls.some((pattern) => {
            if (typeof pattern === 'string') {
                return url.includes(pattern);
            }
            return pattern.test(url);
        })) {
            return true;
        }
        return false;
    }
    patchFetch() {
        if (this.originalFetch) {
            return; // Already patched
        }
        this.originalFetch = global.fetch;
        const self = this;
        global.fetch = function (input, init) {
            const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url || '';
            // Extract method from Request object or init options
            const requestMethod = typeof input !== 'string' && !(input instanceof URL) ? input.method : undefined;
            const method = ((init === null || init === void 0 ? void 0 : init.method) || requestMethod || 'GET').toUpperCase();
            if (self.isUrlIgnored(url)) {
                return self.originalFetch.call(this, input, init);
            }
            const requestId = genShortID();
            const startTime = Date.now();
            const body = init === null || init === void 0 ? void 0 : init.body;
            const requestSize = getRequestSize(body);
            const payload = {
                url,
                method,
                requestId,
                startTime,
                requestSize,
            };
            self.requests.set(requestId, payload);
            // Notify user action monitor
            notifyHttpRequestStart(payload);
            return self
                .originalFetch.call(this, input, init)
                .then((response) => {
                var _a;
                const endTime = Date.now();
                const duration = endTime - startTime;
                const contentLength = response.headers.get('content-length');
                const responseSize = contentLength ? parseInt(contentLength, 10) : undefined;
                payload.responseSize =
                    responseSize != null && !Number.isNaN(responseSize) && responseSize >= 0 ? responseSize : undefined;
                payload.endTime = endTime;
                payload.duration = duration;
                payload.status = response.status;
                // Notify user action monitor
                notifyHttpRequestEnd(payload);
                // Emit faro.tracing.fetch event (Web SDK format for Grafana HTTP insights)
                // Include action context when active so HTTP errors show in user action table
                const attributes = buildFetchEventAttributes(payload);
                const pushOptions = getPushEventOptionsWithActionContext();
                (_a = self.api) === null || _a === void 0 ? void 0 : _a.pushEvent(FARO_TRACING_FETCH_EVENT, attributes, undefined, pushOptions);
                self.logDebug(`HTTP request → ${method} ${url} | status=${response.status} duration=${duration}ms` +
                    (requestSize != null ? ` request_size=${requestSize}` : '') +
                    (payload.responseSize != null ? ` response_size=${payload.responseSize}` : ''));
                self.requests.delete(requestId);
                return response;
            })
                .catch((error) => {
                var _a;
                const endTime = Date.now();
                const duration = endTime - startTime;
                payload.endTime = endTime;
                payload.duration = duration;
                payload.error = (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error';
                // Notify user action monitor
                notifyHttpRequestEnd(payload);
                // Emit faro.tracing.fetch event for failed request (status 0 = network error)
                const attributes = buildFetchEventAttributes(payload);
                const pushOptions = getPushEventOptionsWithActionContext();
                (_a = self.api) === null || _a === void 0 ? void 0 : _a.pushEvent(FARO_TRACING_FETCH_EVENT, attributes, undefined, pushOptions);
                self.logDebug(`HTTP request error → ${method} ${url} | error=${payload.error} duration=${duration}ms` +
                    (requestSize != null ? ` request_size=${requestSize}` : ''));
                self.requests.delete(requestId);
                throw error;
            });
        };
    }
}
//# sourceMappingURL=index.js.map