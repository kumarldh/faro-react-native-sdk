import { SamplingDecision } from '@opentelemetry/sdk-trace-base';
import type { MetaSession } from '@grafana/faro-core';
/**
 * Get sampling decision based on session configuration
 *
 * If the session is sampled, traces will be collected.
 * If the session is not sampled, traces will be dropped.
 *
 * @param sessionMeta - Current Faro session meta
 * @returns OTEL sampling decision
 */
export declare function getSamplingDecision(sessionMeta?: MetaSession): SamplingDecision;
