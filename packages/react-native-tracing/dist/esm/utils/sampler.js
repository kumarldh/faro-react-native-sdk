import { SamplingDecision } from '@opentelemetry/sdk-trace-base';
/**
 * Get sampling decision based on session configuration
 *
 * If the session is sampled, traces will be collected.
 * If the session is not sampled, traces will be dropped.
 *
 * @param sessionMeta - Current Faro session meta
 * @returns OTEL sampling decision
 */
export function getSamplingDecision(sessionMeta = {}) {
    var _a;
    const isSessionSampled = ((_a = sessionMeta.attributes) === null || _a === void 0 ? void 0 : _a['isSampled']) === 'true';
    const samplingDecision = isSessionSampled ? SamplingDecision.RECORD_AND_SAMPLED : SamplingDecision.NOT_RECORD;
    return samplingDecision;
}
//# sourceMappingURL=sampler.js.map