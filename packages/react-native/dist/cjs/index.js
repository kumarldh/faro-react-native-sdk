"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = exports.onNavigationStateChange = exports.getRouteName = exports.getCurrentRoute = exports.createNavigationStateChangeHandler = exports.useFaroNavigation = exports.ReactNativeNavigationIntegration = exports.setUserPersistence = exports.initializeUserPersistence = exports.getUserPersistence = exports.createUserPersistence = exports.setDataCollectionPolicy = exports.initializeDataCollectionPolicy = exports.getDataCollectionPolicy = exports.createDataCollectionPolicy = exports.OfflineTransport = exports.ConsoleTransport = exports.FetchTransport = exports.getSdkMeta = exports.getScreenMeta = exports.getPageMeta = exports.withFaroErrorBoundary = exports.FaroErrorBoundary = exports.notifyHttpRequestStart = exports.notifyHttpRequestEnd = exports.trackUserAction = exports.withFaroUserAction = exports.reactNativeLogArgsSerializer = exports.CrashReportingInstrumentation = exports.ANRInstrumentation = exports.FrameMonitoringInstrumentation = exports.StartupInstrumentation = exports.PerformanceInstrumentation = exports.XHRInstrumentation = exports.HttpInstrumentation = exports.UserActionInstrumentation = exports.AppStateInstrumentation = exports.ViewInstrumentation = exports.minimalSessionDeviceAttributes = exports.loadSessionDeviceAttributesForInit = exports.getSessionAttributes = exports.SessionInstrumentation = exports.ConsoleInstrumentation = exports.ErrorsInstrumentation = exports.ErrorMechanism = exports.getRNInstrumentations = exports.SamplingRate = exports.SamplingFunction = exports.faro = exports.initializeFaro = void 0;
exports.defaultLogLevel = exports.allLogLevels = exports.InternalLoggerLevel = void 0;
// Main entry point for @grafana/faro-react-native
// Apply PerformanceObserver polyfill first to prevent iOS bad_variant_access crash
var performanceObserverPolyfill_1 = require("./util/performanceObserverPolyfill");
(0, performanceObserverPolyfill_1.applyPerformanceObserverPolyfill)();
var initialize_1 = require("./initialize");
Object.defineProperty(exports, "initializeFaro", { enumerable: true, get: function () { return initialize_1.initializeFaro; } });
var faro_core_1 = require("@grafana/faro-core");
Object.defineProperty(exports, "faro", { enumerable: true, get: function () { return faro_core_1.faro; } });
// Export sampling (Flutter-style interface)
var sampling_1 = require("./config/sampling");
Object.defineProperty(exports, "SamplingFunction", { enumerable: true, get: function () { return sampling_1.SamplingFunction; } });
Object.defineProperty(exports, "SamplingRate", { enumerable: true, get: function () { return sampling_1.SamplingRate; } });
// Export instrumentation helpers
var getRNInstrumentations_1 = require("./config/getRNInstrumentations");
Object.defineProperty(exports, "getRNInstrumentations", { enumerable: true, get: function () { return getRNInstrumentations_1.getRNInstrumentations; } });
// Export instrumentations
var errors_1 = require("./instrumentations/errors");
Object.defineProperty(exports, "ErrorMechanism", { enumerable: true, get: function () { return errors_1.ErrorMechanism; } });
Object.defineProperty(exports, "ErrorsInstrumentation", { enumerable: true, get: function () { return errors_1.ErrorsInstrumentation; } });
var console_1 = require("./instrumentations/console");
Object.defineProperty(exports, "ConsoleInstrumentation", { enumerable: true, get: function () { return console_1.ConsoleInstrumentation; } });
var session_1 = require("./instrumentations/session");
Object.defineProperty(exports, "SessionInstrumentation", { enumerable: true, get: function () { return session_1.SessionInstrumentation; } });
var sessionAttributes_1 = require("./instrumentations/session/sessionAttributes");
Object.defineProperty(exports, "getSessionAttributes", { enumerable: true, get: function () { return sessionAttributes_1.getSessionAttributes; } });
Object.defineProperty(exports, "loadSessionDeviceAttributesForInit", { enumerable: true, get: function () { return sessionAttributes_1.loadSessionDeviceAttributesForInit; } });
Object.defineProperty(exports, "minimalSessionDeviceAttributes", { enumerable: true, get: function () { return sessionAttributes_1.minimalSessionDeviceAttributes; } });
var view_1 = require("./instrumentations/view");
Object.defineProperty(exports, "ViewInstrumentation", { enumerable: true, get: function () { return view_1.ViewInstrumentation; } });
var appState_1 = require("./instrumentations/appState");
Object.defineProperty(exports, "AppStateInstrumentation", { enumerable: true, get: function () { return appState_1.AppStateInstrumentation; } });
var userActions_1 = require("./instrumentations/userActions");
Object.defineProperty(exports, "UserActionInstrumentation", { enumerable: true, get: function () { return userActions_1.UserActionInstrumentation; } });
var http_1 = require("./instrumentations/http");
Object.defineProperty(exports, "HttpInstrumentation", { enumerable: true, get: function () { return http_1.HttpInstrumentation; } });
var xhr_1 = require("./instrumentations/xhr");
Object.defineProperty(exports, "XHRInstrumentation", { enumerable: true, get: function () { return xhr_1.XHRInstrumentation; } });
var performance_1 = require("./instrumentations/performance");
Object.defineProperty(exports, "PerformanceInstrumentation", { enumerable: true, get: function () { return performance_1.PerformanceInstrumentation; } });
var startup_1 = require("./instrumentations/startup");
Object.defineProperty(exports, "StartupInstrumentation", { enumerable: true, get: function () { return startup_1.StartupInstrumentation; } });
var frameMonitoring_1 = require("./instrumentations/frameMonitoring");
Object.defineProperty(exports, "FrameMonitoringInstrumentation", { enumerable: true, get: function () { return frameMonitoring_1.FrameMonitoringInstrumentation; } });
var anr_1 = require("./instrumentations/anr");
Object.defineProperty(exports, "ANRInstrumentation", { enumerable: true, get: function () { return anr_1.ANRInstrumentation; } });
var crashReporting_1 = require("./instrumentations/crashReporting");
Object.defineProperty(exports, "CrashReportingInstrumentation", { enumerable: true, get: function () { return crashReporting_1.CrashReportingInstrumentation; } });
// Export console utilities
var utils_1 = require("./instrumentations/console/utils");
Object.defineProperty(exports, "reactNativeLogArgsSerializer", { enumerable: true, get: function () { return utils_1.reactNativeLogArgsSerializer; } });
// Export user action helpers
var withFaroUserAction_1 = require("./instrumentations/userActions/withFaroUserAction");
Object.defineProperty(exports, "withFaroUserAction", { enumerable: true, get: function () { return withFaroUserAction_1.withFaroUserAction; } });
Object.defineProperty(exports, "trackUserAction", { enumerable: true, get: function () { return withFaroUserAction_1.trackUserAction; } });
var httpRequestMonitor_1 = require("./instrumentations/userActions/httpRequestMonitor");
Object.defineProperty(exports, "notifyHttpRequestEnd", { enumerable: true, get: function () { return httpRequestMonitor_1.notifyHttpRequestEnd; } });
Object.defineProperty(exports, "notifyHttpRequestStart", { enumerable: true, get: function () { return httpRequestMonitor_1.notifyHttpRequestStart; } });
// Export error boundary
var FaroErrorBoundary_1 = require("./errorBoundary/FaroErrorBoundary");
Object.defineProperty(exports, "FaroErrorBoundary", { enumerable: true, get: function () { return FaroErrorBoundary_1.FaroErrorBoundary; } });
var withFaroErrorBoundary_1 = require("./errorBoundary/withFaroErrorBoundary");
Object.defineProperty(exports, "withFaroErrorBoundary", { enumerable: true, get: function () { return withFaroErrorBoundary_1.withFaroErrorBoundary; } });
// Export metas
var page_1 = require("./metas/page");
Object.defineProperty(exports, "getPageMeta", { enumerable: true, get: function () { return page_1.getPageMeta; } });
var screen_1 = require("./metas/screen");
Object.defineProperty(exports, "getScreenMeta", { enumerable: true, get: function () { return screen_1.getScreenMeta; } });
var sdk_1 = require("./metas/sdk");
Object.defineProperty(exports, "getSdkMeta", { enumerable: true, get: function () { return sdk_1.getSdkMeta; } });
// Export transports
var fetch_1 = require("./transports/fetch");
Object.defineProperty(exports, "FetchTransport", { enumerable: true, get: function () { return fetch_1.FetchTransport; } });
var console_2 = require("./transports/console");
Object.defineProperty(exports, "ConsoleTransport", { enumerable: true, get: function () { return console_2.ConsoleTransport; } });
var offline_1 = require("./transports/offline");
Object.defineProperty(exports, "OfflineTransport", { enumerable: true, get: function () { return offline_1.OfflineTransport; } });
// Export data collection policy
var dataCollection_1 = require("./dataCollection");
Object.defineProperty(exports, "createDataCollectionPolicy", { enumerable: true, get: function () { return dataCollection_1.createDataCollectionPolicy; } });
Object.defineProperty(exports, "getDataCollectionPolicy", { enumerable: true, get: function () { return dataCollection_1.getDataCollectionPolicy; } });
Object.defineProperty(exports, "initializeDataCollectionPolicy", { enumerable: true, get: function () { return dataCollection_1.initializeDataCollectionPolicy; } });
Object.defineProperty(exports, "setDataCollectionPolicy", { enumerable: true, get: function () { return dataCollection_1.setDataCollectionPolicy; } });
// Export user persistence
var userPersistence_1 = require("./userPersistence");
Object.defineProperty(exports, "createUserPersistence", { enumerable: true, get: function () { return userPersistence_1.createUserPersistence; } });
Object.defineProperty(exports, "getUserPersistence", { enumerable: true, get: function () { return userPersistence_1.getUserPersistence; } });
Object.defineProperty(exports, "initializeUserPersistence", { enumerable: true, get: function () { return userPersistence_1.initializeUserPersistence; } });
Object.defineProperty(exports, "setUserPersistence", { enumerable: true, get: function () { return userPersistence_1.setUserPersistence; } });
// Export navigation utilities
var v6_1 = require("./navigation/v6");
Object.defineProperty(exports, "ReactNativeNavigationIntegration", { enumerable: true, get: function () { return v6_1.ReactNativeNavigationIntegration; } });
var navigation_1 = require("./navigation");
Object.defineProperty(exports, "useFaroNavigation", { enumerable: true, get: function () { return navigation_1.useFaroNavigation; } });
Object.defineProperty(exports, "createNavigationStateChangeHandler", { enumerable: true, get: function () { return navigation_1.createNavigationStateChangeHandler; } });
Object.defineProperty(exports, "getCurrentRoute", { enumerable: true, get: function () { return navigation_1.getCurrentRoute; } });
Object.defineProperty(exports, "getRouteName", { enumerable: true, get: function () { return navigation_1.getRouteName; } });
Object.defineProperty(exports, "onNavigationStateChange", { enumerable: true, get: function () { return navigation_1.onNavigationStateChange; } });
// Export LogLevel and InternalLoggerLevel from our local copy (avoid bundling faro-core's web code)
var internalLogger_1 = require("./internalLogger");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return internalLogger_1.LogLevel; } });
Object.defineProperty(exports, "InternalLoggerLevel", { enumerable: true, get: function () { return internalLogger_1.InternalLoggerLevel; } });
Object.defineProperty(exports, "allLogLevels", { enumerable: true, get: function () { return internalLogger_1.allLogLevels; } });
Object.defineProperty(exports, "defaultLogLevel", { enumerable: true, get: function () { return internalLogger_1.defaultLogLevel; } });
//# sourceMappingURL=index.js.map