import { BaseTransport } from '@grafana/faro-core';
import type { Patterns, Transport, TransportItem } from '@grafana/faro-core';
import type { OfflineTransportOptions } from './types';
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
export declare class OfflineTransport extends BaseTransport {
    readonly name = "@grafana/faro-react-native:transport-offline";
    readonly version = "2.3.1";
    private readonly cache;
    private readonly connectivityService;
    private readonly maxCacheDurationMs;
    private readonly otherTransports;
    private unsubscribeConnectivity;
    private isReplaying;
    constructor(options?: OfflineTransportOptions);
    /**
     * Send telemetry items.
     *
     * When offline, items are cached for later replay.
     * When online, this transport does nothing (other transports handle sending).
     */
    send(items: TransportItem | TransportItem[]): Promise<void>;
    getIgnoreUrls(): Patterns;
    isBatched(): boolean;
    /**
     * Register other transports for replay.
     * Called by the transport system after initialization.
     */
    setOtherTransports(transports: Transport[]): void;
    /**
     * Get the current number of cached payloads.
     */
    getCachedCount(): Promise<number>;
    /**
     * Manually trigger replay of cached payloads.
     * Useful for testing or when you want to force a replay attempt.
     */
    forceReplay(): Promise<void>;
    /**
     * Clear all cached payloads.
     */
    clearCache(): Promise<void>;
    /**
     * Clean up resources.
     */
    dispose(): void;
    /**
     * Replay cached payloads through other transports.
     * Follows Flutter SDK's _readFromFile pattern.
     */
    private replayCachedPayloads;
    /**
     * Send items to all other registered transports.
     * Follows Flutter SDK's _sendCachedData pattern.
     */
    private sendToOtherTransports;
}
