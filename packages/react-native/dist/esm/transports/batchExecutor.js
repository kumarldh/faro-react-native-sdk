import { AppState } from 'react-native';
const DEFAULT_SEND_TIMEOUT_MS = 250;
const DEFAULT_BATCH_ITEM_LIMIT = 50;
export class RNBatchExecutor {
    constructor(sendFn, options) {
        var _a, _b;
        this.signalBuffer = [];
        this.itemLimit = (_a = options === null || options === void 0 ? void 0 : options.itemLimit) !== null && _a !== void 0 ? _a : DEFAULT_BATCH_ITEM_LIMIT;
        this.sendTimeout = (_b = options === null || options === void 0 ? void 0 : options.sendTimeout) !== null && _b !== void 0 ? _b : DEFAULT_SEND_TIMEOUT_MS;
        this.paused = (options === null || options === void 0 ? void 0 : options.paused) || false;
        this.sendFn = sendFn;
        if (!this.paused) {
            this.start();
        }
        // Send batched/buffered data when app goes to background
        // This is the React Native equivalent of document.visibilitychange
        this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                this.flush();
            }
        });
    }
    addItem(item) {
        if (this.paused) {
            return;
        }
        this.signalBuffer.push(item);
        if (this.signalBuffer.length >= this.itemLimit) {
            this.flush();
        }
    }
    start() {
        this.paused = false;
        if (this.sendTimeout > 0) {
            // Use global setInterval (not window.setInterval)
            this.flushInterval = setInterval(() => this.flush(), this.sendTimeout);
        }
    }
    pause() {
        this.paused = true;
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
        }
    }
    cleanup() {
        this.pause();
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
        }
    }
    groupItems(items) {
        const itemMap = new Map();
        items.forEach((item) => {
            const metaKey = JSON.stringify(item.meta);
            let currentItems = itemMap.get(metaKey);
            if (currentItems === undefined) {
                currentItems = [item];
            }
            else {
                currentItems = [...currentItems, item];
            }
            itemMap.set(metaKey, currentItems);
        });
        return Array.from(itemMap.values());
    }
    flush() {
        if (this.paused || this.signalBuffer.length === 0) {
            return;
        }
        const itemGroups = this.groupItems(this.signalBuffer);
        itemGroups.forEach(this.sendFn);
        this.signalBuffer = [];
    }
}
//# sourceMappingURL=batchExecutor.js.map