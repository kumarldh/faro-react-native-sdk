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
exports.FrameMonitoringInstrumentation = void 0;
var react_native_1 = require("react-native");
var faro_core_1 = require("@grafana/faro-core");
/**
 * Default configuration values matching Flutter SDK's hardcoded values.
 * These are React Native-specific advanced options for customization.
 */
var DEFAULT_TARGET_FPS = 60;
var DEFAULT_FROZEN_FRAME_THRESHOLD_MS = 100;
var DEFAULT_REFRESH_RATE_POLLING_INTERVAL = 30000;
var DEFAULT_NORMALIZED_REFRESH_RATE = 60;
/**
 * Frame Monitoring Instrumentation for React Native.
 *
 * Monitors frame rendering performance and detects slow/frozen frames.
 * Uses native CADisplayLink (iOS) and Choreographer (Android) for accurate metrics.
 *
 * ## Slow Frame Detection
 * Slow frames are detected using **event-based grouping** to report user-perceptible jank:
 * - Tracks consecutive frames below `targetFps` as a single "slow frame event"
 * - Only counts events lasting ≥50ms (~3 frames at 60fps) to filter noise
 * - This prevents reporting normal microsecond variations as slow frames
 * - Reports meaningful performance degradation that affects user experience
 *
 * ## Frozen Frame Detection
 * Frozen frames are individual frames exceeding `frozenFrameThresholdMs` (default 100ms).
 * These represent severe jank where the app appears unresponsive.
 *
 * Sends measurements via Faro API:
 * - `app_refresh_rate`: Current refresh rate in FPS
 * - `app_frames_rate`: Number of slow frame events (not individual frames)
 * - `app_frozen_frame`: Number of frozen frames (exceeding frozenFrameThresholdMs)
 *
 * @example
 * ```typescript
 * import { initializeFaro, FrameMonitoringInstrumentation } from '@grafana/faro-react-native';
 *
 * initializeFaro({
 *   url: 'https://collector.example.com',
 *   instrumentations: [
 *     new FrameMonitoringInstrumentation({
 *       targetFps: 60,
 *       frozenFrameThresholdMs: 100,
 *       refreshRatePollingInterval: 30000,
 *     }),
 *   ],
 * });
 * ```
 */
