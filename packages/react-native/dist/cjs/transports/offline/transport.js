"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.OfflineTransport = void 0;
var faro_core_1 = require("@grafana/faro-core");
var ConnectivityService_1 = require("./ConnectivityService");
var OfflineCache_1 = require("./OfflineCache");
/**
 * Default maximum cache duration: 3 days in milliseconds.
 */
var DEFAULT_MAX_CACHE_DURATION_MS = 3 * 24 * 60 * 60 * 1000;
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
var OfflineTransport = /** @class */ (function (_super) {
    __extends(OfflineTransport, _super);
    function OfflineTransport(options) {
        if (options === void 0) { options = {}; }
        var _a;
        var _this = _super.call(this) || this;
        _this.name = '@grafana/faro-react-native:transport-offline';
        _this.version = faro_core_1.VERSION;
        _this.otherTransports = [];
        _this.unsubscribeConnectivity = null;
        _this.isReplaying = false;
        _this.maxCacheDurationMs = (_a = options.maxCacheDurationMs) !== null && _a !== void 0 ? _a : DEFAULT_MAX_CACHE_DURATION_MS;
        _this.cache = new OfflineCache_1.AsyncStorageOfflineCache({
            storageKeyPrefix: options.storageKeyPrefix,
            maxCacheSize: options.maxCacheSize,
        });
        _this.connectivityService = new ConnectivityService_1.DefaultConnectivityService(options.connectivityCheckIntervalMs);
        // Subscribe to connectivity changes
        _this.unsubscribeConnectivity = _this.connectivityService.subscribe(function (isOnline) {
            if (isOnline && !_this.isReplaying) {
                _this.replayCachedPayloads();
            }
        });
        return _this;
    }
    /**
     * Send telemetry items.
     *
     * When offline, items are cached for later replay.
     * When online, this transport does nothing (other transports handle sending).
     */
    OfflineTransport.prototype.send = function (items) {
        return __awaiter(this, void 0, void 0, function () {
            var itemsArray, payload, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        itemsArray = Array.isArray(items) ? items : [items];
                        if (itemsArray.length === 0) {
                            return [2 /*return*/];
                        }
                        if (!!this.connectivityService.isOnline) return [3 /*break*/, 4];
                        payload = {
                            timestamp: Date.now(),
                            items: itemsArray,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.cache.write(payload)];
                    case 2:
                        _a.sent();
                        this.logDebug("Cached ".concat(itemsArray.length, " items for offline replay"));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.logError('Failed to cache offline payload', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OfflineTransport.prototype.getIgnoreUrls = function () {
        return [];
    };
    OfflineTransport.prototype.isBatched = function () {
        return true;
    };
    /**
     * Register other transports for replay.
     * Called by the transport system after initialization.
     */
    OfflineTransport.prototype.setOtherTransports = function (transports) {
        this.otherTransports.length = 0;
        for (var _i = 0, transports_1 = transports; _i < transports_1.length; _i++) {
            var transport = transports_1[_i];
            if (transport !== this) {
                this.otherTransports.push(transport);
            }
        }
    };
    /**
     * Get the current number of cached payloads.
     */
    OfflineTransport.prototype.getCachedCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cache.getCount()];
            });
        });
    };
    /**
     * Manually trigger replay of cached payloads.
     * Useful for testing or when you want to force a replay attempt.
     */
    OfflineTransport.prototype.forceReplay = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connectivityService.isOnline) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.replayCachedPayloads()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clear all cached payloads.
     */
    OfflineTransport.prototype.clearCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.clear()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clean up resources.
     */
    OfflineTransport.prototype.dispose = function () {
        if (this.unsubscribeConnectivity) {
            this.unsubscribeConnectivity();
            this.unsubscribeConnectivity = null;
        }
        this.connectivityService.dispose();
    };
    /**
     * Replay cached payloads through other transports.
     * Follows Flutter SDK's _readFromFile pattern.
     */
    OfflineTransport.prototype.replayCachedPayloads = function () {
        return __awaiter(this, void 0, void 0, function () {
            var payloads, now, successfulTimestamps, _i, payloads_1, payload, success, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isReplaying) {
                            return [2 /*return*/];
                        }
                        this.isReplaying = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, 10, 11]);
                        return [4 /*yield*/, this.cache.readAll()];
                    case 2:
                        payloads = _a.sent();
                        if (payloads.length === 0) {
                            return [2 /*return*/];
                        }
                        this.logDebug("Replaying ".concat(payloads.length, " cached payloads"));
                        now = Date.now();
                        successfulTimestamps = [];
                        _i = 0, payloads_1 = payloads;
                        _a.label = 3;
                    case 3:
                        if (!(_i < payloads_1.length)) return [3 /*break*/, 6];
                        payload = payloads_1[_i];
                        // Skip expired payloads
                        if (now - payload.timestamp > this.maxCacheDurationMs) {
                            this.logDebug("Skipping expired payload from ".concat(new Date(payload.timestamp).toISOString()));
                            successfulTimestamps.push(payload.timestamp);
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, this.sendToOtherTransports(payload.items)];
                    case 4:
                        success = _a.sent();
                        if (success) {
                            successfulTimestamps.push(payload.timestamp);
                        }
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (!(successfulTimestamps.length > 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.cache.removeByTimestamps(successfulTimestamps)];
                    case 7:
                        _a.sent();
                        this.logDebug("Removed ".concat(successfulTimestamps.length, " payloads from cache"));
                        _a.label = 8;
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        error_2 = _a.sent();
                        this.logError('Failed to replay cached payloads', error_2);
                        return [3 /*break*/, 11];
                    case 10:
                        this.isReplaying = false;
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Send items to all other registered transports.
     * Follows Flutter SDK's _sendCachedData pattern.
     */
    OfflineTransport.prototype.sendToOtherTransports = function (items) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, transport, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.otherTransports.length === 0) {
                            this.logWarn('No other transports registered for offline replay');
                            return [2 /*return*/, false];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        _i = 0, _a = this.otherTransports;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        transport = _a[_i];
                        return [4 /*yield*/, transport.send(items)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, true];
                    case 6:
                        error_3 = _b.sent();
                        this.logError('Failed to send cached payload to transports', error_3);
                        return [2 /*return*/, false];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return OfflineTransport;
}(faro_core_1.BaseTransport));
exports.OfflineTransport = OfflineTransport;
//# sourceMappingURL=transport.js.map