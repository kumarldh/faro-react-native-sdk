export interface HttpRequestMessagePayload {
    requestId: string;
    url: string;
    method: string;
    startTime: number;
    endTime?: number;
    status?: number;
}
declare global {
    var __FARO_HTTP_MONITOR__: {
        notifyStart?: (request: HttpRequestMessagePayload) => void;
        notifyEnd?: (request: HttpRequestMessagePayload) => void;
    } | undefined;
}
import { Observable } from '@grafana/faro-core';
export type HttpRequestMessage = {
    type: 'http_request_start';
    request: HttpRequestMessagePayload;
} | {
    type: 'http_request_end';
    request: HttpRequestMessagePayload;
};
type HttpRequestObservable = Observable<HttpRequestMessage>;
/**
 * Monitor for HTTP requests happening during user actions
 * Tracks fetch requests to correlate with user actions
 */
export declare function monitorHttpRequests(): HttpRequestObservable;
/**
 * Notify the HTTP monitor that a request has started
 * Should be called from HttpInstrumentation
 */
export declare function notifyHttpRequestStart(request: HttpRequestMessagePayload): void;
/**
 * Notify the HTTP monitor that a request has ended
 * Should be called from HttpInstrumentation
 */
export declare function notifyHttpRequestEnd(request: HttpRequestMessagePayload): void;
export {};
