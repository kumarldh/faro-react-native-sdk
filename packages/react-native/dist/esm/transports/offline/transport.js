var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseTransport, VERSION } from '@grafana/faro-core';
import { DefaultConnectivityService } from './ConnectivityService';
import { AsyncStorageOfflineCache } from './OfflineCache';
/**
 * Default maximum cache duration: 3 days in milliseconds.
 */
const DEFAULT_MAX_CACHE_DURATION_MS = 3 * 24 * 60 * 60 * 1000;
/**
 * OfflineTransport - Caches telemetry when offline and replays when online.
 *
 * This transport wraps other transports and provides offline caching functionality.
 * When the device is offline, telemetry is cached to AsyncStorage.
 * When connectivity is restored, cached telemetry is replayed through the wrapped transports.
 *
 * Implementation follows Flutter SDK's OfflineTransport pattern:
 * - Uses AsyncStorage for persistent caching (matching Flutter's SharedPreferences)
 * - Respects maxCacheDuration to skip expired entries
 * - Uses mutex pattern for thread-safe cache access
 * - Excludes itself when replaying to prevent infinite loops
 *
 * @example
 * ```typescript
 * import { initializeFaro, FetchTransport, OfflineTransport } from '@grafana/faro-react-native';
 *
 * initializeFaro({
 *   url: 'https://collector.example.com',
 *   transports: [
 *     new OfflineTransport({
 *       maxCacheDurationMs: 3 * 24 * 60 * 60 * 1000, // 3 days
 *     }),
 *     new FetchTransport({ url: 'https://collector.example.com' }),
 *   ],
 * });
 * ```
 */
export class OfflineTransport extends BaseTransport {
    constructor(options = {}) {
        var _a;
        super();
        this.name = '@grafana/faro-react-native:transport-offline';
        this.version = VERSION;
        this.otherTransports = [];
        this.unsubscribeConnectivity = null;
        this.isReplaying = false;
        this.maxCacheDurationMs = (_a = options.maxCacheDurationMs) !== null && _a !== void 0 ? _a : DEFAULT_MAX_CACHE_DURATION_MS;
        this.cache = new AsyncStorageOfflineCache({
            storageKeyPrefix: options.storageKeyPrefix,
            maxCacheSize: options.maxCacheSize,
        });
        this.connectivityService = new DefaultConnectivityService(options.connectivityCheckIntervalMs);
        // Subscribe to connectivity changes
        this.unsubscribeConnectivity = this.connectivityService.subscribe((isOnline) => {
            if (isOnline && !this.isReplaying) {
                this.replayCachedPayloads();
            }
        });
    }
    /**
     * Send telemetry items.
     *
     * When offline, items are cached for later replay.
     * When online, this transport does nothing (other transports handle sending).
     */
    send(items) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemsArray = Array.isArray(items) ? items : [items];
            if (itemsArray.length === 0) {
                return;
            }
            if (!this.connectivityService.isOnline) {
                // Cache items when offline
                const payload = {
                    timestamp: Date.now(),
                    items: itemsArray,
                };
                try {
                    yield this.cache.write(payload);
                    this.logDebug(`Cached ${itemsArray.length} items for offline replay`);
                }
                catch (error) {
                    this.logError('Failed to cache offline payload', error);
                }
            }
            // When online, do nothing - other transports handle sending
        });
    }
    getIgnoreUrls() {
        return [];
    }
    isBatched() {
        return true;
    }
    /**
     * Register other transports for replay.
     * Called by the transport system after initialization.
     */
    setOtherTransports(transports) {
        this.otherTransports.length = 0;
        for (const transport of transports) {
            if (transport !== this) {
                this.otherTransports.push(transport);
            }
        }
    }
    /**
     * Get the current number of cached payloads.
     */
    getCachedCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.cache.getCount();
        });
    }
    /**
     * Manually trigger replay of cached payloads.
     * Useful for testing or when you want to force a replay attempt.
     */
    forceReplay() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connectivityService.isOnline) {
                yield this.replayCachedPayloads();
            }
        });
    }
    /**
     * Clear all cached payloads.
     */
    clearCache() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cache.clear();
        });
    }
    /**
     * Clean up resources.
     */
    dispose() {
        if (this.unsubscribeConnectivity) {
            this.unsubscribeConnectivity();
            this.unsubscribeConnectivity = null;
        }
        this.connectivityService.dispose();
    }
    /**
     * Replay cached payloads through other transports.
     * Follows Flutter SDK's _readFromFile pattern.
     */
    replayCachedPayloads() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isReplaying) {
                return;
            }
            this.isReplaying = true;
            try {
                const payloads = yield this.cache.readAll();
                if (payloads.length === 0) {
                    return;
                }
                this.logDebug(`Replaying ${payloads.length} cached payloads`);
                const now = Date.now();
                const successfulTimestamps = [];
                for (const payload of payloads) {
                    // Skip expired payloads
                    if (now - payload.timestamp > this.maxCacheDurationMs) {
                        this.logDebug(`Skipping expired payload from ${new Date(payload.timestamp).toISOString()}`);
                        successfulTimestamps.push(payload.timestamp);
                        continue;
                    }
                    const success = yield this.sendToOtherTransports(payload.items);
                    if (success) {
                        successfulTimestamps.push(payload.timestamp);
                    }
                }
                // Remove successfully sent or expired payloads
                if (successfulTimestamps.length > 0) {
                    yield this.cache.removeByTimestamps(successfulTimestamps);
                    this.logDebug(`Removed ${successfulTimestamps.length} payloads from cache`);
                }
            }
            catch (error) {
                this.logError('Failed to replay cached payloads', error);
            }
            finally {
                this.isReplaying = false;
            }
        });
    }
    /**
     * Send items to all other registered transports.
     * Follows Flutter SDK's _sendCachedData pattern.
     */
    sendToOtherTransports(items) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.otherTransports.length === 0) {
                this.logWarn('No other transports registered for offline replay');
                return false;
            }
            try {
                for (const transport of this.otherTransports) {
                    yield transport.send(items);
                }
                return true;
            }
            catch (error) {
                this.logError('Failed to send cached payload to transports', error);
                return false;
            }
        });
    }
}
//# sourceMappingURL=transport.js.map