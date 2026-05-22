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
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { faro, UserActionState } from '@grafana/faro-core';
import { fetchCustomAttributeFunctionWithDefaults, xhrCustomAttributeFunctionWithDefaults, } from './instrumentationUtils';
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
export function getDefaultOTELInstrumentations(options = {}) {
    const { enableFetchInstrumentation = true, enableXhrInstrumentation = false, fetchInstrumentationOptions, xhrInstrumentationOptions } = options, sharedOptions = __rest(options, ["enableFetchInstrumentation", "enableXhrInstrumentation", "fetchInstrumentationOptions", "xhrInstrumentationOptions"]);
    const instrumentations = [];
    if (enableFetchInstrumentation) {
        instrumentations.push(new FetchInstrumentation(createFetchInstrumentationOptions(fetchInstrumentationOptions, sharedOptions)));
    }
    if (enableXhrInstrumentation) {
        instrumentations.push(new XMLHttpRequestInstrumentation(createXhrInstrumentationOptions(xhrInstrumentationOptions, sharedOptions)));
    }
    return instrumentations;
}
function createFetchInstrumentationOptions(fetchInstrumentationOptions, sharedOptions) {
    return Object.assign(Object.assign(Object.assign(Object.assign({}, sharedOptions), { 
        // Ignore network performance events to avoid duplicates
        ignoreNetworkEvents: true }), fetchInstrumentationOptions), { 
        // Always keep this function
        applyCustomAttributesOnSpan: fetchCustomAttributeFunctionWithDefaults(fetchInstrumentationOptions === null || fetchInstrumentationOptions === void 0 ? void 0 : fetchInstrumentationOptions.applyCustomAttributesOnSpan), 
        // Request hook to add user action context
        requestHook: (span, _) => {
            try {
                const currentAction = faro.api.getActiveUserAction();
                if (currentAction &&
                    (currentAction === null || currentAction === void 0 ? void 0 : currentAction.getState()) === UserActionState.Started) {
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
    return Object.assign(Object.assign(Object.assign(Object.assign({}, sharedOptions), { ignoreNetworkEvents: true }), xhrInstrumentationOptions), { applyCustomAttributesOnSpan: xhrCustomAttributeFunctionWithDefaults(xhrInstrumentationOptions === null || xhrInstrumentationOptions === void 0 ? void 0 : xhrInstrumentationOptions.applyCustomAttributesOnSpan) });
}
//# sourceMappingURL=getDefaultOTELInstrumentations.js.map