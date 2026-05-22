import type { ConnectivityService } from './types';
/**
 * Service for detecting network connectivity changes.
 *
 * Uses @react-native-community/netinfo when available, otherwise falls back
 * to basic fetch-based connectivity detection.
 *
 * Implementation follows Flutter SDK's InternetConnectivityService pattern.
 */
export declare class DefaultConnectivityService implements ConnectivityService {
    private _isOnline;
    private readonly subscribers;
    private unsubscribeNetInfo;
    private checkIntervalId;
    private readonly checkIntervalMs;
    constructor(checkIntervalMs?: number);
    get isOnline(): boolean;
    subscribe(callback: (isOnline: boolean) => void): () => void;
    dispose(): void;
    private initialize;
    private initializeWithNetInfo;
    private initializeWithPolling;
    private checkConnectivity;
    private setOnline;
    private notifySubscribers;
}
