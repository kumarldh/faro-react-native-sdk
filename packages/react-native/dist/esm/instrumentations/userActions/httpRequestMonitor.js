import { Observable } from '@grafana/faro-core';
/**
 * Monitor for HTTP requests happening during user actions
 * Tracks fetch requests to correlate with user actions
 */
export function monitorHttpRequests() {
    const global = globalThis;
    if (!global.__FARO_HTTP_MONITOR__) {
        // Initialize the monitoring observable if it doesn't exist
        const observable = new Observable();
        global.__FARO_HTTP_MONITOR__ = {
            observable,
            notifyStart: (request) => {
                try {
                    observable.notify({ type: 'http_request_start', request });
                }
                catch (_err) {
                    // Ignore notification errors
                }
            },
            notifyEnd: (request) => {
                try {
                    observable.notify({ type: 'http_request_end', request });
                }
                catch (_err) {
                    // Ignore notification errors
                }
            },
        };
    }
    return global.__FARO_HTTP_MONITOR__.observable;
}
/**
 * Notify the HTTP monitor that a request has started
 * Should be called from HttpInstrumentation
 */
export function notifyHttpRequestStart(request) {
    var _a, _b;
    (_b = (_a = globalThis.__FARO_HTTP_MONITOR__) === null || _a === void 0 ? void 0 : _a.notifyStart) === null || _b === void 0 ? void 0 : _b.call(_a, request);
}
/**
 * Notify the HTTP monitor that a request has ended
 * Should be called from HttpInstrumentation
 */
export function notifyHttpRequestEnd(request) {
    var _a, _b;
    (_b = (_a = globalThis.__FARO_HTTP_MONITOR__) === null || _a === void 0 ? void 0 : _a.notifyEnd) === null || _b === void 0 ? void 0 : _b.call(_a, request);
}
//# sourceMappingURL=httpRequestMonitor.js.map