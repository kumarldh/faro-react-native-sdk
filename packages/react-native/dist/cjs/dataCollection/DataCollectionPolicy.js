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
exports.AsyncStorageDataCollectionPolicy = void 0;
exports.createDataCollectionPolicy = createDataCollectionPolicy;
exports.initializeDataCollectionPolicy = initializeDataCollectionPolicy;
exports.getDataCollectionPolicy = getDataCollectionPolicy;
exports.setDataCollectionPolicy = setDataCollectionPolicy;
var async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
/**
 * Default storage key for the data collection policy.
 */
var DEFAULT_STORAGE_KEY = 'faro_enable_data_collection';
/**
 * DataCollectionPolicy implementation using AsyncStorage.
 *
 * Controls whether telemetry data is collected and sent.
 * The setting is persisted to AsyncStorage so it survives app restarts.
 *
 * Implementation follows Flutter SDK's DataCollectionPolicy pattern:
 * - Uses AsyncStorage for persistence (matching Flutter's SharedPreferences)
 * - Provides enable/disable methods
 * - Initializes from persisted value or default
 *
 * @example
 * ```typescript
 * import { createDataCollectionPolicy } from '@grafana/faro-react-native';
 *
 * // Create and initialize the policy
 * const policy = await createDataCollectionPolicy();
 *
 * // Check if enabled
 * if (policy.isEnabled) {
 *   // Data collection is allowed
 * }
 *
 * // User opts out
 * await policy.disable();
 *
 * // User opts back in
 * await policy.enable();
 * ```
 */
var AsyncStorageDataCollectionPolicy = /** @class */ (function () {
    function AsyncStorageDataCollectionPolicy(options) {
        if (options === void 0) { options = {}; }
        var _a, _b;
        this.subscribers = new Set();
        this.storageKey = (_a = options.storageKey) !== null && _a !== void 0 ? _a : DEFAULT_STORAGE_KEY;
        this._isEnabled = (_b = options.defaultEnabled) !== null && _b !== void 0 ? _b : true;
    }
    /**
     * Create and initialize a DataCollectionPolicy.
     *
     * This async factory method loads the persisted value from AsyncStorage.
     */
    AsyncStorageDataCollectionPolicy.create = function () {
        return __awaiter(this, arguments, void 0, function (options) {
            var policy;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        policy = new AsyncStorageDataCollectionPolicy(options);
                        return [4 /*yield*/, policy.initialize()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, policy];
                }
            });
        });
    };
    Object.defineProperty(AsyncStorageDataCollectionPolicy.prototype, "isEnabled", {
        get: function () {
            return this._isEnabled;
        },
        enumerable: false,
        configurable: true
    });
    AsyncStorageDataCollectionPolicy.prototype.enable = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._isEnabled = true;
                        return [4 /*yield*/, this.persistSetting()];
                    case 1:
                        _a.sent();
                        this.notifySubscribers();
                        return [2 /*return*/];
                }
            });
        });
    };
    AsyncStorageDataCollectionPolicy.prototype.disable = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._isEnabled = false;
                        return [4 /*yield*/, this.persistSetting()];
                    case 1:
                        _a.sent();
                        this.notifySubscribers();
                        return [2 /*return*/];
                }
            });
        });
    };
    AsyncStorageDataCollectionPolicy.prototype.subscribe = function (callback) {
        var _this = this;
        this.subscribers.add(callback);
        // Immediately notify subscriber of current state
        callback(this._isEnabled);
        return function () {
            _this.subscribers.delete(callback);
        };
    };
    AsyncStorageDataCollectionPolicy.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storedValue, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(this.storageKey)];
                    case 1:
                        storedValue = _b.sent();
                        if (storedValue !== null) {
                            this._isEnabled = storedValue === 'true';
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AsyncStorageDataCollectionPolicy.prototype.persistSetting = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.setItem(this.storageKey, String(this._isEnabled))];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AsyncStorageDataCollectionPolicy.prototype.notifySubscribers = function () {
        var _this = this;
        this.subscribers.forEach(function (subscriber) {
            try {
                subscriber(_this._isEnabled);
            }
            catch (_a) {
                // Ignore subscriber errors
            }
        });
    };
    return AsyncStorageDataCollectionPolicy;
}());
exports.AsyncStorageDataCollectionPolicy = AsyncStorageDataCollectionPolicy;
/**
 * Factory function to create a DataCollectionPolicy.
 *
 * @example
 * ```typescript
 * const policy = await createDataCollectionPolicy();
 * ```
 */
function createDataCollectionPolicy() {
    return __awaiter(this, arguments, void 0, function (options) {
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            return [2 /*return*/, AsyncStorageDataCollectionPolicy.create(options)];
        });
    });
}
/**
 * Global data collection policy instance.
 * Must be initialized before use.
 */
var globalPolicy = null;
/**
 * Initialize the global data collection policy.
 *
 * This should be called early in app initialization, before initializeFaro().
 *
 * @example
 * ```typescript
 * import { initializeDataCollectionPolicy, getDataCollectionPolicy } from '@grafana/faro-react-native';
 *
 * // Early in app startup
 * await initializeDataCollectionPolicy();
 *
 * // Later, check if collection is enabled
 * const policy = getDataCollectionPolicy();
 * if (policy?.isEnabled) {
 *   // Initialize Faro
 * }
 * ```
 */
function initializeDataCollectionPolicy() {
    return __awaiter(this, arguments, void 0, function (options) {
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createDataCollectionPolicy(options)];
                case 1:
                    globalPolicy = _a.sent();
                    return [2 /*return*/, globalPolicy];
            }
        });
    });
}
/**
 * Get the global data collection policy.
 *
 * Returns null if not initialized.
 */
function getDataCollectionPolicy() {
    return globalPolicy;
}
/**
 * Set a custom data collection policy.
 *
 * Useful for testing or custom implementations.
 */
function setDataCollectionPolicy(policy) {
    globalPolicy = policy;
}
//# sourceMappingURL=DataCollectionPolicy.js.map