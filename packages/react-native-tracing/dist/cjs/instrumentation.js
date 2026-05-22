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
exports.TracingInstrumentation = void 0;
var api_1 = require("@opentelemetry/api");
var core_1 = require("@opentelemetry/core");
var instrumentation_1 = require("@opentelemetry/instrumentation");
var resources_1 = require("@opentelemetry/resources");
var sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
var sdk_trace_web_1 = require("@opentelemetry/sdk-trace-web");
var semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
var faro_core_1 = require("@grafana/faro-core");
var faroTraceExporter_1 = require("./exporters/faroTraceExporter");
var devServerIgnoreUrls_1 = require("./instrumentations/devServerIgnoreUrls");
var getDefaultOTELInstrumentations_1 = require("./instrumentations/getDefaultOTELInstrumentations");
var faroMetaAttributesSpanProcessor_1 = require("./processors/faroMetaAttributesSpanProcessor");
var httpRequestMonitorSpanProcessor_1 = require("./processors/httpRequestMonitorSpanProcessor");
var semconv_1 = require("./semconv");
var sampler_1 = require("./utils/sampler");
// Import React Native TracerProvider
// Note: We use the base provider since React Native doesn't have a specific one
/**
 * TracingInstrumentation for React Native
 *
 * Enables distributed tracing with OpenTelemetry for React Native applications.
 *
 * IMPORTANT: Infinite loop prevention
 * - Uses internalLogger for debugging instead of console
 * - Collector URLs are added to ignoreUrls in HTTP instrumentation
 * - BatchSpanProcessor delays span export to avoid blocking
 * - No console logging during trace export
 *
 * Example usage:
 * ```ts
 * import { initializeFaro } from '@grafana/faro-react-native';
 * import { TracingInstrumentation } from '@grafana/faro-react-native-tracing';
 *
 * initializeFaro({
 *   // ... other config
 *   instrumentations: [
 *     new TracingInstrumentation({
 *       propagateTraceHeaderCorsUrls: [/https:\\/\\/my-api\\.com/],
 *     }),
 *   ],
 * });
 * ```
 */
