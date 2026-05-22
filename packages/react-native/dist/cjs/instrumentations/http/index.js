"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpInstrumentation = void 0;
var faro_core_1 = require("@grafana/faro-core");
var httpRequestMonitor_1 = require("../userActions/httpRequestMonitor");
var actionContext_1 = require("../utils/actionContext");
var utils_1 = require("./utils");
var FARO_TRACING_FETCH_EVENT = 'faro.tracing.fetch';
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
var HttpInstrumentation = /** @class */ (function (_super) {
    __extends(HttpInstrumentation, _super);
    function HttpInstrumentation(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.name = '@grafana/faro-react-native:instrumentation-http';
        _this.version = faro_core_1.VERSION;
        _this.requests = new Map();
        _this.ignoredUrls = options.ignoredUrls || [];
        return _this;
    }
    HttpInstrumentation.prototype.initialize = function () {
        this.logInfo('HTTP instrumentation initialized');
        this.patchFetch();
    };
    HttpInstrumentation.prototype.unpatch = function () {
        if (this.originalFetch) {
            global.fetch = this.originalFetch;
            this.originalFetch = undefined;
        }
        this.requests.clear();
    };
    HttpInstrumentation.prototype.isUrlIgnored = function (url) {
        var _a;
        // Ignore the Faro collector URL to avoid tracking our own telemetry
        if (url.includes('grafana.net/collect')) {
            return true;
        }
        // Check user-provided ignored URLs
        if (this.ignoredUrls.some(function (pattern) { return pattern.test(url); })) {
            return true;
        }
        // Check config ignore URLs (includes transport URLs)
        var configIgnoreUrls = ((_a = this.config) === null || _a === void 0 ? void 0 : _a.ignoreUrls) || [];
        if (configIgnoreUrls.some(function (pattern) {
            if (typeof pattern === 'string') {
                return url.includes(pattern);
            }
            return pattern.test(url);
        })) {
            return true;
        }
        return false;
    };
    HttpInstrumentation.prototype.patchFetch = function () {
        if (this.originalFetch) {
            return; // Already patched
        }
        this.originalFetch = global.fetch;
        var self = this;
        global.fetch = function (input, init) {
            var url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url || '';
            // Extract method from Request object or init options
            var requestMethod = typeof input !== 'string' && !(input instanceof URL) ? input.method : undefined;
            var method = ((init === null || init === void 0 ? void 0 : init.method) || requestMethod || 'GET').toUpperCase();
            if (self.isUrlIgnored(url)) {
                return self.originalFetch.call(this, input, init);
            }
            var requestId = (0, faro_core_1.genShortID)();
            var startTime = Date.now();
            var body = init === null || init === void 0 ? void 0 : init.body;
            var requestSize = getRequestSize(body);
            var payload = {
                url: url,
                method: method,
                requestId: requestId,
                startTime: startTime,
                requestSize: requestSize,
            };
            self.requests.set(requestId, payload);
            // Notify user action monitor
            (0, httpRequestMonitor_1.notifyHttpRequestStart)(payload);
            return self
                .originalFetch.call(this, input, init)
                .then(function (response) {
                var _a;
                var endTime = Date.now();
                var duration = endTime - startTime;
                var contentLength = response.headers.get('content-length');
                var responseSize = contentLength ? parseInt(contentLength, 10) : undefined;
                payload.responseSize =
                    responseSize != null && !Number.isNaN(responseSize) && responseSize >= 0 ? responseSize : undefined;
                payload.endTime = endTime;
                payload.duration = duration;
                payload.status = response.status;
                // Notify user action monitor
                (0, httpRequestMonitor_1.notifyHttpRequestEnd)(payload);
                // Emit faro.tracing.fetch event (Web SDK format for Grafana HTTP insights)
                // Include action context when active so HTTP errors show in user action table
                var attributes = (0, utils_1.buildFetchEventAttributes)(payload);
                var pushOptions = (0, actionContext_1.getPushEventOptionsWithActionContext)();
                (_a = self.api) === null || _a === void 0 ? void 0 : _a.pushEvent(FARO_TRACING_FETCH_EVENT, attributes, undefined, pushOptions);
                self.logDebug("HTTP request \u2192 ".concat(method, " ").concat(url, " | status=").concat(response.status, " duration=").concat(duration, "ms") +
                    (requestSize != null ? " request_size=".concat(requestSize) : '') +
                    (payload.responseSize != null ? " response_size=".concat(payload.responseSize) : ''));
                self.requests.delete(requestId);
                return response;
            })
                .catch(function (error) {
                var _a;
                var endTime = Date.now();
                var duration = endTime - startTime;
                payload.endTime = endTime;
                payload.duration = duration;
                payload.error = (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error';
                // Notify user action monitor
                (0, httpRequestMonitor_1.notifyHttpRequestEnd)(payload);
                // Emit faro.tracing.fetch event for failed request (status 0 = network error)
                var attributes = (0, utils_1.buildFetchEventAttributes)(payload);
                var pushOptions = (0, actionContext_1.getPushEventOptionsWithActionContext)();
                (_a = self.api) === null || _a === void 0 ? void 0 : _a.pushEvent(FARO_TRACING_FETCH_EVENT, attributes, undefined, pushOptions);
                self.logDebug("HTTP request error \u2192 ".concat(method, " ").concat(url, " | error=").concat(payload.error, " duration=").concat(duration, "ms") +
                    (requestSize != null ? " request_size=".concat(requestSize) : ''));
                self.requests.delete(requestId);
                throw error;
            });
        };
    };
    return HttpInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.HttpInstrumentation = HttpInstrumentation;
//# sourceMappingURL=index.js.map