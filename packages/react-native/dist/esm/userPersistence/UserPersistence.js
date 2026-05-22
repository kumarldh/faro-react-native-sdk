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
 * Default storage key for user data.
 */
const DEFAULT_STORAGE_KEY = 'faro_persisted_user';
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
export class AsyncStorageUserPersistence {
    constructor(options = {}) {
        var _a;
        this.storageKey = (_a = options.storageKey) !== null && _a !== void 0 ? _a : DEFAULT_STORAGE_KEY;
    }
    loadUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userJson = yield AsyncStorage.getItem(this.storageKey);
                if (userJson === null) {
                    return null;
                }
                const userData = JSON.parse(userJson);
                if (!this.isValidMetaUser(userData)) {
                    return null;
                }
                return userData;
            }
            catch (_a) {
                return null;
            }
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (user === null || this.isCleared(user)) {
                    yield this.clearUser();
                    return;
                }
                const userJson = JSON.stringify(user);
                yield AsyncStorage.setItem(this.storageKey, userJson);
            }
            catch (_a) {
                // Log failure but don't throw
            }
        });
    }
    clearUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield AsyncStorage.removeItem(this.storageKey);
            }
            catch (_a) {
                // Log failure but don't throw
            }
        });
    }
    hasPersistedUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userJson = yield AsyncStorage.getItem(this.storageKey);
                return userJson !== null;
            }
            catch (_a) {
                return false;
            }
        });
    }
    /**
     * Check if user is cleared (all fields empty/undefined).
     */
    isCleared(user) {
        return !user.id && !user.email && !user.username && !user.fullName && !user.roles;
    }
    /**
     * Validate that the parsed object is a valid MetaUser.
     */
    isValidMetaUser(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }
        // MetaUser has optional string fields, so any object is technically valid
        // We just need to make sure it's an object
        return true;
    }
}
/**
 * Factory function to create a UserPersistence instance.
 */
export function createUserPersistence(options = {}) {
    return new AsyncStorageUserPersistence(options);
}
/**
 * Global user persistence instance.
 */
let globalUserPersistence = null;
/**
 * Initialize the global user persistence.
 */
export function initializeUserPersistence(options = {}) {
    globalUserPersistence = createUserPersistence(options);
    return globalUserPersistence;
}
/**
 * Get the global user persistence instance.
 */
export function getUserPersistence() {
    return globalUserPersistence;
}
/**
 * Set a custom user persistence instance.
 */
export function setUserPersistence(persistence) {
    globalUserPersistence = persistence;
}
//# sourceMappingURL=UserPersistence.js.map