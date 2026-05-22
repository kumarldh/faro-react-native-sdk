"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSamplingDecision = getSamplingDecision;
var sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
/**
 * Get sampling decision based on session configuration
 *
 * If the session is sampled, traces will be collected.
 * If the session is not sampled, traces will be dropped.
 *
 * @param sessionMeta - Current Faro session meta
 * @returns OTEL sampling decision
 */
function getSamplingDecision(sessionMeta) {
    var _a;
    if (sessionMeta === void 0) { sessionMeta = {}; }
    var isSessionSampled = ((_a = sessionMeta.attributes) === null || _a === void 0 ? void 0 : _a['isSampled']) === 'true';
    var samplingDecision = isSessionSampled ? sdk_trace_base_1.SamplingDecision.RECORD_AND_SAMPLED : sdk_trace_base_1.SamplingDecision.NOT_RECORD;
    return samplingDecision;
}
//# sourceMappingURL=sampler.js.map