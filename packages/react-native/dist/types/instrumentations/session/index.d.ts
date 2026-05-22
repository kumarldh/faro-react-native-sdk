import { BaseInstrumentation } from '@grafana/faro-core';
/**
 * Session instrumentation for React Native
 * Manages persistent or volatile sessions with expiration and inactivity tracking
 */
export declare class SessionInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native:instrumentation-session";
    readonly version = "2.3.1";
    private notifiedSession;
    private sessionManagerInstance;
    private getDefaultSessionDeviceAttributes;
    private sendSessionStartEvent;
    private createInitialSession;
    private registerBeforeSendHook;
    initialize(): void;
    /**
     * Clean up session manager listeners
     */
    unpatch(): void;
}
