export interface HttpRequestPayload {
    url: string;
    method: string;
    requestId: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    status?: number;
    error?: string;
    requestSize?: number;
    responseSize?: number;
}
/**
 * Parse URL for scheme and host. Returns empty strings if parsing fails.
 */
export declare function parseUrlParts(url: string): {
    scheme: string;
    host: string;
};
/**
 * Build Web SDK-style event attributes for faro.tracing.fetch.
 * Aligns with Grafana HTTP insights and Frontend Observability plugin.
 */
export declare function buildFetchEventAttributes(payload: HttpRequestPayload): Record<string, string>;