var FrameMonitoringInstrumentation = /** @class */ (function (_super) {
    __extends(FrameMonitoringInstrumentation, _super);
    function FrameMonitoringInstrumentation(options) {
        if (options === void 0) { options = {}; }
        var _a, _b, _c, _d;
        var _this = _super.call(this) || this;
        _this.name = '@grafana/faro-react-native:instrumentation-frame-monitoring';
        _this.version = faro_core_1.VERSION;
        _this.pollingIntervalId = null;
        _this.eventEmitter = null;
        _this.eventSubscriptions = [];
        _this.options = {
            targetFps: (_a = options.targetFps) !== null && _a !== void 0 ? _a : DEFAULT_TARGET_FPS,
            frozenFrameThresholdMs: (_b = options.frozenFrameThresholdMs) !== null && _b !== void 0 ? _b : DEFAULT_FROZEN_FRAME_THRESHOLD_MS,
            refreshRatePollingInterval: (_c = options.refreshRatePollingInterval) !== null && _c !== void 0 ? _c : DEFAULT_REFRESH_RATE_POLLING_INTERVAL,
            normalizedRefreshRate: (_d = options.normalizedRefreshRate) !== null && _d !== void 0 ? _d : DEFAULT_NORMALIZED_REFRESH_RATE,
        };
        return _this;
    }
    Object.defineProperty(FrameMonitoringInstrumentation.prototype, "refreshRateVitalsEnabled", {
        /**
         * Check if refresh rate vitals are enabled in Faro config.
         * Reads from faro.config.refreshRateVitals (single source of truth).
         */
        get: function () {
            var _a;
            // Access config via this.config which is set by BaseInstrumentation after initialization
            var config = this.config;
            return (_a = config === null || config === void 0 ? void 0 : config.refreshRateVitals) !== null && _a !== void 0 ? _a : false;
        },
        enumerable: false,
        configurable: true
    });
    FrameMonitoringInstrumentation.prototype.initialize = function () {
        this.logDebug('Initializing frame monitoring instrumentation');
        var nativeModule = this.getNativeModule();
        if (!nativeModule) {
            this.logWarn('Native module not available for frame monitoring');
            return;
        }
        // Start native frame monitoring with configuration
        this.startNativeMonitoring(nativeModule);
        // Set up event listeners for real-time frame events (Android pattern)
        this.setupEventListeners(nativeModule);
        // Set up polling for periodic metrics collection (iOS pattern)
        this.startPolling();
    };
    FrameMonitoringInstrumentation.prototype.getNativeModule = function () {
        var FaroReactNativeModule = react_native_1.NativeModules.FaroReactNativeModule;
        if (!FaroReactNativeModule) {
            return null;
        }
        return FaroReactNativeModule;
    };
    FrameMonitoringInstrumentation.prototype.startNativeMonitoring = function (nativeModule) {
        try {
            if (typeof nativeModule.startFrameMonitoring === 'function') {
                nativeModule.startFrameMonitoring({
                    targetFps: this.options.targetFps,
                    frozenFrameThresholdMs: this.options.frozenFrameThresholdMs,
                    normalizedRefreshRate: this.options.normalizedRefreshRate,
                });
                this.logDebug('Started native frame monitoring');
            }
        }
        catch (error) {
            this.logError('Failed to start native frame monitoring', error);
        }
    };
    FrameMonitoringInstrumentation.prototype.setupEventListeners = function (nativeModule) {
        var _this = this;
        // Android uses event-based approach for frozen frames only
        // Slow frames are retrieved via polling (like iOS) to avoid flooding
        if (react_native_1.Platform.OS === 'android') {
            try {
                this.eventEmitter = new react_native_1.NativeEventEmitter(nativeModule);
                // Listen for frozen frame events
                var frozenFrameSubscription = this.eventEmitter.addListener('onFrozenFrame', function (data) {
                    // Support both formats: number (legacy) or object (with duration)
                    if (typeof data === 'number') {
                        _this.handleFrozenFrame(data, 0);
                    }
                    else {
                        _this.handleFrozenFrame(data.count, data.durationMs || 0);
                    }
                });
                this.eventSubscriptions.push(frozenFrameSubscription);
                // Listen for refresh rate events (only when refreshRateVitals is enabled in config)
                if (this.refreshRateVitalsEnabled) {
                    var refreshRateSubscription = this.eventEmitter.addListener('onRefreshRate', function (refreshRate) {
                        _this.handleRefreshRate(refreshRate);
                    });
                    this.eventSubscriptions.push(refreshRateSubscription);
                }
                this.logDebug('Set up Android frame event listeners');
            }
            catch (error) {
                this.logError('Failed to set up frame event listeners', error);
            }
        }
    };
    FrameMonitoringInstrumentation.prototype.startPolling = function () {
        var _this = this;
        // Both iOS and Android use polling approach for slow frames
        // This provides consistent behavior and avoids flooding with events
        this.pollingIntervalId = setInterval(function () {
            _this.pollFrameMetrics();
        }, this.options.refreshRatePollingInterval);
    };
    FrameMonitoringInstrumentation.prototype.pollFrameMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nativeModule, refreshRate, metrics, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nativeModule = this.getNativeModule();
                        if (!nativeModule) {
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        if (!this.refreshRateVitalsEnabled) return [3 /*break*/, 3];
                        if (!(typeof nativeModule.getRefreshRate === 'function')) return [3 /*break*/, 3];
                        return [4 /*yield*/, nativeModule.getRefreshRate()];
                    case 2:
                        refreshRate = _a.sent();
                        if (refreshRate !== null && refreshRate > 0) {
                            this.handleRefreshRate(refreshRate);
                        }
                        _a.label = 3;
                    case 3:
                        if (!(typeof nativeModule.getFrameMetrics === 'function')) return [3 /*break*/, 5];
                        return [4 /*yield*/, nativeModule.getFrameMetrics()];
                    case 4:
                        metrics = (_a.sent());
                        if (metrics) {
                            if (this.refreshRateVitalsEnabled && metrics.refreshRate > 0) {
                                this.handleRefreshRate(metrics.refreshRate);
                            }
                            if (metrics.slowFrames > 0) {
                                this.handleSlowFrames(metrics.slowFrames);
                            }
                            if (metrics.frozenFrames > 0) {
                                this.handleFrozenFrame(metrics.frozenFrames, metrics.frozenDurationMs);
                            }
                        }
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        this.logError('Failed to poll frame metrics', error_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    FrameMonitoringInstrumentation.prototype.handleRefreshRate = function (refreshRate) {
        this.api.pushMeasurement({
            type: 'app_refresh_rate',
            values: { refresh_rate: refreshRate },
        }, { skipDedupe: true });
    };
    FrameMonitoringInstrumentation.prototype.handleSlowFrames = function (count) {
        // Note: Despite the name "slow_frames", this count represents slow frame EVENTS, not individual frames.
        // Each event is a period of consecutive slow frames lasting ≥50ms (~3 frames at 60fps).
        this.api.pushMeasurement({
            type: 'app_frames_rate',
            values: { slow_frames: count },
        }, { skipDedupe: true });
    };
    FrameMonitoringInstrumentation.prototype.handleFrozenFrame = function (count, durationMs) {
        // Only send frozen frame events if duration is greater than 0
        // This filters out any erroneous 0ms frozen frames
        if (durationMs > 0) {
            // 🔍 TEMP DEBUG LOG - Remove after analysis
            console.log("[Faro DEBUG ".concat(react_native_1.Platform.OS.toUpperCase(), "] \uD83E\uDDCA SENDING frozen frame: count=").concat(count, ", duration=").concat(durationMs, "ms"));
            this.api.pushMeasurement({
                type: 'app_frozen_frame',
                values: {
                    frozen_frames: count,
                    frozen_duration: durationMs,
                },
            }, { skipDedupe: true });
        }
    };
    /**
     * Clean up resources when instrumentation is disabled.
     */
    FrameMonitoringInstrumentation.prototype.unpatch = function () {
        // Stop polling
        if (this.pollingIntervalId !== null) {
            clearInterval(this.pollingIntervalId);
            this.pollingIntervalId = null;
        }
        // Remove event subscriptions
        for (var _i = 0, _a = this.eventSubscriptions; _i < _a.length; _i++) {
            var subscription = _a[_i];
            subscription.remove();
        }
        this.eventSubscriptions = [];
        this.eventEmitter = null;
        // Stop native monitoring
        var nativeModule = this.getNativeModule();
        if (nativeModule && typeof nativeModule.stopFrameMonitoring === 'function') {
            try {
                nativeModule.stopFrameMonitoring();
            }
            catch (error) {
                this.logError('Failed to stop native frame monitoring', error);
            }
        }
        this.logDebug('Frame monitoring instrumentation stopped');
    };
    return FrameMonitoringInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.FrameMonitoringInstrumentation = FrameMonitoringInstrumentation;
//# sourceMappingURL=instrumentation.js.map