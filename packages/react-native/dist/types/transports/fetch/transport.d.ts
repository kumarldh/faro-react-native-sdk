import { BaseTransport } from '@grafana/faro-core';
import type { Patterns, PromiseBuffer, TransportItem } from '@grafana/faro-core';
import type { FetchTransportOptions } from './types';
export declare class FetchTransport extends BaseTransport {
    private options;
    readonly name = "@grafana/faro-react-native:transport-fetch";
    readonly version = "2.3.1";
    promiseBuffer: PromiseBuffer<Response | void>;
    private readonly rateLimitBackoffMs;
    private readonly getNow;
    private disabledUntil;
    private consecutiveFailures;
    private sessionReadyPromise;
    private sessionReadyResolve;
    private sessionReady;
    private metasListenerRegistered;
    constructor(options: FetchTransportOptions);
    /**
     * Register a listener for metas changes to detect when session becomes available.
     * Uses faro-core's metas listener pattern instead of polling with setTimeout.
     */
    private registerSessionListener;
    /**
     * Wait for session to be available before sending.
     * This prevents 400 errors from the collector due to missing X-Faro-Session-Id header.
     *
     * Only waits if session tracking is enabled. If disabled, returns immediately.
     */
    private waitForSession;
    send(items: TransportItem[]): Promise<void>;
    getIgnoreUrls(): Patterns;
    isBatched(): boolean;
    private getRetryAfterDate;
}
