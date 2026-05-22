import { SpanStatusCode } from '@opentelemetry/api';
import { faro, UserActionState } from '@grafana/faro-core';
/**
 * Set span status to ERROR when fetch fails
 *
 * This ensures that failed HTTP requests are marked as errors in traces.
 */
export function setSpanStatusOnFetchError(span, error) {
    const message = typeof error === 'string' ? error : error.message;
    span.setStatus({
        code: SpanStatusCode.ERROR,
        message,
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
export function fetchCustomAttributeFunctionWithDefaults(userFunction) {
    const fn = (span, request, result) => {
        // Call user function first if provided
        if (userFunction) {
            userFunction(span, request, result);
        }
        // Add default error handling
        if (isFetchError(result)) {
            setSpanStatusOnFetchError(span, result.message);
        }
        else if (result instanceof Response && result.status >= 400 && result.status < 600) {
            setSpanStatusOnFetchError(span, `HTTP ${result.status}: ${result.statusText}`);
        }
    };
    return fn;
}
/**
 * Set span status to ERROR for XHR failures (status 0 or 4xx/5xx).
 */
export function setSpanStatusOnXMLHttpRequestError(span, xhr) {
    const status = xhr.status;
    if (status == null)
        return;
    if (status === 0 || (status >= 400 && status < 600)) {
        span.setStatus({ code: SpanStatusCode.ERROR });
    }
}
/**
 * Add user action context to span when active (for HTTP Errors column in user action table).
 */
function addUserActionContextToSpan(span) {
    var _a, _b, _c;
    try {
        const currentAction = (_b = (_a = faro.api) === null || _a === void 0 ? void 0 : _a.getActiveUserAction) === null || _b === void 0 ? void 0 : _b.call(_a);
        const state = (_c = currentAction === null || currentAction === void 0 ? void 0 : currentAction.getState) === null || _c === void 0 ? void 0 : _c.call(currentAction);
        if (currentAction && (state === UserActionState.Started || state === UserActionState.Halted)) {
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
export function xhrCustomAttributeFunctionWithDefaults(userFunction) {
    return (span, xhr) => {
        setSpanStatusOnXMLHttpRequestError(span, xhr);
        addUserActionContextToSpan(span);
        userFunction === null || userFunction === void 0 ? void 0 : userFunction(span, xhr);
    };
}
//# sourceMappingURL=instrumentationUtils.js.map