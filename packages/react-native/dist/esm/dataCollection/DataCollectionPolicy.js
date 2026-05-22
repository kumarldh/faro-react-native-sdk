var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * Default storage key for the data collection policy.
 */
const DEFAULT_STORAGE_KEY = 'faro_enable_data_collection';
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
export class AsyncStorageDataCollectionPolicy {
    constructor(options = {}) {
        var _a, _b;
        this.subscribers = new Set();
        this.storageKey = (_a = options.storageKey) !== null && _a !== void 0 ? _a : DEFAULT_STORAGE_KEY;
        this._isEnabled = (_b = options.defaultEnabled) !== null && _b !== void 0 ? _b : true;
    }
    /**
     * Create and initialize a DataCollectionPolicy.
     *
     * This async factory method loads the persisted value from AsyncStorage.
     */
    static create() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const policy = new AsyncStorageDataCollectionPolicy(options);
            yield policy.initialize();
            return policy;
        });
    }
    get isEnabled() {
        return this._isEnabled;
    }
    enable() {
        return __awaiter(this, void 0, void 0, function* () {
            this._isEnabled = true;
            yield this.persistSetting();
            this.notifySubscribers();
        });
    }
    disable() {
        return __awaiter(this, void 0, void 0, function* () {
            this._isEnabled = false;
            yield this.persistSetting();
            this.notifySubscribers();
        });
    }
    subscribe(callback) {
        this.subscribers.add(callback);
        // Immediately notify subscriber of current state
        callback(this._isEnabled);
        return () => {
            this.subscribers.delete(callback);
        };
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storedValue = yield AsyncStorage.getItem(this.storageKey);
                if (storedValue !== null) {
                    this._isEnabled = storedValue === 'true';
                }
            }
            catch (_a) {
                // If loading fails, use default value
            }
        });
    }
    persistSetting() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield AsyncStorage.setItem(this.storageKey, String(this._isEnabled));
            }
            catch (_a) {
                // If persisting fails, log but don't throw
            }
        });
    }
    notifySubscribers() {
        this.subscribers.forEach((subscriber) => {
            try {
                subscriber(this._isEnabled);
            }
            catch (_a) {
                // Ignore subscriber errors
            }
        });
    }
}
/**
 * Factory function to create a DataCollectionPolicy.
 *
 * @example
 * ```typescript
 * const policy = await createDataCollectionPolicy();
 * ```
 */
export function createDataCollectionPolicy() {
    return __awaiter(this, arguments, void 0, function* (options = {}) {
        return AsyncStorageDataCollectionPolicy.create(options);
    });
}
/**
 * Global data collection policy instance.
 * Must be initialized before use.
 */
let globalPolicy = null;
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
export function initializeDataCollectionPolicy() {
    return __awaiter(this, arguments, void 0, function* (options = {}) {
        globalPolicy = yield createDataCollectionPolicy(options);
        return globalPolicy;
    });
}
/**
 * Get the global data collection policy.
 *
 * Returns null if not initialized.
 */
export function getDataCollectionPolicy() {
    return globalPolicy;
}
/**
 * Set a custom data collection policy.
 *
 * Useful for testing or custom implementations.
 */
export function setDataCollectionPolicy(policy) {
    globalPolicy = policy;
}
//# sourceMappingURL=DataCollectionPolicy.js.map