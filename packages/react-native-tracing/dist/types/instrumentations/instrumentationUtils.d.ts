import type { Span } from '@opentelemetry/api';
import type { FetchCustomAttributeFunction } from '@opentelemetry/instrumentation-fetch';
import type { XHRCustomAttributeFunction } from '@opentelemetry/instrumentation-xml-http-request';
/**
 * Set span status to ERROR when fetch fails
 *
 * This ensures that failed HTTP requests are marked as errors in traces.
 */
export declare function setSpanStatusOnFetchError(span: Span, error: Error | string): void;
/**
 * Custom attribute function for fetch instrumentation with defaults
 *
 * Combines user-provided custom attributes with default handling.
 *
 * @param userFunction - Optional user-provided custom attribute function
 * @returns Combined custom attribute function
 */
export declare function fetchCustomAttributeFunctionWithDefaults(userFunction?: FetchCustomAttributeFunction): FetchCustomAttributeFunction;
/**
 * Set span status to ERROR for XHR failures (status 0 or 4xx/5xx).
 */
export declare function setSpanStatusOnXMLHttpRequestError(span: Span, xhr: XMLHttpRequest): void;
/**
 * Custom attribute function for XHR instrumentation with defaults.
 */
export declare function xhrCustomAttributeFunctionWithDefaults(userFunction?: XHRCustomAttributeFunction): XHRCustomAttributeFunction;
