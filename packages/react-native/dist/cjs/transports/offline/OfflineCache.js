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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncStorageOfflineCache = void 0;
var async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
/**
 * Default storage key prefix for the offline cache.
 */
var DEFAULT_STORAGE_KEY_PREFIX = 'faro_offline_cache';
/**
 * Default maximum number of cached payloads.
 */
var DEFAULT_MAX_CACHE_SIZE = 1000;
/**
 * File-based offline cache implementation using AsyncStorage.
 *
 * Stores cached telemetry payloads as JSONL (one JSON object per line)
 * following the Flutter SDK's offline transport pattern.
 *
 * Uses a mutex pattern for thread-safe file access.
 */
var AsyncStorageOfflineCache = /** @class */ (function () {
    function AsyncStorageOfflineCache(options) {
        if (options === void 0) { options = {}; }
        var _a, _b;
        this.lockPromise = Promise.resolve();
        this.storageKey = "".concat((_a = options.storageKeyPrefix) !== null && _a !== void 0 ? _a : DEFAULT_STORAGE_KEY_PREFIX, "_data");
        this.maxCacheSize = (_b = options.maxCacheSize) !== null && _b !== void 0 ? _b : DEFAULT_MAX_CACHE_SIZE;
    }
    AsyncStorageOfflineCache.prototype.write = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                            var payloads;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.readAllInternal()];
                                    case 1:
                                        payloads = _a.sent();
                                        // Add new payload
                                        payloads.push(payload);
                                        // Trim to max size (remove oldest entries)
                                        while (payloads.length > this.maxCacheSize) {
                                            payloads.shift();
                                        }
                                        return [4 /*yield*/, this.writeAll(payloads)];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AsyncStorageOfflineCache.prototype.readAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, this.readAllInternal()];
                        });
                    }); })];
            });
        });
    };
    AsyncStorageOfflineCache.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, async_storage_1.default.removeItem(this.storageKey)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AsyncStorageOfflineCache.prototype.removeByTimestamps = function (timestamps) {
        return __awaiter(this, void 0, void 0, function () {
            var timestampSet;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (timestamps.length === 0)
                            return [2 /*return*/];
                        timestampSet = new Set(timestamps);
                        return [4 /*yield*/, this.withLock(function () { return __awaiter(_this, void 0, void 0, function () {
                                var payloads, remaining;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.readAllInternal()];
                                        case 1:
                                            payloads = _a.sent();
                                            remaining = payloads.filter(function (p) { return !timestampSet.has(p.timestamp); });
                                            return [4 /*yield*/, this.writeAll(remaining)];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AsyncStorageOfflineCache.prototype.getCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var payloads;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readAllInternal()];
                    case 1:
                        payloads = _a.sent();
                        return [2 /*return*/, payloads.length];
                }
            });
        });
    };
    /**
     * Execute an operation with a mutex lock to ensure thread-safe access.
     * Follows Flutter SDK's Completer-based lock pattern.
     */
    AsyncStorageOfflineCache.prototype.withLock = function (operation) {
        return __awaiter(this, void 0, void 0, function () {
            var currentLock, resolveLock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentLock = this.lockPromise;
                        this.lockPromise = new Promise(function (resolve) {
                            resolveLock = resolve;
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 5]);
                        return [4 /*yield*/, currentLock];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, operation()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        resolveLock();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AsyncStorageOfflineCache.prototype.readAllInternal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, parsed, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(this.storageKey)];
                    case 1:
                        data = _b.sent();
                        if (!data) {
                            return [2 /*return*/, []];
                        }
                        parsed = JSON.parse(data);
                        if (!Array.isArray(parsed)) {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, parsed.filter(this.isValidCachedPayload)];
                    case 2:
                        _a = _b.sent();
                        // If parsing fails, return empty array
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AsyncStorageOfflineCache.prototype.writeAll = function (payloads) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(payloads.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, async_storage_1.default.removeItem(this.storageKey)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, async_storage_1.default.setItem(this.storageKey, JSON.stringify(payloads))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AsyncStorageOfflineCache.prototype.isValidCachedPayload = function (payload) {
        if (typeof payload !== 'object' || payload === null) {
            return false;
        }
        var p = payload;
        return typeof p['timestamp'] === 'number' && Array.isArray(p['items']);
    };
    return AsyncStorageOfflineCache;
}());
exports.AsyncStorageOfflineCache = AsyncStorageOfflineCache;
//# sourceMappingURL=OfflineCache.js.map