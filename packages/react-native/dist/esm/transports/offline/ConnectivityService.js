var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Try to use NetInfo if available, otherwise fall back to basic online detection
let NetInfo = null;
try {
    NetInfo = require('@react-native-community/netinfo').default;
}
catch (_a) {
    // NetInfo not available, will fall back to basic detection
}
/**
 * Default connectivity check interval in milliseconds.
 */
const DEFAULT_CHECK_INTERVAL_MS = 30000;
/**
 * Service for detecting network connectivity changes.
 *
 * Uses @react-native-community/netinfo when available, otherwise falls back
 * to basic fetch-based connectivity detection.
 *
 * Implementation follows Flutter SDK's InternetConnectivityService pattern.
 */
export class DefaultConnectivityService {
    constructor(checkIntervalMs = DEFAULT_CHECK_INTERVAL_MS) {
        this._isOnline = true;
        this.subscribers = new Set();
        this.unsubscribeNetInfo = null;
        this.checkIntervalId = null;
        this.checkIntervalMs = checkIntervalMs;
        this.initialize();
    }
    get isOnline() {
        return this._isOnline;
    }
    subscribe(callback) {
        this.subscribers.add(callback);
        // Immediately notify subscriber of current state
        callback(this._isOnline);
        return () => {
            this.subscribers.delete(callback);
        };
    }
    dispose() {
        if (this.unsubscribeNetInfo) {
            this.unsubscribeNetInfo();
            this.unsubscribeNetInfo = null;
        }
        if (this.checkIntervalId) {
            clearInterval(this.checkIntervalId);
            this.checkIntervalId = null;
        }
        this.subscribers.clear();
    }
    initialize() {
        if (NetInfo) {
            this.initializeWithNetInfo();
        }
        else {
            this.initializeWithPolling();
        }
    }
    initializeWithNetInfo() {
        if (!NetInfo)
            return;
        // Initial check
        NetInfo.fetch().then((state) => {
            var _a;
            this.setOnline((_a = state.isConnected) !== null && _a !== void 0 ? _a : true);
        });
        // Subscribe to changes
        this.unsubscribeNetInfo = NetInfo.addEventListener((state) => {
            var _a;
            this.setOnline((_a = state.isConnected) !== null && _a !== void 0 ? _a : true);
        });
    }
    initializeWithPolling() {
        // Initial check
        this.checkConnectivity();
        // Poll periodically
        this.checkIntervalId = setInterval(() => {
            this.checkConnectivity();
        }, this.checkIntervalMs);
    }
    checkConnectivity() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Simple fetch-based connectivity check
                // We use a small, fast endpoint
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                yield fetch('https://one.one.one.one/cdn-cgi/trace', {
                    method: 'HEAD',
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                this.setOnline(true);
            }
            catch (_a) {
                this.setOnline(false);
            }
        });
    }
    setOnline(isOnline) {
        if (this._isOnline !== isOnline) {
            this._isOnline = isOnline;
            this.notifySubscribers();
        }
    }
    notifySubscribers() {
        this.subscribers.forEach((subscriber) => {
            try {
                subscriber(this._isOnline);
            }
            catch (_a) {
                // Ignore subscriber errors
            }
        });
    }
}
//# sourceMappingURL=ConnectivityService.js.map