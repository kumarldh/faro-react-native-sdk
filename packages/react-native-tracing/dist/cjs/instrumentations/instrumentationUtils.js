"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSpanStatusOnFetchError = setSpanStatusOnFetchError;
exports.fetchCustomAttributeFunctionWithDefaults = fetchCustomAttributeFunctionWithDefaults;
exports.setSpanStatusOnXMLHttpRequestError = setSpanStatusOnXMLHttpRequestError;
exports.xhrCustomAttributeFunctionWithDefaults = xhrCustomAttributeFunctionWithDefaults;
var api_1 = require("@opentelemetry/api");
var faro_core_1 = require("@grafana/faro-core");
/**
 * Set span status to ERROR when fetch fails
 *
 * This ensures that failed HTTP requests are marked as errors in traces.
 */
function setSpanStatusOnFetchError(span, error) {
    var message = typeof error === 'string' ? error : error.message;
    span.setStatus({
        code: api_1.SpanStatusCode.ERROR,
        message: message,
    });
}
/**
 * Type guard to check if result is a FetchError
 */
function isFetchError(result) {
    return 'message' in result && typeof result.message === 'string';
}
/**
 * Custom attribute function for fetch instrumentation with defaults
 *
 * Combines user-provided custom attributes with default handling.
 *
 * @param userFunction - Optional user-provided custom attribute function
 * @returns Combined custom attribute function
 */
function fetchCustomAttributeFunctionWithDefaults(userFunction) {
    var fn = function (span, request, result) {
        // Call user function first if provided
        if (userFunction) {
            userFunction(span, request, result);
        }
        // Add default error handling
        if (isFetchError(result)) {
            setSpanStatusOnFetchError(span, result.message);
        }
        else if (result instanceof Response && result.status >= 400 && result.status < 600) {
            setSpanStatusOnFetchError(span, "HTTP ".concat(result.status, ": ").concat(result.statusText));
        }
    };
    return fn;
}
/**
 * Set span status to ERROR for XHR failures (status 0 or 4xx/5xx).
 */
function setSpanStatusOnXMLHttpRequestError(span, xhr) {
    var status = xhr.status;
    if (status == null)
        return;
    if (status === 0 || (status >= 400 && status < 600)) {
        span.setStatus({ code: api_1.SpanStatusCode.ERROR });
    }
}
/**
 * Add user action context to span when active (for HTTP Errors column in user action table).
 */
function addUserActionContextToSpan(span) {
    var _a, _b, _c;
    try {
        var currentAction = (_b = (_a = faro_core_1.faro.api) === null || _a === void 0 ? void 0 : _a.getActiveUserAction) === null || _b === void 0 ? void 0 : _b.call(_a);
        var state = (_c = currentAction === null || currentAction === void 0 ? void 0 : currentAction.getState) === null || _c === void 0 ? void 0 : _c.call(currentAction);
        if (currentAction && (state === faro_core_1.UserActionState.Started || state === faro_core_1.UserActionState.Halted)) {
            span.setAttribute('faro.action.user.name', currentAction.name);
            span.setAttribute('faro.action.user.parentId', currentAction.parentId);
        }
    }
    catch (_) {
        // Silently fail - don't log to avoid instrumentation loops
    }
}
/**
 * Custom attribute function for XHR instrumentation with defaults.
 */
function xhrCustomAttributeFunctionWithDefaults(userFunction) {
    return function (span, xhr) {
        setSpanStatusOnXMLHttpRequestError(span, xhr);
        addUserActionContextToSpan(span);
        userFunction === null || userFunction === void 0 ? void 0 : userFunction(span, xhr);
    };
}
//# sourceMappingURL=instrumentationUtils.js.map