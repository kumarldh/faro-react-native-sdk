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
exports.XHRInstrumentation = void 0;
var faro_core_1 = require("@grafana/faro-core");
var utils_1 = require("../http/utils");
var httpRequestMonitor_1 = require("../userActions/httpRequestMonitor");
var actionContext_1 = require("../utils/actionContext");
var FARO_TRACING_FETCH_EVENT = 'faro.tracing.fetch';
/**
 * Get request body size from XHR send argument (best-effort).
 */
function getXhrRequestSize(body) {
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
    if (typeof FormData !== 'undefined' && body instanceof FormData)
        return undefined;
    return undefined;
}
/**
 * Resolve URL to string (handles relative URLs - best effort).
 */
function resolveUrl(url) {
    var _a;
    if (typeof url === 'string')
        return url;
    return (_a = url === null || url === void 0 ? void 0 : url.href) !== null && _a !== void 0 ? _a : '';
}
/**
 * XMLHttpRequest instrumentation for React Native
 *
 * Tracks XHR and axios (which uses XHR) calls and emits faro.tracing.fetch events.
 * Same format as HttpInstrumentation for Grafana HTTP insights compatibility.
 */
var XHRInstrumentation = /** @class */ (function (_super) {
    __extends(XHRInstrumentation, _super);
    function XHRInstrumentation(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.name = '@grafana/faro-react-native:instrumentation-xhr';
        _this.version = faro_core_1.VERSION;
        _this.requests = new Map();
        _this.ignoredUrls = options.ignoredUrls || [];
        return _this;
    }
    XHRInstrumentation.prototype.initialize = function () {
        this.logInfo('XHR instrumentation initialized');
        this.patchXHR();
    };
    XHRInstrumentation.prototype.unpatch = function () {
        var proto = XMLHttpRequest.prototype;
        if (this.originalOpen) {
            proto.open = this.originalOpen;
            this.originalOpen = undefined;
        }
        if (this.originalSend) {
            proto.send = this.originalSend;
            this.originalSend = undefined;
        }
        this.requests.clear();
    };
    XHRInstrumentation.prototype.isUrlIgnored = function (url) {
        var _a;
        if (url.includes('grafana.net/collect'))
            return true;
        if (this.ignoredUrls.some(function (p) { return p.test(url); }))
            return true;
        var configIgnoreUrls = ((_a = this.config) === null || _a === void 0 ? void 0 : _a.ignoreUrls) || [];
        if (configIgnoreUrls.some(function (pattern) {
            if (typeof pattern === 'string')
                return url.includes(pattern);
            return pattern.test(url);
        })) {
            return true;
        }
        return false;
    };
    XHRInstrumentation.prototype.patchXHR = function () {
        if (this.originalOpen)
            return;
        var proto = XMLHttpRequest.prototype;
        var self = this;
        this.originalOpen = proto.open;
        proto.open = function (method, url, _async, _user, _password) {
            if (_async === void 0) { _async = true; }
            this._faroMethod = (method || 'GET').toUpperCase();
            this._faroUrl = resolveUrl(url);
            return self.originalOpen.apply(this, [method, url, _async, _user, _password]);
        };
        this.originalSend = proto.send;
        proto.send = function (body) {
            var _this = this;
            var _a, _b;
            var url = (_a = this._faroUrl) !== null && _a !== void 0 ? _a : '';
            var method = (_b = this._faroMethod) !== null && _b !== void 0 ? _b : 'GET';
            if (self.isUrlIgnored(url)) {
                return self.originalSend.apply(this, [body]);
            }
            var requestId = (0, faro_core_1.genShortID)();
            var startTime = Date.now();
            var requestSize = getXhrRequestSize(body);
            var payload = {
                url: url,
                method: method,
                requestId: requestId,
                startTime: startTime,
                requestSize: requestSize,
            };
            self.requests.set(requestId, payload);
            this._faroRequestId = requestId;
            this._faroStartTime = startTime;
            this._faroHandled = false;
            (0, httpRequestMonitor_1.notifyHttpRequestStart)(payload);
            var handleComplete = function () {
                var _a, _b, _c;
                if (_this._faroHandled)
                    return;
                _this._faroHandled = true;
                var endTime = Date.now();
                var duration = endTime - ((_a = _this._faroStartTime) !== null && _a !== void 0 ? _a : startTime);
                var status = _this.status;
                var contentLength = (_b = _this.getResponseHeader) === null || _b === void 0 ? void 0 : _b.call(_this, 'content-length');
                var responseSize = contentLength != null
                    ? (function () {
                        var n = parseInt(contentLength, 10);
                        return !Number.isNaN(n) && n >= 0 ? n : undefined;
                    })()
                    : undefined;
                payload.endTime = endTime;
                payload.duration = duration;
                payload.status = status;
                payload.responseSize = responseSize;
                if (_this.status === 0) {
                    payload.error = _this.statusText || 'Network request failed';
                }
                (0, httpRequestMonitor_1.notifyHttpRequestEnd)(payload);
                var attributes = (0, utils_1.buildFetchEventAttributes)(payload);
                var pushOptions = (0, actionContext_1.getPushEventOptionsWithActionContext)();
                (_c = self.api) === null || _c === void 0 ? void 0 : _c.pushEvent(FARO_TRACING_FETCH_EVENT, attributes, undefined, pushOptions);
                self.logDebug("XHR request \u2192 ".concat(method, " ").concat(url, " | status=").concat(status, " duration=").concat(duration, "ms") +
                    (requestSize != null ? " request_size=".concat(requestSize) : '') +
                    (payload.responseSize != null ? " response_size=".concat(payload.responseSize) : ''));
                self.requests.delete(requestId);
            };
            var originalOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = function (ev) {
                if (this.readyState === 4) {
                    handleComplete.call(this);
                }
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.call(this, ev);
                }
            };
            this.addEventListener('load', handleComplete);
            this.addEventListener('error', function () {
                if (!this._faroHandled) {
                    payload.error = 'Network request failed';
                    handleComplete.call(this);
                }
            }.bind(this));
            this.addEventListener('abort', function () {
                if (!this._faroHandled) {
                    payload.error = 'Request aborted';
                    payload.status = 0;
                    handleComplete.call(this);
                }
            }.bind(this));
            return self.originalSend.apply(this, [body]);
        };
    };
    return XHRInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.XHRInstrumentation = XHRInstrumentation;
//# sourceMappingURL=index.js.map