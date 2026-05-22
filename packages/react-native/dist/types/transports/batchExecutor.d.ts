import type { TransportItem } from '@grafana/faro-core';
export type SendFn = (items: TransportItem[]) => void;
export interface BatchExecutorOptions {
    itemLimit?: number;
    sendTimeout?: number;
    paused?: boolean;
}
export declare class RNBatchExecutor {
    private readonly itemLimit;
    private readonly sendTimeout;
    private signalBuffer;
    private sendFn;
    private paused;
    private flushInterval?;
    private appStateSubscription?;
    constructor(sendFn: SendFn, options?: BatchExecutorOptions);
    addItem(item: TransportItem): void;
    start(): void;
    pause(): void;
    cleanup(): void;
    groupItems(items: TransportItem[]): TransportItem[][];
    private flush;
}
