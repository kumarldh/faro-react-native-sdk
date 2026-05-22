"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRNConfig = makeRNConfig;
var faro_core_1 = require("@grafana/faro-core");
var stackTraceParser_1 = require("../instrumentations/errors/stackTraceParser");
var sessionConstants_1 = require("../instrumentations/session/sessionManager/sessionConstants");
var internalLogger_1 = require("../internalLogger");
var page_1 = require("../metas/page");
var screen_1 = require("../metas/screen");
var sdk_1 = require("../metas/sdk");
var console_1 = require("../transports/console");
var fetch_1 = require("../transports/fetch");
var offline_1 = require("../transports/offline");
var getRNInstrumentations_1 = require("./getRNInstrumentations");
var DEFAULT_OFFLINE_CACHE_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
/**
 * Builds transports. FetchTransport is always added when url is provided.
 * User can enable offline and console via enableTransports.
 */
function buildTransports(config) {
    var _a;
    var _b = config.enableTransports, enableTransports = _b === void 0 ? { offline: false, console: false } : _b;
    if (!config.url) {
        throw new Error('url is required. Provide the Faro collector URL.');
    }
    var builtTransports = [];
    if (enableTransports.offline) {
        builtTransports.push(new offline_1.OfflineTransport({
            maxCacheDurationMs: DEFAULT_OFFLINE_CACHE_MS,
        }));
    }
    builtTransports.push(new fetch_1.FetchTransport({
        url: config.url,
        apiKey: config.apiKey,
    }));
    if (enableTransports.console) {
        builtTransports.push(new console_1.ConsoleTransport({ level: internalLogger_1.LogLevel.DEBUG }));
    }
    var extraTransports = (_a = config.transports) !== null && _a !== void 0 ? _a : [];
    return __spreadArray(__spreadArray([], builtTransports, true), extraTransports, true);
}
/**
 * Builds instrumentations from config flags.
 */
function buildInstrumentations(config) {
    var _a;
    var baseInstrumentations = (0, getRNInstrumentations_1.getRNInstrumentations)(config);
    var extraInstrumentations = (_a = config.instrumentations) !== null && _a !== void 0 ? _a : [];
    return __spreadArray(__spreadArray([], baseInstrumentations, true), extraInstrumentations, true);
}
/**
 * React Native stacktrace parser. Uses getStackFramesFromError for RN-specific formats.
 */
function createParseStacktrace(releaseBundleFilename) {
    return function (err) { return ({
        frames: (0, stackTraceParser_1.getStackFramesFromError)(err, { releaseBundleFilename: releaseBundleFilename }),
    }); };
}
/**
 * Creates a full Faro config from React Native flag-based config.
 *
 * Based on flags, builds instrumentations and transports automatically.
 * Client just enables what they need; makeRNConfig does the rest.
 *
 * @param preloadedSessionDeviceAttributes Device/session fields for session meta (passed from async `initializeFaro`).
 */
function makeRNConfig(config, preloadedSessionDeviceAttributes) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var defaultMetas = [(0, sdk_1.getSdkMeta)(), (0, page_1.getPageMeta)(), (0, screen_1.getScreenMeta)()];
    var customMetas = (_a = config.metas) !== null && _a !== void 0 ? _a : [];
    var transports = buildTransports(config);
    var instrumentations = buildInstrumentations(config);
    var releaseBundleFilename = config.releaseBundleFilename;
    return __assign(__assign({ app: config.app }, (preloadedSessionDeviceAttributes != null && {
        preloadedSessionDeviceAttributes: preloadedSessionDeviceAttributes,
    })), { dedupe: (_b = config.dedupe) !== null && _b !== void 0 ? _b : true, globalObjectKey: (_c = config.globalObjectKey) !== null && _c !== void 0 ? _c : faro_core_1.defaultGlobalObjectKey, internalLoggerLevel: (_d = config.internalLoggerLevel) !== null && _d !== void 0 ? _d : internalLogger_1.InternalLoggerLevel.ERROR, isolate: (_e = config.isolate) !== null && _e !== void 0 ? _e : false, parseStacktrace: (_f = config.parseStacktrace) !== null && _f !== void 0 ? _f : createParseStacktrace(releaseBundleFilename), paused: (_g = config.paused) !== null && _g !== void 0 ? _g : false, preventGlobalExposure: (_h = config.preventGlobalExposure) !== null && _h !== void 0 ? _h : false, unpatchedConsole: (_j = config.unpatchedConsole) !== null && _j !== void 0 ? _j : faro_core_1.defaultUnpatchedConsole, batching: {
            enabled: false,
            sendTimeout: 250,
            itemLimit: 50,
        }, sessionTracking: __assign(__assign({}, sessionConstants_1.defaultSessionTrackingConfig), config.sessionTracking), metas: __spreadArray(__spreadArray([], defaultMetas, true), customMetas, true), instrumentations: instrumentations, transports: transports, ignoreUrls: (_k = config.ignoreUrls) !== null && _k !== void 0 ? _k : [], ignoreErrors: config.ignoreErrors, beforeSend: config.beforeSend, preserveOriginalError: config.preserveOriginalError, userActionsInstrumentation: config.userActionsOptions, consoleInstrumentation: config.consoleCaptureOptions });
}
//# sourceMappingURL=makeRNConfig.js.map