var TracingInstrumentation = /** @class */ (function (_super) {
    __extends(TracingInstrumentation, _super);
    function TracingInstrumentation(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.name = '@grafana/faro-react-native-tracing';
        _this.version = faro_core_1.VERSION;
        return _this;
    }
    TracingInstrumentation.prototype.initialize = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        var options = this.options;
        var attributes = {};
        // App attributes
        if (this.config.app.name) {
            attributes[semantic_conventions_1.ATTR_SERVICE_NAME] = this.config.app.name;
        }
        if (this.config.app.namespace) {
            attributes[semconv_1.ATTR_SERVICE_NAMESPACE] = this.config.app.namespace;
        }
        if (this.config.app.version) {
            attributes[semantic_conventions_1.ATTR_SERVICE_VERSION] = this.config.app.version;
            attributes[semconv_1.ATTR_APP_VERSION] = this.config.app.version;
        }
        if (this.config.app.environment) {
            attributes[semconv_1.ATTR_DEPLOYMENT_ENVIRONMENT_NAME] = this.config.app.environment;
            /**
             * @deprecated will be removed in the future and has been replaced by ATTR_DEPLOYMENT_ENVIRONMENT_NAME (deployment.environment.name)
             * We need to keep this for compatibility with some internal services for now.
             */
            attributes[semantic_conventions_1.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT] = this.config.app.environment;
        }
        // Device/Platform attributes from React Native
        // Note: metas.value contains all meta providers, we need to check if device meta exists
        var allMetas = this.metas.value;
        var deviceMeta = allMetas['device'];
        if (deviceMeta === null || deviceMeta === void 0 ? void 0 : deviceMeta.model) {
            attributes[semconv_1.ATTR_DEVICE_MODEL] = deviceMeta.model;
        }
        if (deviceMeta === null || deviceMeta === void 0 ? void 0 : deviceMeta.brand) {
            attributes[semconv_1.ATTR_DEVICE_BRAND] = deviceMeta.brand;
        }
        if (deviceMeta === null || deviceMeta === void 0 ? void 0 : deviceMeta.osName) {
            attributes[semconv_1.ATTR_DEVICE_PLATFORM] = deviceMeta.osName;
        }
        if (deviceMeta === null || deviceMeta === void 0 ? void 0 : deviceMeta.osVersion) {
            attributes[semconv_1.ATTR_DEVICE_OS_VERSION] = deviceMeta.osVersion;
        }
        if (deviceMeta === null || deviceMeta === void 0 ? void 0 : deviceMeta.locale) {
            attributes[semconv_1.ATTR_DEVICE_LOCALE] = deviceMeta.locale;
        }
        attributes[semconv_1.ATTR_PROCESS_RUNTIME_NAME] = 'react-native';
        attributes[semconv_1.ATTR_PROCESS_RUNTIME_VERSION] = (_a = deviceMeta === null || deviceMeta === void 0 ? void 0 : deviceMeta.osVersion) !== null && _a !== void 0 ? _a : 'unknown';
        attributes[semconv_1.ATTR_TELEMETRY_DISTRO_NAME] = 'faro-react-native-sdk';
        attributes[semconv_1.ATTR_TELEMETRY_DISTRO_VERSION] = faro_core_1.VERSION;
        // Merge with user-provided attributes
        Object.assign(attributes, options.resourceAttributes);
        var resource = (0, resources_1.defaultResource)().merge((0, resources_1.resourceFromAttributes)(attributes));
        // Create tracer provider with span processors
        this.provider = new sdk_trace_base_1.BasicTracerProvider({
            resource: resource,
            sampler: {
                shouldSample: function () {
                    return {
                        decision: (0, sampler_1.getSamplingDecision)(_this.api.getSession()),
                    };
                },
            },
            spanProcessors: [
                (_b = options.spanProcessor) !== null && _b !== void 0 ? _b : new httpRequestMonitorSpanProcessor_1.HttpRequestMonitorSpanProcessor(new faroMetaAttributesSpanProcessor_1.FaroMetaAttributesSpanProcessor(new sdk_trace_base_1.BatchSpanProcessor(new faroTraceExporter_1.FaroTraceExporter({ api: this.api }), {
                    scheduledDelayMillis: TracingInstrumentation.SCHEDULED_BATCH_DELAY_MS,
                    maxExportBatchSize: 30,
                }), this.metas)),
            ],
        });
        // Register the provider as the global tracer provider
        // This is CRITICAL for the tracer to generate real trace IDs instead of all zeros
        api_1.trace.setGlobalTracerProvider(this.provider);
        // Register a global ContextManager. Without one, OTel falls back to the NoopContextManager,
        // which always returns ROOT_CONTEXT — so when `@opentelemetry/instrumentation-fetch` does
        // `context.with(setSpan(active(), createdSpan), () => _addHeaders(...))` the span set on the
        // wrapped context is invisible inside `_addHeaders` and `propagation.inject` writes nothing.
        // `StackContextManager` is pure JS (no DOM/Zone deps) and works in React Native.
        api_1.context.setGlobalContextManager((_c = options.contextManager) !== null && _c !== void 0 ? _c : new sdk_trace_web_1.StackContextManager().enable());
        // Register the global text-map propagator. Without this, OTel falls back to a
        // NoopTextMapPropagator and `propagation.inject(...)` becomes a no-op, meaning
        // `traceparent` / `tracestate` (and `baggage`) headers are never written on the
        // outbound fetch/XHR — so the backend receives no context and starts a new trace.
        api_1.propagation.setGlobalPropagator((_d = options.propagator) !== null && _d !== void 0 ? _d : new core_1.CompositePropagator({
            propagators: [new core_1.W3CTraceContextPropagator(), new core_1.W3CBaggagePropagator()],
        }));
        var _g = (_e = this.options.instrumentationOptions) !== null && _e !== void 0 ? _e : {}, enableFetchInstrumentation = _g.enableFetchInstrumentation, enableXhrInstrumentation = _g.enableXhrInstrumentation, propagateTraceHeaderCorsUrls = _g.propagateTraceHeaderCorsUrls, fetchInstrumentationOptions = _g.fetchInstrumentationOptions, xhrInstrumentationOptions = _g.xhrInstrumentationOptions;
        // Get ignore URLs from transports to prevent infinite loops
        var ignoreUrls = this.getIgnoreUrls();
        // Register instrumentations
        (0, instrumentation_1.registerInstrumentations)({
            instrumentations: (_f = options.instrumentations) !== null && _f !== void 0 ? _f : (0, getDefaultOTELInstrumentations_1.getDefaultOTELInstrumentations)({
                ignoreUrls: ignoreUrls,
                enableFetchInstrumentation: enableFetchInstrumentation,
                enableXhrInstrumentation: enableXhrInstrumentation,
                propagateTraceHeaderCorsUrls: propagateTraceHeaderCorsUrls,
                fetchInstrumentationOptions: fetchInstrumentationOptions,
                xhrInstrumentationOptions: xhrInstrumentationOptions,
            }),
        });
        // Expose OTEL API on the global Faro instance for manual span creation
        // This allows users to access trace and context APIs via faro.otel
        var globalFaroInstance = (0, faro_core_1.getInternalFaroFromGlobalObject)();
        if (globalFaroInstance) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Extending Faro instance with OTEL API
            globalFaroInstance.otel = {
                trace: api_1.trace,
                context: api_1.context,
            };
        }
    };
    /**
     * Get ignore URLs from all transports to avoid tracing collector requests
     * CRITICAL: This prevents infinite loops where trace exports trigger more traces
     */
    TracingInstrumentation.prototype.getIgnoreUrls = function () {
        // Get URLs from transports' getIgnoreUrls() method
        var transportUrls = this.transports.transports.flatMap(function (transport) {
            return transport.getIgnoreUrls();
        });
        // Create regex patterns that match both with and without trailing slashes
        // This is critical because fetch() might add trailing slashes
        var regexPatterns = transportUrls.map(function (url) {
            if (typeof url === 'string') {
                // Escape special regex characters and make trailing slash optional
                var escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                return new RegExp("^".concat(escapedUrl, "/?$"));
            }
            return url;
        });
        // Return dev-server, original transport URLs, and regex patterns for maximum coverage.
        return __spreadArray(__spreadArray(__spreadArray([], (0, devServerIgnoreUrls_1.getReactNativeDevServerIgnoreUrls)(), true), transportUrls, true), regexPatterns, true);
    };
    /**
     * Shutdown the tracer provider
     */
    TracingInstrumentation.prototype.shutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.provider) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.provider.shutdown()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    TracingInstrumentation.SCHEDULED_BATCH_DELAY_MS = 1000;
    return TracingInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.TracingInstrumentation = TracingInstrumentation;
//# sourceMappingURL=instrumentation.js.map