import { defaultGlobalObjectKey, defaultUnpatchedConsole } from '@grafana/faro-core';
import { getStackFramesFromError } from '../instrumentations/errors/stackTraceParser';
import { defaultSessionTrackingConfig } from '../instrumentations/session/sessionManager/sessionConstants';
import { InternalLoggerLevel, LogLevel } from '../internalLogger';
import { getPageMeta } from '../metas/page';
import { getScreenMeta } from '../metas/screen';
import { getSdkMeta } from '../metas/sdk';
import { ConsoleTransport } from '../transports/console';
import { FetchTransport } from '../transports/fetch';
import { OfflineTransport } from '../transports/offline';
import { getRNInstrumentations } from './getRNInstrumentations';
const DEFAULT_OFFLINE_CACHE_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
/**
 * Builds transports. FetchTransport is always added when url is provided.
 * User can enable offline and console via enableTransports.
 */
function buildTransports(config) {
    var _a;
    const { enableTransports = { offline: false, console: false } } = config;
    if (!config.url) {
        throw new Error('url is required. Provide the Faro collector URL.');
    }
    const builtTransports = [];
    if (enableTransports.offline) {
        builtTransports.push(new OfflineTransport({
            maxCacheDurationMs: DEFAULT_OFFLINE_CACHE_MS,
        }));
    }
    builtTransports.push(new FetchTransport({
        url: config.url,
        apiKey: config.apiKey,
    }));
    if (enableTransports.console) {
        builtTransports.push(new ConsoleTransport({ level: LogLevel.DEBUG }));
    }
    const extraTransports = (_a = config.transports) !== null && _a !== void 0 ? _a : [];
    return [...builtTransports, ...extraTransports];
}
/**
 * Builds instrumentations from config flags.
 */
function buildInstrumentations(config) {
    var _a;
    const baseInstrumentations = getRNInstrumentations(config);
    const extraInstrumentations = (_a = config.instrumentations) !== null && _a !== void 0 ? _a : [];
    return [...baseInstrumentations, ...extraInstrumentations];
}
/**
 * React Native stacktrace parser. Uses getStackFramesFromError for RN-specific formats.
 */
function createParseStacktrace(releaseBundleFilename) {
    return (err) => ({
        frames: getStackFramesFromError(err, { releaseBundleFilename }),
    });
}
/**
 * Creates a full Faro config from React Native flag-based config.
 *
 * Based on flags, builds instrumentations and transports automatically.
 * Client just enables what they need; makeRNConfig does the rest.
 *
 * @param preloadedSessionDeviceAttributes Device/session fields for session meta (passed from async `initializeFaro`).
 */
export function makeRNConfig(config, preloadedSessionDeviceAttributes) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const defaultMetas = [getSdkMeta(), getPageMeta(), getScreenMeta()];
    const customMetas = (_a = config.metas) !== null && _a !== void 0 ? _a : [];
    const transports = buildTransports(config);
    const instrumentations = buildInstrumentations(config);
    const releaseBundleFilename = config.releaseBundleFilename;
    return Object.assign(Object.assign({ app: config.app }, (preloadedSessionDeviceAttributes != null && {
        preloadedSessionDeviceAttributes,
    })), { dedupe: (_b = config.dedupe) !== null && _b !== void 0 ? _b : true, globalObjectKey: (_c = config.globalObjectKey) !== null && _c !== void 0 ? _c : defaultGlobalObjectKey, internalLoggerLevel: (_d = config.internalLoggerLevel) !== null && _d !== void 0 ? _d : InternalLoggerLevel.ERROR, isolate: (_e = config.isolate) !== null && _e !== void 0 ? _e : false, parseStacktrace: (_f = config.parseStacktrace) !== null && _f !== void 0 ? _f : createParseStacktrace(releaseBundleFilename), paused: (_g = config.paused) !== null && _g !== void 0 ? _g : false, preventGlobalExposure: (_h = config.preventGlobalExposure) !== null && _h !== void 0 ? _h : false, unpatchedConsole: (_j = config.unpatchedConsole) !== null && _j !== void 0 ? _j : defaultUnpatchedConsole, batching: {
            enabled: false,
            sendTimeout: 250,
            itemLimit: 50,
        }, sessionTracking: Object.assign(Object.assign({}, defaultSessionTrackingConfig), config.sessionTracking), metas: [...defaultMetas, ...customMetas], instrumentations,
        transports, ignoreUrls: (_k = config.ignoreUrls) !== null && _k !== void 0 ? _k : [], ignoreErrors: config.ignoreErrors, beforeSend: config.beforeSend, preserveOriginalError: config.preserveOriginalError, userActionsInstrumentation: config.userActionsOptions, consoleInstrumentation: config.consoleCaptureOptions });
}
//# sourceMappingURL=makeRNConfig.js.map