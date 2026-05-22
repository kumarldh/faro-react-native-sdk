"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitorHttpRequests = monitorHttpRequests;
exports.notifyHttpRequestStart = notifyHttpRequestStart;
exports.notifyHttpRequestEnd = notifyHttpRequestEnd;
var faro_core_1 = require("@grafana/faro-core");
/**
 * Monitor for HTTP requests happening during user actions
 * Tracks fetch requests to correlate with user actions
 */
function monitorHttpRequests() {
    var global = globalThis;
    if (!global.__FARO_HTTP_MONITOR__) {
        // Initialize the monitoring observable if it doesn't exist
        var observable_1 = new faro_core_1.Observable();
        global.__FARO_HTTP_MONITOR__ = {
            observable: observable_1,
            notifyStart: function (request) {
                try {
                    observable_1.notify({ type: 'http_request_start', request: request });
                }
                catch (_err) {
                    // Ignore notification errors
                }
            },
            notifyEnd: function (request) {
                try {
                    observable_1.notify({ type: 'http_request_end', request: request });
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
function notifyHttpRequestStart(request) {
    var _a, _b;
    (_b = (_a = globalThis.__FARO_HTTP_MONITOR__) === null || _a === void 0 ? void 0 : _a.notifyStart) === null || _b === void 0 ? void 0 : _b.call(_a, request);
}
/**
 * Notify the HTTP monitor that a request has ended
 * Should be called from HttpInstrumentation
 */
function notifyHttpRequestEnd(request) {
    var _a, _b;
    (_b = (_a = globalThis.__FARO_HTTP_MONITOR__) === null || _a === void 0 ? void 0 : _a.notifyEnd) === null || _b === void 0 ? void 0 : _b.call(_a, request);
}
//# sourceMappingURL=httpRequestMonitor.js.map