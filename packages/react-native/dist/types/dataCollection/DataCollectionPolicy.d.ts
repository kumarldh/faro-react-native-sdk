import type { DataCollectionPolicy, DataCollectionPolicyOptions } from './types';
/**
 * DataCollectionPolicy implementation using AsyncStorage.
 *
 * Controls whether telemetry data is collected and sent.
 * The setting is persisted to AsyncStorage so it survives app restarts.
 *
 * Implementation follows Flutter SDK's DataCollectionPolicy pattern:
 * - Uses AsyncStorage for persistence (matching Flutter's SharedPreferences)
 * - Provides enable/disable methods
 * - Initializes from persisted value or default
 *
 * @example
 * ```typescript
 * import { createDataCollectionPolicy } from '@grafana/faro-react-native';
 *
 * // Create and initialize the policy
 * const policy = await createDataCollectionPolicy();
 *
 * // Check if enabled
 * if (policy.isEnabled) {
 *   // Data collection is allowed
 * }
 *
 * // User opts out
 * await policy.disable();
 *
 * // User opts back in
 * await policy.enable();
 * ```
 */
export declare class AsyncStorageDataCollectionPolicy implements DataCollectionPolicy {
    private _isEnabled;
    private readonly storageKey;
    private readonly subscribers;
    private constructor();
    /**
     * Create and initialize a DataCollectionPolicy.
     *
     * This async factory method loads the persisted value from AsyncStorage.
     */
    static create(options?: DataCollectionPolicyOptions): Promise<AsyncStorageDataCollectionPolicy>;
    get isEnabled(): boolean;
    enable(): Promise<void>;
    disable(): Promise<void>;
    subscribe(callback: (isEnabled: boolean) => void): () => void;
    private initialize;
    private persistSetting;
    private notifySubscribers;
}
/**
 * Factory function to create a DataCollectionPolicy.
 *
 * @example
 * ```typescript
 * const policy = await createDataCollectionPolicy();
 * ```
 */
export declare function createDataCollectionPolicy(options?: DataCollectionPolicyOptions): Promise<DataCollectionPolicy>;
/**
 * Initialize the global data collection policy.
 *
 * This should be called early in app initialization, before initializeFaro().
 *
 * @example
 * ```typescript
 * import { initializeDataCollectionPolicy, getDataCollectionPolicy } from '@grafana/faro-react-native';
 *
 * // Early in app startup
 * await initializeDataCollectionPolicy();
 *
 * // Later, check if collection is enabled
 * const policy = getDataCollectionPolicy();
 * if (policy?.isEnabled) {
 *   // Initialize Faro
 * }
 * ```
 */
export declare function initializeDataCollectionPolicy(options?: DataCollectionPolicyOptions): Promise<DataCollectionPolicy>;
/**
 * Get the global data collection policy.
 *
 * Returns null if not initialized.
 */
export declare function getDataCollectionPolicy(): DataCollectionPolicy | null;
/**
 * Set a custom data collection policy.
 *
 * Useful for testing or custom implementations.
 */
export declare function setDataCollectionPolicy(policy: DataCollectionPolicy | null): void;
