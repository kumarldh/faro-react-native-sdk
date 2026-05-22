"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRNInstrumentations = getRNInstrumentations;
var react_native_1 = require("react-native");
var anr_1 = require("../instrumentations/anr");
var appState_1 = require("../instrumentations/appState");
var console_1 = require("../instrumentations/console");
var crashReporting_1 = require("../instrumentations/crashReporting");
var errors_1 = require("../instrumentations/errors");
var frameMonitoring_1 = require("../instrumentations/frameMonitoring");
var http_1 = require("../instrumentations/http");
var performance_1 = require("../instrumentations/performance");
var session_1 = require("../instrumentations/session");
var startup_1 = require("../instrumentations/startup");
var userActions_1 = require("../instrumentations/userActions");
var view_1 = require("../instrumentations/view");
var xhr_1 = require("../instrumentations/xhr");
/** Convert Patterns (string | RegExp)[] to RegExp[] for instrumentations that require RegExp[]. */
function toRegExpArray(patterns) {
    return patterns.map(function (p) { return (typeof p === 'string' ? new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) : p); });
}
/**
 * Returns the default set of instrumentations for React Native.
 *
 * Reads all options from the Faro config (single source of truth).
 * Property names are aligned with Flutter SDK FaroConfig:
 * - cpuUsageVitals, memoryUsageVitals, anrTracking, refreshRateVitals
 * - enableCrashReporting, enableErrorReporting
 * - fetchVitalsInterval, ignoreUrls
 *
 * @example
 * ```ts
 * const config: ReactNativeConfig = {
 *   app: { name: 'my-app', version: '1.0.0' },
 *   cpuUsageVitals: true,
 *   memoryUsageVitals: true,
 *   anrTracking: true,
 *   refreshRateVitals: true,
 *   enableCrashReporting: true,
 *   fetchVitalsInterval: 30000,
 *   instrumentations: getRNInstrumentations(config),
 * };
 * ```
 */
function getRNInstrumentations(config) {
    if (config === void 0) { config = {}; }
    // Aligned with Flutter SDK FaroConfig defaults
    var 
    // Error & crash tracking
    _a = config.enableErrorReporting, 
    // Error & crash tracking
    enableErrorReporting = _a === void 0 ? true : _a, _b = config.enableCrashReporting, enableCrashReporting = _b === void 0 ? false : _b, _c = config.anrTracking, anrTracking = _c === void 0 ? false : _c, _d = config.anrOptions, anrOptions = _d === void 0 ? {} : _d, 
    // Performance vitals
    _e = config.cpuUsageVitals, 
    // Performance vitals
    cpuUsageVitals = _e === void 0 ? true : _e, _f = config.memoryUsageVitals, memoryUsageVitals = _f === void 0 ? true : _f, _g = config.refreshRateVitals, refreshRateVitals = _g === void 0 ? false : _g, _h = config.fetchVitalsInterval, fetchVitalsInterval = _h === void 0 ? 30000 : _h, _j = config.frameMonitoringOptions, frameMonitoringOptions = _j === void 0 ? {} : _j, 
    // Network
    _k = config.ignoreUrls, 
    // Network
    ignoreUrls = _k === void 0 ? [] : _k, _l = config.enableHttpInstrumentation, enableHttpInstrumentation = _l === void 0 ? {} : _l, 
    // Console and user actions
    _m = config.enableConsoleCapture, 
    // Console and user actions
    enableConsoleCapture = _m === void 0 ? true : _m, _o = config.enableUserActions, enableUserActions = _o === void 0 ? true : _o, 
    // Tracing
    _p = config.enableTracing, 
    // Tracing
    enableTracing = _p === void 0 ? false : _p, _q = config.tracingOptions, tracingOptions = _q === void 0 ? {} : _q;
    var instrumentations = [];
    // Error reporting (Flutter: enableFlutterErrorReporting)
    if (enableErrorReporting) {
        instrumentations.push(new errors_1.ErrorsInstrumentation({
            releaseBundleFilename: config.releaseBundleFilename,
        }));
    }
    // Console capture - not in Flutter SDK, RN-specific
    if (enableConsoleCapture) {
        instrumentations.push(new console_1.ConsoleInstrumentation());
    }
    // Sessions - always enabled in Flutter, same here
    instrumentations.push(new session_1.SessionInstrumentation());
    // Views - always enabled in Flutter, same here
    instrumentations.push(new view_1.ViewInstrumentation());
    // App state - always enabled in Flutter, same here
    instrumentations.push(new appState_1.AppStateInstrumentation());
    // User actions - enabled by default, opt-out via enableUserActions
    if (enableUserActions) {
        instrumentations.push(new userActions_1.UserActionInstrumentation());
    }
    // HTTP/XHR tracking: when tracing is enabled, TracingInstrumentation patches fetch and XHR.
    // When tracing is disabled, add HttpInstrumentation and/or XHRInstrumentation per enableHttpInstrumentation.
    if (!enableTracing) {
        var _r = enableHttpInstrumentation.fetch, enableFetch = _r === void 0 ? true : _r, _s = enableHttpInstrumentation.xhr, enableXhr = _s === void 0 ? true : _s;
        var ignoredUrlsRegExp = toRegExpArray(ignoreUrls);
        if (enableFetch) {
            instrumentations.push(new http_1.HttpInstrumentation({ ignoredUrls: ignoredUrlsRegExp }));
        }
        if (enableXhr) {
            instrumentations.push(new xhr_1.XHRInstrumentation({ ignoredUrls: ignoredUrlsRegExp }));
        }
    }
    // Performance vitals (CPU/memory) - only add if at least one metric is enabled
    if (cpuUsageVitals || memoryUsageVitals) {
        var perfInstrumentation = new performance_1.PerformanceInstrumentation({
            memoryUsageVitals: memoryUsageVitals,
            cpuUsageVitals: cpuUsageVitals,
            fetchVitalsInterval: fetchVitalsInterval,
        });
        instrumentations.push(perfInstrumentation);
    }
    // Startup tracking - always enabled
    instrumentations.push(new startup_1.StartupInstrumentation());
    // Frame monitoring: enabled when refreshRateVitals is true
    // The instrumentation reads refreshRateVitals from faro.config (single source of truth)
    if (refreshRateVitals) {
        instrumentations.push(new frameMonitoring_1.FrameMonitoringInstrumentation(frameMonitoringOptions));
    }
    // ANR detection (Android only)
    if (anrTracking && react_native_1.Platform.OS === 'android') {
        instrumentations.push(new anr_1.ANRInstrumentation(anrOptions));
    }
    // Crash reporting
    if (enableCrashReporting) {
        instrumentations.push(new crashReporting_1.CrashReportingInstrumentation());
    }
    if (enableTracing) {
        try {
            var TracingInstrumentation = require('@grafana/faro-react-native-tracing').TracingInstrumentation;
            instrumentations.push(new TracingInstrumentation(tracingOptions));
        }
        catch (_t) {
            console.warn('[Faro] enableTracing is true but @grafana/faro-react-native-tracing is not installed. ' +
                'Add it to use tracing: yarn add @grafana/faro-react-native-tracing');
        }
    }
    return instrumentations;
}
//# sourceMappingURL=getRNInstrumentations.js.map