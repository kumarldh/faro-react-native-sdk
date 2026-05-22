"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultOTELInstrumentations = getDefaultOTELInstrumentations;
var instrumentation_fetch_1 = require("@opentelemetry/instrumentation-fetch");
var instrumentation_xml_http_request_1 = require("@opentelemetry/instrumentation-xml-http-request");
var faro_core_1 = require("@grafana/faro-core");
var instrumentationUtils_1 = require("./instrumentationUtils");
/**
 * Get default OTEL instrumentations for React Native
 *
 * This function creates the default OpenTelemetry instrumentations for React Native:
 * - FetchInstrumentation: Traces fetch() API calls
 * - XMLHttpRequestInstrumentation: Optional for apps that use XHR/axios directly
 *
 * IMPORTANT: Infinite loop prevention
 * - ignoreUrls is used to exclude Faro collector URLs
 * - ignoreNetworkEvents is true to avoid duplicate events
 * - No console logging during instrumentation
 *
 * @param options - Configuration options
 * @returns Array of OTEL instrumentations
 */
function getDefaultOTELInstrumentations(options) {
    if (options === void 0) { options = {}; }
    var _a = options.enableFetchInstrumentation, enableFetchInstrumentation = _a === void 0 ? true : _a, _b = options.enableXhrInstrumentation, enableXhrInstrumentation = _b === void 0 ? false : _b, fetchInstrumentationOptions = options.fetchInstrumentationOptions, xhrInstrumentationOptions = options.xhrInstrumentationOptions, sharedOptions = __rest(options, ["enableFetchInstrumentation", "enableXhrInstrumentation", "fetchInstrumentationOptions", "xhrInstrumentationOptions"]);
    var instrumentations = [];
    if (enableFetchInstrumentation) {
        instrumentations.push(new instrumentation_fetch_1.FetchInstrumentation(createFetchInstrumentationOptions(fetchInstrumentationOptions, sharedOptions)));
    }
    if (enableXhrInstrumentation) {
        instrumentations.push(new instrumentation_xml_http_request_1.XMLHttpRequestInstrumentation(createXhrInstrumentationOptions(xhrInstrumentationOptions, sharedOptions)));
    }
    return instrumentations;
}
function createFetchInstrumentationOptions(fetchInstrumentationOptions, sharedOptions) {
    return __assign(__assign(__assign(__assign({}, sharedOptions), { 
        // Ignore network performance events to avoid duplicates
        ignoreNetworkEvents: true }), fetchInstrumentationOptions), { 
        // Always keep this function
        applyCustomAttributesOnSpan: (0, instrumentationUtils_1.fetchCustomAttributeFunctionWithDefaults)(fetchInstrumentationOptions === null || fetchInstrumentationOptions === void 0 ? void 0 : fetchInstrumentationOptions.applyCustomAttributesOnSpan), 
        // Request hook to add user action context
        requestHook: function (span, _) {
            try {
                var currentAction = faro_core_1.faro.api.getActiveUserAction();
                if (currentAction &&
                    (currentAction === null || currentAction === void 0 ? void 0 : currentAction.getState()) === faro_core_1.UserActionState.Started) {
                    span.setAttribute('faro.action.user.name', currentAction.name);
                    span.setAttribute('faro.action.user.parentId', currentAction.parentId);
                }
            }
            catch (_error) {
                // Silently fail - don't log to avoid infinite loops
                // The span will just not have user action context
            }
        } });
}
function createXhrInstrumentationOptions(xhrInstrumentationOptions, sharedOptions) {
    return __assign(__assign(__assign(__assign({}, sharedOptions), { ignoreNetworkEvents: true }), xhrInstrumentationOptions), { applyCustomAttributesOnSpan: (0, instrumentationUtils_1.xhrCustomAttributeFunctionWithDefaults)(xhrInstrumentationOptions === null || xhrInstrumentationOptions === void 0 ? void 0 : xhrInstrumentationOptions.applyCustomAttributesOnSpan) });
}
//# sourceMappingURL=getDefaultOTELInstrumentations.js.map