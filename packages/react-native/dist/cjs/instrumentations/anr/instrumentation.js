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
exports.ANRInstrumentation = void 0;
var react_native_1 = require("react-native");
var faro_core_1 = require("@grafana/faro-core");
var const_1 = require("../errors/const");
/**
 * Default timeout for ANR detection (5 seconds, matching Android's threshold)
 */
var DEFAULT_TIMEOUT = 5000;
/**
 * Default polling interval for ANR status (60 seconds, matching Flutter SDK)
 */
var DEFAULT_POLLING_INTERVAL = 60000;
/**
 * ANR (Application Not Responding) Detection Instrumentation.
 *
 * Detects when the main/UI thread is blocked for extended periods on Android.
 * Uses a background thread that posts tasks to the main thread and monitors
 * if they complete within the timeout.
 *
 * **Note**: ANR detection is only available on Android. iOS does not have
 * the same ANR concept as Android's system watchdog.
 *
 * Sends telemetry via Faro API:
 * - Measurement: `anr` with `anr_count` value (for dashboards)
 * - Error: Each ANR with `type: 'ANR'`, stack trace, duration, timestamp (Sentry-aligned)
 *
 * @example
 * ```typescript
 * import { initializeFaro, ANRInstrumentation } from '@grafana/faro-react-native';
 *
 * initializeFaro({
 *   url: 'https://collector.example.com',
 *   instrumentations: [
 *     new ANRInstrumentation({
 *       timeout: 5000,        // 5 second threshold
 *       pollingInterval: 60000, // Poll every 60 seconds
 *     }),
 *   ],
 * });
 * ```
 */
var ANRInstrumentation = /** @class */ (function (_super) {
    __extends(ANRInstrumentation, _super);
    function ANRInstrumentation(options) {
        if (options === void 0) { options = {}; }
        var _a, _b;
        var _this = _super.call(this) || this;
        _this.name = '@grafana/faro-react-native:instrumentation-anr';
        _this.version = faro_core_1.VERSION;
        _this.pollingIntervalId = null;
        _this.options = {
            timeout: (_a = options.timeout) !== null && _a !== void 0 ? _a : DEFAULT_TIMEOUT,
            pollingInterval: (_b = options.pollingInterval) !== null && _b !== void 0 ? _b : DEFAULT_POLLING_INTERVAL,
        };
        return _this;
    }
    ANRInstrumentation.prototype.initialize = function () {
        var _this = this;
        // ANR detection is only available on Android
        if (react_native_1.Platform.OS !== 'android') {
            this.logDebug('ANR detection is only available on Android');
            return;
        }
        var nativeModule = this.getNativeModule();
        if (!nativeModule) {
            this.logWarn('Native module not available for ANR detection');
            return;
        }
        this.logDebug('Initializing ANR detection instrumentation');
        // Start native ANR tracking
        this.startNativeTracking(nativeModule);
        // Set up polling for ANR status
        this.pollingIntervalId = setInterval(function () {
            _this.checkANRStatus(nativeModule);
        }, this.options.pollingInterval);
    };
    ANRInstrumentation.prototype.getNativeModule = function () {
        var FaroReactNativeModule = react_native_1.NativeModules.FaroReactNativeModule;
        if (!FaroReactNativeModule) {
            return null;
        }
        return FaroReactNativeModule;
    };
    ANRInstrumentation.prototype.startNativeTracking = function (nativeModule) {
        try {
            if (typeof nativeModule.startANRTracking === 'function') {
                nativeModule.startANRTracking({
                    timeout: this.options.timeout,
                });
                this.logDebug('Started native ANR tracking');
            }
        }
        catch (error) {
            this.logError('Failed to start native ANR tracking', error);
        }
    };
    ANRInstrumentation.prototype.checkANRStatus = function (nativeModule) {
        return __awaiter(this, void 0, void 0, function () {
            var anrList, _i, anrList_1, anrJson, anr, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (typeof nativeModule.getANRStatus !== 'function') {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, nativeModule.getANRStatus()];
                    case 1:
                        anrList = (_a.sent());
                        if (anrList && anrList.length > 0) {
                            // Push measurement for ANR count (matching Flutter pattern)
                            this.api.pushMeasurement({
                                type: 'anr',
                                values: { anr_count: anrList.length },
                            }, { skipDedupe: true });
                            // Push each ANR as an error with type='ANR' for filtering (Sentry-aligned)
                            for (_i = 0, anrList_1 = anrList; _i < anrList_1.length; _i++) {
                                anrJson = anrList_1[_i];
                                try {
                                    anr = JSON.parse(anrJson);
                                    this.api.pushError(new Error('ANR (Application Not Responding)'), {
                                        context: {
                                            duration: String(anr.duration),
                                            mechanism: const_1.ErrorMechanism.ANR,
                                            stacktrace: anr.stacktrace,
                                            timestamp: String(anr.timestamp),
                                        },
                                        type: 'ANR',
                                    });
                                }
                                catch (_b) {
                                    // If parsing fails, still log the raw ANR
                                    this.api.pushError(new Error('ANR (Application Not Responding)'), {
                                        context: {
                                            mechanism: const_1.ErrorMechanism.ANR,
                                            raw: anrJson,
                                        },
                                        type: 'ANR',
                                    });
                                }
                            }
                            this.logDebug("Recorded ".concat(anrList.length, " ANR event(s)"));
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.logError('Failed to check ANR status', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clean up resources when instrumentation is disabled.
     */
    ANRInstrumentation.prototype.unpatch = function () {
        // Stop polling
        if (this.pollingIntervalId !== null) {
            clearInterval(this.pollingIntervalId);
            this.pollingIntervalId = null;
        }
        // Stop native tracking
        if (react_native_1.Platform.OS === 'android') {
            var nativeModule = this.getNativeModule();
            if (nativeModule && typeof nativeModule.stopANRTracking === 'function') {
                try {
                    nativeModule.stopANRTracking();
                }
                catch (error) {
                    this.logError('Failed to stop native ANR tracking', error);
                }
            }
        }
        this.logDebug('ANR instrumentation stopped');
    };
    return ANRInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.ANRInstrumentation = ANRInstrumentation;
//# sourceMappingURL=instrumentation.js.map