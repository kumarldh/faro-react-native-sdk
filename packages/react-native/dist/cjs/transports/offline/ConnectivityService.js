"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultConnectivityService = void 0;
// Try to use NetInfo if available, otherwise fall back to basic online detection
var NetInfo = null;
try {
    NetInfo = require('@react-native-community/netinfo').default;
}
catch (_a) {
    // NetInfo not available, will fall back to basic detection
}
/**
 * Default connectivity check interval in milliseconds.
 */
var DEFAULT_CHECK_INTERVAL_MS = 30000;
/**
 * Service for detecting network connectivity changes.
 *
 * Uses @react-native-community/netinfo when available, otherwise falls back
 * to basic fetch-based connectivity detection.
 *
 * Implementation follows Flutter SDK's InternetConnectivityService pattern.
 */
var DefaultConnectivityService = /** @class */ (function () {
    function DefaultConnectivityService(checkIntervalMs) {
        if (checkIntervalMs === void 0) { checkIntervalMs = DEFAULT_CHECK_INTERVAL_MS; }
        this._isOnline = true;
        this.subscribers = new Set();
        this.unsubscribeNetInfo = null;
        this.checkIntervalId = null;
        this.checkIntervalMs = checkIntervalMs;
        this.initialize();
    }
    Object.defineProperty(DefaultConnectivityService.prototype, "isOnline", {
        get: function () {
            return this._isOnline;
        },
        enumerable: false,
        configurable: true
    });
    DefaultConnectivityService.prototype.subscribe = function (callback) {
        var _this = this;
        this.subscribers.add(callback);
        // Immediately notify subscriber of current state
        callback(this._isOnline);
        return function () {
            _this.subscribers.delete(callback);
        };
    };
    DefaultConnectivityService.prototype.dispose = function () {
        if (this.unsubscribeNetInfo) {
            this.unsubscribeNetInfo();
            this.unsubscribeNetInfo = null;
        }
        if (this.checkIntervalId) {
            clearInterval(this.checkIntervalId);
            this.checkIntervalId = null;
        }
        this.subscribers.clear();
    };
    DefaultConnectivityService.prototype.initialize = function () {
        if (NetInfo) {
            this.initializeWithNetInfo();
        }
        else {
            this.initializeWithPolling();
        }
    };
    DefaultConnectivityService.prototype.initializeWithNetInfo = function () {
        var _this = this;
        if (!NetInfo)
            return;
        // Initial check
        NetInfo.fetch().then(function (state) {
            var _a;
            _this.setOnline((_a = state.isConnected) !== null && _a !== void 0 ? _a : true);
        });
        // Subscribe to changes
        this.unsubscribeNetInfo = NetInfo.addEventListener(function (state) {
            var _a;
            _this.setOnline((_a = state.isConnected) !== null && _a !== void 0 ? _a : true);
        });
    };
    DefaultConnectivityService.prototype.initializeWithPolling = function () {
        var _this = this;
        // Initial check
        this.checkConnectivity();
        // Poll periodically
        this.checkIntervalId = setInterval(function () {
            _this.checkConnectivity();
        }, this.checkIntervalMs);
    };
    DefaultConnectivityService.prototype.checkConnectivity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var controller_1, timeoutId, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        controller_1 = new AbortController();
                        timeoutId = setTimeout(function () { return controller_1.abort(); }, 5000);
                        return [4 /*yield*/, fetch('https://one.one.one.one/cdn-cgi/trace', {
                                method: 'HEAD',
                                signal: controller_1.signal,
                            })];
                    case 1:
                        _b.sent();
                        clearTimeout(timeoutId);
                        this.setOnline(true);
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        this.setOnline(false);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DefaultConnectivityService.prototype.setOnline = function (isOnline) {
        if (this._isOnline !== isOnline) {
            this._isOnline = isOnline;
            this.notifySubscribers();
        }
    };
    DefaultConnectivityService.prototype.notifySubscribers = function () {
        var _this = this;
        this.subscribers.forEach(function (subscriber) {
            try {
                subscriber(_this._isOnline);
            }
            catch (_a) {
                // Ignore subscriber errors
            }
        });
    };
    return DefaultConnectivityService;
}());
exports.DefaultConnectivityService = DefaultConnectivityService;
//# sourceMappingURL=ConnectivityService.js.map