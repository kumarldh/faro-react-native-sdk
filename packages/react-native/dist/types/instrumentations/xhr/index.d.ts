import { BaseInstrumentation } from '@grafana/faro-core';
/**
 * XMLHttpRequest instrumentation for React Native
 *
 * Tracks XHR and axios (which uses XHR) calls and emits faro.tracing.fetch events.
 * Same format as HttpInstrumentation for Grafana HTTP insights compatibility.
 */
export declare class XHRInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native:instrumentation-xhr";
    readonly version = "2.3.1";
    private originalOpen?;
    private originalSend?;
    private ignoredUrls;
    private requests;
    constructor(options?: {
        ignoredUrls?: RegExp[];
    });
    initialize(): void;
    unpatch(): void;
    private isUrlIgnored;
    private patchXHR;
}
