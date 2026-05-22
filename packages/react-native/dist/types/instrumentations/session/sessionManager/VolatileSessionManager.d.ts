import type { FaroUserSession } from './types';
export declare class VolatileSessionsManager {
    private static volatileStorage;
    private updateUserSession;
    private appStateSubscription;
    private metaUnsubscribe;
    constructor();
    static removeUserSession(): void;
    static storeUserSession(session: FaroUserSession): void;
    static fetchUserSession(): FaroUserSession | null;
    updateSession: () => Promise<void>;
    private handleAppStateChange;
    private init;
    /**
     * Clean up listeners when the instrumentation is unpatched
     */
    unpatch(): void;
}
