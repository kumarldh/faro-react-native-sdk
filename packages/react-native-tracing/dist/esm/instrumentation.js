var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { context, propagation, trace } from '@opentelemetry/api';
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { defaultResource, resourceFromAttributes } from '@opentelemetry/resources';
import { BatchSpanProcessor, BasicTracerProvider as ReactNativeTracerProvider } from '@opentelemetry/sdk-trace-base';
import { StackContextManager } from '@opentelemetry/sdk-trace-web';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT, } from '@opentelemetry/semantic-conventions';
import { BaseInstrumentation, getInternalFaroFromGlobalObject, VERSION } from '@grafana/faro-core';
import { FaroTraceExporter } from './exporters/faroTraceExporter';
import { getReactNativeDevServerIgnoreUrls } from './instrumentations/devServerIgnoreUrls';
import { getDefaultOTELInstrumentations } from './instrumentations/getDefaultOTELInstrumentations';
import { FaroMetaAttributesSpanProcessor } from './processors/faroMetaAttributesSpanProcessor';
import { HttpRequestMonitorSpanProcessor } from './processors/httpRequestMonitorSpanProcessor';
import { ATTR_APP_VERSION, ATTR_DEPLOYMENT_ENVIRONMENT_NAME, ATTR_DEVICE_BRAND, ATTR_DEVICE_LOCALE, ATTR_DEVICE_MODEL, ATTR_DEVICE_OS_VERSION, ATTR_DEVICE_PLATFORM, ATTR_PROCESS_RUNTIME_NAME, ATTR_PROCESS_RUNTIME_VERSION, ATTR_SERVICE_NAMESPACE, ATTR_TELEMETRY_DISTRO_NAME, ATTR_TELEMETRY_DISTRO_VERSION, } from './semconv';
import { getSamplingDecision } from './utils/sampler';
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
export class TracingInstrumentation extends BaseInstrumentation {
    constructor(options = {}) {
        super();
        this.options = options;
        this.name = '@grafana/faro-react-native-tracing';
        this.version = VERSION;
    }
    initialize() {
        var _a, _b, _c, _d, _e, _f;
        const options = this.options;
        const attributes = {};
        // App attributes
        if (this.config.app.name) {
            attributes[ATTR_SERVICE_NAME] = this.config.app.name;
        }
        if (this.config.app.namespace) {
            attributes[ATTR_SERVICE_NAMESPACE] = this.config.app.namespace;
        }
        if (this.config.app.version) {
            attributes[ATTR_SERVICE_VERSION] = this.config.app.version;
            attributes[ATTR_APP_VERSION] = this.config.app.version;
        }
        if (this.config.app.environment) {
            attributes[ATTR_DEPLOYMENT_ENVIRONMENT_NAME] = this.config.app.environment;
            /**
             * @deprecated will be removed in the future and has been replaced by ATTR_DEPLOYMENT_ENVIRONMENT_NAME (deployment.environment.name)
             * We need to keep this for compatibility with some internal services for now.
             */
            attributes[SEMRESATTRS_DEPLOYMENT_ENVIRONMENT] = this.config.app.environment;
        }
        // Device/Platform attributes from React Native
        // Note: metas.value contains all meta providers, we need to check if device meta exists
        const allMetas = this.metas.value;
        const deviceMeta = allMetas['device'];
        if (deviceMeta === null || deviceMeta === void 0 ? void 0 : deviceMeta.model) {
            attributes[ATTR_DEVICE_MODEL] = deviceMeta.model;
        }
        if (deviceMeta === null || deviceMeta === void 0 ? void 0 : deviceMeta.brand) {
            attributes[ATTR_DEVICE_BRAND] = deviceMeta.brand;
        }
        if (deviceMeta === null || deviceMeta === void 0 ? void 0 : deviceMeta.osName) {
            attributes[ATTR_DEVICE_PLATFORM] = deviceMeta.osName;
        }
        if (deviceMeta === null || deviceMeta === void 0 ? void 0 : deviceMeta.osVersion) {
            attributes[ATTR_DEVICE_OS_VERSION] = deviceMeta.osVersion;
        }
        if (deviceMeta === null || deviceMeta === void 0 ? void 0 : deviceMeta.locale) {
            attributes[ATTR_DEVICE_LOCALE] = deviceMeta.locale;
        }
        attributes[ATTR_PROCESS_RUNTIME_NAME] = 'react-native';
        attributes[ATTR_PROCESS_RUNTIME_VERSION] = (_a = deviceMeta === null || deviceMeta === void 0 ? void 0 : deviceMeta.osVersion) !== null && _a !== void 0 ? _a : 'unknown';
        attributes[ATTR_TELEMETRY_DISTRO_NAME] = 'faro-react-native-sdk';
        attributes[ATTR_TELEMETRY_DISTRO_VERSION] = VERSION;
        // Merge with user-provided attributes
        Object.assign(attributes, options.resourceAttributes);
        const resource = defaultResource().merge(resourceFromAttributes(attributes));
        // Create tracer provider with span processors
        this.provider = new ReactNativeTracerProvider({
            resource,
            sampler: {
                shouldSample: () => {
                    return {
                        decision: getSamplingDecision(this.api.getSession()),
                    };
                },
            },
            spanProcessors: [
                (_b = options.spanProcessor) !== null && _b !== void 0 ? _b : new HttpRequestMonitorSpanProcessor(new FaroMetaAttributesSpanProcessor(new BatchSpanProcessor(new FaroTraceExporter({ api: this.api }), {
                    scheduledDelayMillis: TracingInstrumentation.SCHEDULED_BATCH_DELAY_MS,
                    maxExportBatchSize: 30,
                }), this.metas)),
            ],
        });
        // Register the provider as the global tracer provider
        // This is CRITICAL for the tracer to generate real trace IDs instead of all zeros
        trace.setGlobalTracerProvider(this.provider);
        // Register a global ContextManager. Without one, OTel falls back to the NoopContextManager,
        // which always returns ROOT_CONTEXT — so when `@opentelemetry/instrumentation-fetch` does
        // `context.with(setSpan(active(), createdSpan), () => _addHeaders(...))` the span set on the
        // wrapped context is invisible inside `_addHeaders` and `propagation.inject` writes nothing.
        // `StackContextManager` is pure JS (no DOM/Zone deps) and works in React Native.
        context.setGlobalContextManager((_c = options.contextManager) !== null && _c !== void 0 ? _c : new StackContextManager().enable());
        // Register the global text-map propagator. Without this, OTel falls back to a
        // NoopTextMapPropagator and `propagation.inject(...)` becomes a no-op, meaning
        // `traceparent` / `tracestate` (and `baggage`) headers are never written on the
        // outbound fetch/XHR — so the backend receives no context and starts a new trace.
        propagation.setGlobalPropagator((_d = options.propagator) !== null && _d !== void 0 ? _d : new CompositePropagator({
            propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()],
        }));
        const { enableFetchInstrumentation, enableXhrInstrumentation, propagateTraceHeaderCorsUrls, fetchInstrumentationOptions, xhrInstrumentationOptions, } = (_e = this.options.instrumentationOptions) !== null && _e !== void 0 ? _e : {};
        // Get ignore URLs from transports to prevent infinite loops
        const ignoreUrls = this.getIgnoreUrls();
        // Register instrumentations
        registerInstrumentations({
            instrumentations: (_f = options.instrumentations) !== null && _f !== void 0 ? _f : getDefaultOTELInstrumentations({
                ignoreUrls,
                enableFetchInstrumentation,
                enableXhrInstrumentation,
                propagateTraceHeaderCorsUrls,
                fetchInstrumentationOptions,
                xhrInstrumentationOptions,
            }),
        });
        // Expose OTEL API on the global Faro instance for manual span creation
        // This allows users to access trace and context APIs via faro.otel
        const globalFaroInstance = getInternalFaroFromGlobalObject();
        if (globalFaroInstance) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Extending Faro instance with OTEL API
            globalFaroInstance.otel = {
                trace,
                context,
            };
        }
    }
    /**
     * Get ignore URLs from all transports to avoid tracing collector requests
     * CRITICAL: This prevents infinite loops where trace exports trigger more traces
     */
    getIgnoreUrls() {
        // Get URLs from transports' getIgnoreUrls() method
        const transportUrls = this.transports.transports.flatMap((transport) => {
            return transport.getIgnoreUrls();
        });
        // Create regex patterns that match both with and without trailing slashes
        // This is critical because fetch() might add trailing slashes
        const regexPatterns = transportUrls.map((url) => {
            if (typeof url === 'string') {
                // Escape special regex characters and make trailing slash optional
                const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                return new RegExp(`^${escapedUrl}/?$`);
            }
            return url;
        });
        // Return dev-server, original transport URLs, and regex patterns for maximum coverage.
        return [...getReactNativeDevServerIgnoreUrls(), ...transportUrls, ...regexPatterns];
    }
    /**
     * Shutdown the tracer provider
     */
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.provider) {
                yield this.provider.shutdown();
            }
        });
    }
}
TracingInstrumentation.SCHEDULED_BATCH_DELAY_MS = 1000;
//# sourceMappingURL=instrumentation.js.map