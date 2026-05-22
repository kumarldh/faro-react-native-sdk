import type { CachedPayload, OfflineCache } from './types';
/**
 * File-based offline cache implementation using AsyncStorage.
 *
 * Stores cached telemetry payloads as JSONL (one JSON object per line)
 * following the Flutter SDK's offline transport pattern.
 *
 * Uses a mutex pattern for thread-safe file access.
 */
export declare class AsyncStorageOfflineCache implements OfflineCache {
    private readonly storageKey;
    private readonly maxCacheSize;
    private lockPromise;
    constructor(options?: {
        storageKeyPrefix?: string;
        maxCacheSize?: number;
    });
    write(payload: CachedPayload): Promise<void>;
    readAll(): Promise<CachedPayload[]>;
    clear(): Promise<void>;
    removeByTimestamps(timestamps: number[]): Promise<void>;
    getCount(): Promise<number>;
    /**
     * Execute an operation with a mutex lock to ensure thread-safe access.
     * Follows Flutter SDK's Completer-based lock pattern.
     */
    private withLock;
    private readAllInternal;
    private writeAll;
    private isValidCachedPayload;
}
