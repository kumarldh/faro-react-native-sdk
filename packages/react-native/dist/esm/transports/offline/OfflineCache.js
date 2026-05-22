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
 * Default storage key prefix for the offline cache.
 */
const DEFAULT_STORAGE_KEY_PREFIX = 'faro_offline_cache';
/**
 * Default maximum number of cached payloads.
 */
const DEFAULT_MAX_CACHE_SIZE = 1000;
/**
 * File-based offline cache implementation using AsyncStorage.
 *
 * Stores cached telemetry payloads as JSONL (one JSON object per line)
 * following the Flutter SDK's offline transport pattern.
 *
 * Uses a mutex pattern for thread-safe file access.
 */
export class AsyncStorageOfflineCache {
    constructor(options = {}) {
        var _a, _b;
        this.lockPromise = Promise.resolve();
        this.storageKey = `${(_a = options.storageKeyPrefix) !== null && _a !== void 0 ? _a : DEFAULT_STORAGE_KEY_PREFIX}_data`;
        this.maxCacheSize = (_b = options.maxCacheSize) !== null && _b !== void 0 ? _b : DEFAULT_MAX_CACHE_SIZE;
    }
    write(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.withLock(() => __awaiter(this, void 0, void 0, function* () {
                const payloads = yield this.readAllInternal();
                // Add new payload
                payloads.push(payload);
                // Trim to max size (remove oldest entries)
                while (payloads.length > this.maxCacheSize) {
                    payloads.shift();
                }
                yield this.writeAll(payloads);
            }));
        });
    }
    readAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.withLock(() => __awaiter(this, void 0, void 0, function* () {
                return this.readAllInternal();
            }));
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.withLock(() => __awaiter(this, void 0, void 0, function* () {
                yield AsyncStorage.removeItem(this.storageKey);
            }));
        });
    }
    removeByTimestamps(timestamps) {
        return __awaiter(this, void 0, void 0, function* () {
            if (timestamps.length === 0)
                return;
            const timestampSet = new Set(timestamps);
            yield this.withLock(() => __awaiter(this, void 0, void 0, function* () {
                const payloads = yield this.readAllInternal();
                const remaining = payloads.filter((p) => !timestampSet.has(p.timestamp));
                yield this.writeAll(remaining);
            }));
        });
    }
    getCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const payloads = yield this.readAllInternal();
            return payloads.length;
        });
    }
    /**
     * Execute an operation with a mutex lock to ensure thread-safe access.
     * Follows Flutter SDK's Completer-based lock pattern.
     */
    withLock(operation) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentLock = this.lockPromise;
            let resolveLock;
            this.lockPromise = new Promise((resolve) => {
                resolveLock = resolve;
            });
            try {
                yield currentLock;
                return yield operation();
            }
            finally {
                resolveLock();
            }
        });
    }
    readAllInternal() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield AsyncStorage.getItem(this.storageKey);
                if (!data) {
                    return [];
                }
                const parsed = JSON.parse(data);
                if (!Array.isArray(parsed)) {
                    return [];
                }
                return parsed.filter(this.isValidCachedPayload);
            }
            catch (_a) {
                // If parsing fails, return empty array
                return [];
            }
        });
    }
    writeAll(payloads) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payloads.length === 0) {
                yield AsyncStorage.removeItem(this.storageKey);
            }
            else {
                yield AsyncStorage.setItem(this.storageKey, JSON.stringify(payloads));
            }
        });
    }
    isValidCachedPayload(payload) {
        if (typeof payload !== 'object' || payload === null) {
            return false;
        }
        const p = payload;
        return typeof p['timestamp'] === 'number' && Array.isArray(p['items']);
    }
}
//# sourceMappingURL=OfflineCache.js.map