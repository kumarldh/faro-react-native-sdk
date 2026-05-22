import { BaseInstrumentation, genShortID, VERSION } from '@grafana/faro-core';
import { buildFetchEventAttributes } from '../http/utils';
import { notifyHttpRequestEnd, notifyHttpRequestStart } from '../userActions/httpRequestMonitor';
import { getPushEventOptionsWithActionContext } from '../utils/actionContext';
const FARO_TRACING_FETCH_EVENT = 'faro.tracing.fetch';
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
export class XHRInstrumentation extends BaseInstrumentation {
    constructor(options = {}) {
        super();
        this.name = '@grafana/faro-react-native:instrumentation-xhr';
        this.version = VERSION;
        this.requests = new Map();
        this.ignoredUrls = options.ignoredUrls || [];
    }
    initialize() {
        this.logInfo('XHR instrumentation initialized');
        this.patchXHR();
    }
    unpatch() {
        const proto = XMLHttpRequest.prototype;
        if (this.originalOpen) {
            proto.open = this.originalOpen;
            this.originalOpen = undefined;
        }
        if (this.originalSend) {
            proto.send = this.originalSend;
            this.originalSend = undefined;
        }
        this.requests.clear();
    }
    isUrlIgnored(url) {
        var _a;
        if (url.includes('grafana.net/collect'))
            return true;
        if (this.ignoredUrls.some((p) => p.test(url)))
            return true;
        const configIgnoreUrls = ((_a = this.config) === null || _a === void 0 ? void 0 : _a.ignoreUrls) || [];
        if (configIgnoreUrls.some((pattern) => {
            if (typeof pattern === 'string')
                return url.includes(pattern);
            return pattern.test(url);
        })) {
            return true;
        }
        return false;
    }
    patchXHR() {
        if (this.originalOpen)
            return;
        const proto = XMLHttpRequest.prototype;
        const self = this;
        this.originalOpen = proto.open;
        proto.open = function (method, url, _async = true, _user, _password) {
            this._faroMethod = (method || 'GET').toUpperCase();
            this._faroUrl = resolveUrl(url);
            return self.originalOpen.apply(this, [method, url, _async, _user, _password]);
        };
        this.originalSend = proto.send;
        proto.send = function (body) {
            var _a, _b;
            const url = (_a = this._faroUrl) !== null && _a !== void 0 ? _a : '';
            const method = (_b = this._faroMethod) !== null && _b !== void 0 ? _b : 'GET';
            if (self.isUrlIgnored(url)) {
                return self.originalSend.apply(this, [body]);
            }
            const requestId = genShortID();
            const startTime = Date.now();
            const requestSize = getXhrRequestSize(body);
            const payload = {
                url,
                method,
                requestId,
                startTime,
                requestSize,
            };
            self.requests.set(requestId, payload);
            this._faroRequestId = requestId;
            this._faroStartTime = startTime;
            this._faroHandled = false;
            notifyHttpRequestStart(payload);
            const handleComplete = () => {
                var _a, _b, _c;
                if (this._faroHandled)
                    return;
                this._faroHandled = true;
                const endTime = Date.now();
                const duration = endTime - ((_a = this._faroStartTime) !== null && _a !== void 0 ? _a : startTime);
                const status = this.status;
                const contentLength = (_b = this.getResponseHeader) === null || _b === void 0 ? void 0 : _b.call(this, 'content-length');
                const responseSize = contentLength != null
                    ? (() => {
                        const n = parseInt(contentLength, 10);
                        return !Number.isNaN(n) && n >= 0 ? n : undefined;
                    })()
                    : undefined;
                payload.endTime = endTime;
                payload.duration = duration;
                payload.status = status;
                payload.responseSize = responseSize;
                if (this.status === 0) {
                    payload.error = this.statusText || 'Network request failed';
                }
                notifyHttpRequestEnd(payload);
                const attributes = buildFetchEventAttributes(payload);
                const pushOptions = getPushEventOptionsWithActionContext();
                (_c = self.api) === null || _c === void 0 ? void 0 : _c.pushEvent(FARO_TRACING_FETCH_EVENT, attributes, undefined, pushOptions);
                self.logDebug(`XHR request → ${method} ${url} | status=${status} duration=${duration}ms` +
                    (requestSize != null ? ` request_size=${requestSize}` : '') +
                    (payload.responseSize != null ? ` response_size=${payload.responseSize}` : ''));
                self.requests.delete(requestId);
            };
            const originalOnReadyStateChange = this.onreadystatechange;
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
    }
}
//# sourceMappingURL=index.js.map