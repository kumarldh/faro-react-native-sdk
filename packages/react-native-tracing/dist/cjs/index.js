"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaroMetaAttributesSpanProcessor = exports.fetchCustomAttributeFunctionWithDefaults = exports.setSpanStatusOnFetchError = exports.getSamplingDecision = exports.TracingInstrumentation = exports.getDefaultOTELInstrumentations = exports.FaroTraceExporter = void 0;
var faroTraceExporter_1 = require("./exporters/faroTraceExporter");
Object.defineProperty(exports, "FaroTraceExporter", { enumerable: true, get: function () { return faroTraceExporter_1.FaroTraceExporter; } });
var getDefaultOTELInstrumentations_1 = require("./instrumentations/getDefaultOTELInstrumentations");
Object.defineProperty(exports, "getDefaultOTELInstrumentations", { enumerable: true, get: function () { return getDefaultOTELInstrumentations_1.getDefaultOTELInstrumentations; } });
var instrumentation_1 = require("./instrumentation");
Object.defineProperty(exports, "TracingInstrumentation", { enumerable: true, get: function () { return instrumentation_1.TracingInstrumentation; } });
var sampler_1 = require("./utils/sampler");
Object.defineProperty(exports, "getSamplingDecision", { enumerable: true, get: function () { return sampler_1.getSamplingDecision; } });
var instrumentationUtils_1 = require("./instrumentations/instrumentationUtils");
Object.defineProperty(exports, "setSpanStatusOnFetchError", { enumerable: true, get: function () { return instrumentationUtils_1.setSpanStatusOnFetchError; } });
Object.defineProperty(exports, "fetchCustomAttributeFunctionWithDefaults", { enumerable: true, get: function () { return instrumentationUtils_1.fetchCustomAttributeFunctionWithDefaults; } });
var faroMetaAttributesSpanProcessor_1 = require("./processors/faroMetaAttributesSpanProcessor");
Object.defineProperty(exports, "FaroMetaAttributesSpanProcessor", { enumerable: true, get: function () { return faroMetaAttributesSpanProcessor_1.FaroMetaAttributesSpanProcessor; } });
//# sourceMappingURL=index.js.map