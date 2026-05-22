import type { MetaUser } from '@grafana/faro-core';
import type { UserPersistence, UserPersistenceOptions } from './types';
/**
 * UserPersistence implementation using AsyncStorage.
 *
 * Stores user information persistently so it can be restored on app restart.
 * This ensures early telemetry events include user identification.
 *
 * Implementation follows Flutter SDK's UserPersistence pattern:
 * - Uses AsyncStorage for persistence (matching Flutter's SharedPreferences)
 * - Stores user as JSON
 * - Handles null/cleared users
 *
 * @example
 * ```typescript
 * import { createUserPersistence } from '@grafana/faro-react-native';
 *
 * // Load user on app start
 * const persistence = createUserPersistence();
 * const user = await persistence.loadUser();
 *
 * if (user) {
 *   faro.api.setUser(user);
 * }
 *
 * // Save user when logged in
 * const loggedInUser = { id: '123', email: 'user@example.com' };
 * await persistence.saveUser(loggedInUser);
 *
 * // Clear on logout
 * await persistence.clearUser();
 * ```
 */
export declare class AsyncStorageUserPersistence implements UserPersistence {
    private readonly storageKey;
    constructor(options?: UserPersistenceOptions);
    loadUser(): Promise<MetaUser | null>;
    saveUser(user: MetaUser | null): Promise<void>;
    clearUser(): Promise<void>;
    hasPersistedUser(): Promise<boolean>;
    /**
     * Check if user is cleared (all fields empty/undefined).
     */
    private isCleared;
    /**
     * Validate that the parsed object is a valid MetaUser.
     */
    private isValidMetaUser;
}
/**
 * Factory function to create a UserPersistence instance.
 */
export declare function createUserPersistence(options?: UserPersistenceOptions): UserPersistence;
/**
 * Initialize the global user persistence.
 */
export declare function initializeUserPersistence(options?: UserPersistenceOptions): UserPersistence;
/**
 * Get the global user persistence instance.
 */
export declare function getUserPersistence(): UserPersistence | null;
/**
 * Set a custom user persistence instance.
 */
export declare function setUserPersistence(persistence: UserPersistence | null): void;
