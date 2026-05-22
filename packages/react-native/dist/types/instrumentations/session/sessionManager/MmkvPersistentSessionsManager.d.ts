import type { FaroUserSession } from './types';
/** @internal */
export declare function resetMmkvSingletonForTests(): void;
/**
 * Persistent session storage backed by MMKV (synchronous reads/writes).
 * Used when `sessionTracking.persistent` is true.
 */
export declare class MmkvPersistentSessionsManager {
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
    unpatch(): void;
}
