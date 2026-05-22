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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartupInstrumentation = void 0;
var react_native_1 = require("react-native");
var faro_core_1 = require("@grafana/faro-core");
var FaroReactNativeModule = react_native_1.NativeModules.FaroReactNativeModule;
/**
 * Measures React Native app startup time for both cold and warm starts.
 *
 * Uses native OS APIs for cold start and AppState for warm start:
 * - iOS: sysctl() to query kernel for process start time
 * - Android: Process.getStartElapsedRealtime() from Android OS (API 24+)
 *
 * Implementation aligned with Faro Flutter SDK:
 * https://github.com/grafana/faro-flutter-sdk
 *
 * **Key Features**:
 * - ✅ NO AppDelegate/MainActivity setup required - OS tracks process start automatically!
 * - ✅ Cold start: appStartDuration from native, coldStart: 1
 * - ✅ Warm start: appStartDuration (time to first frame after resume), coldStart: 0
 *
 * **Metrics Captured** (matches Flutter SDK format):
 * - Cold start: `appStartDuration`, `coldStart: 1`
 * - Warm start: `appStartDuration`, `coldStart: 0`
 *
 * **Requirements**:
 * - iOS 13.4+ (any iOS that supports React Native)
 * - Android API 24+ (Android 7.0 Nougat, ~99% of devices as of 2025)
 *
 * @example
 * ```tsx
 * import { initializeFaro } from '@grafana/faro-react-native';
 *
 * initializeFaro({
 *   app: { name: 'my-app', version: '1.0.0' },
 *   url: 'https://your-collector.com',
 * });
 * ```
 * StartupInstrumentation is included by default via makeRNConfig.
 */
var StartupInstrumentation = /** @class */ (function (_super) {
    __extends(StartupInstrumentation, _super);
    function StartupInstrumentation(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.name = '@grafana/faro-react-native:instrumentation-startup';
        _this.version = faro_core_1.VERSION;
        /** 0 = came from background (warm start eligible), null = never backgrounded */
        _this.warmStartTimestamp = null;
        return _this;
    }
    StartupInstrumentation.prototype.initialize = function () {
        if (this.options.enabled === false) {
            return;
        }
        this.captureColdStartMetrics();
        this.setupWarmStartTracking();
    };
    /**
     * Captures cold start duration from native (process start to Faro init).
     * Matches Flutter SDK: appStartDuration + coldStart: 1
     */
    StartupInstrumentation.prototype.captureColdStartMetrics = function () {
        var _this = this;
        try {
            if (!(FaroReactNativeModule === null || FaroReactNativeModule === void 0 ? void 0 : FaroReactNativeModule.getAppStartDuration)) {
                this.logWarn('Native module not available. Startup instrumentation requires native module. ' +
                    'Run `cd ios && pod install` and rebuild the app.');
                return;
            }
            var appStartDuration = FaroReactNativeModule.getAppStartDuration();
            if (appStartDuration === 0) {
                this.logWarn('App startup duration is 0. This may indicate unsupported Android version (< API 24) ' +
                    'or an issue with the native module.');
                return;
            }
            var values_1 = {
                appStartDuration: appStartDuration,
                coldStart: 1,
            };
            setTimeout(function () {
                _this.api.pushMeasurement({ type: 'app_startup', values: values_1 }, { skipDedupe: true });
            }, 100);
            this.logInfo("Cold start metrics captured: ".concat(appStartDuration, "ms"));
        }
        catch (error) {
            this.logError('Failed to capture cold start metrics', error);
        }
    };
    /**
     * Tracks warm start: when app resumes from background, measures time to first frame.
     * Matches Flutter SDK: setWarmStart on resume, getWarmStart after postFrameCallback.
     */
    StartupInstrumentation.prototype.setupWarmStartTracking = function () {
        var _this = this;
        this.appStateSubscription = react_native_1.AppState.addEventListener('change', function (nextAppState) {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                _this.warmStartTimestamp = 0; // Sentinel: next 'active' is a warm start
            }
            else if (nextAppState === 'active' && _this.warmStartTimestamp === 0) {
                // Came from background: measure time from resume to first frame
                var resumeTimestamp_1 = Date.now();
                _this.warmStartTimestamp = null;
                requestAnimationFrame(function () {
                    var appStartDuration = Date.now() - resumeTimestamp_1;
                    if (appStartDuration > 0) {
                        _this.api.pushMeasurement({
                            type: 'app_startup',
                            values: { appStartDuration: appStartDuration, coldStart: 0 },
                        }, { skipDedupe: true });
                        _this.logInfo("Warm start metrics captured: ".concat(appStartDuration, "ms"));
                    }
                });
            }
        });
    };
    StartupInstrumentation.prototype.unpatch = function () {
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = undefined;
            this.warmStartTimestamp = null;
        }
    };
    return StartupInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.StartupInstrumentation = StartupInstrumentation;
//# sourceMappingURL=index.js.map