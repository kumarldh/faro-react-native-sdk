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
exports.AsyncStorageUserPersistence = void 0;
exports.createUserPersistence = createUserPersistence;
exports.initializeUserPersistence = initializeUserPersistence;
exports.getUserPersistence = getUserPersistence;
exports.setUserPersistence = setUserPersistence;
var async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
/**
 * Default storage key for user data.
 */
var DEFAULT_STORAGE_KEY = 'faro_persisted_user';
/**
 * UserPersistence implementation using AsyncStorage.
 *
 * Stores user information persistently so it can be restored on app restart.
 * This ensures early telemetry events include user identification.
 *
 * Implementation follows Flutter SDK's UserPersistence pattern:
 * - Uses AsyncStorage for persistence (matching Flutter's SharedPreferences)
 * - Stores user as JSON
 * - Handles null/cleared users
 *
 * @example
 * ```typescript
 * import { createUserPersistence } from '@grafana/faro-react-native';
 *
 * // Load user on app start
 * const persistence = createUserPersistence();
 * const user = await persistence.loadUser();
 *
 * if (user) {
 *   faro.api.setUser(user);
 * }
 *
 * // Save user when logged in
 * const loggedInUser = { id: '123', email: 'user@example.com' };
 * await persistence.saveUser(loggedInUser);
 *
 * // Clear on logout
 * await persistence.clearUser();
 * ```
 */
var AsyncStorageUserPersistence = /** @class */ (function () {
    function AsyncStorageUserPersistence(options) {
        if (options === void 0) { options = {}; }
        var _a;
        this.storageKey = (_a = options.storageKey) !== null && _a !== void 0 ? _a : DEFAULT_STORAGE_KEY;
    }
    AsyncStorageUserPersistence.prototype.loadUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userJson, userData, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(this.storageKey)];
                    case 1:
                        userJson = _b.sent();
                        if (userJson === null) {
                            return [2 /*return*/, null];
                        }
                        userData = JSON.parse(userJson);
                        if (!this.isValidMetaUser(userData)) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, userData];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AsyncStorageUserPersistence.prototype.saveUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var userJson, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!(user === null || this.isCleared(user))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.clearUser()];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                    case 2:
                        userJson = JSON.stringify(user);
                        return [4 /*yield*/, async_storage_1.default.setItem(this.storageKey, userJson)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AsyncStorageUserPersistence.prototype.clearUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.removeItem(this.storageKey)];
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
    AsyncStorageUserPersistence.prototype.hasPersistedUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userJson, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(this.storageKey)];
                    case 1:
                        userJson = _b.sent();
                        return [2 /*return*/, userJson !== null];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if user is cleared (all fields empty/undefined).
     */
    AsyncStorageUserPersistence.prototype.isCleared = function (user) {
        return !user.id && !user.email && !user.username && !user.fullName && !user.roles;
    };
    /**
     * Validate that the parsed object is a valid MetaUser.
     */
    AsyncStorageUserPersistence.prototype.isValidMetaUser = function (obj) {
        if (typeof obj !== 'object' || obj === null) {
            return false;
        }
        // MetaUser has optional string fields, so any object is technically valid
        // We just need to make sure it's an object
        return true;
    };
    return AsyncStorageUserPersistence;
}());
exports.AsyncStorageUserPersistence = AsyncStorageUserPersistence;
/**
 * Factory function to create a UserPersistence instance.
 */
function createUserPersistence(options) {
    if (options === void 0) { options = {}; }
    return new AsyncStorageUserPersistence(options);
}
/**
 * Global user persistence instance.
 */
var globalUserPersistence = null;
/**
 * Initialize the global user persistence.
 */
function initializeUserPersistence(options) {
    if (options === void 0) { options = {}; }
    globalUserPersistence = createUserPersistence(options);
    return globalUserPersistence;
}
/**
 * Get the global user persistence instance.
 */
function getUserPersistence() {
    return globalUserPersistence;
}
/**
 * Set a custom user persistence instance.
 */
function setUserPersistence(persistence) {
    globalUserPersistence = persistence;
}
//# sourceMappingURL=UserPersistence.js.map