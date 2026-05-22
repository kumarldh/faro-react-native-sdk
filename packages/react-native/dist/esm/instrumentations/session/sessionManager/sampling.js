import { faro } from '@grafana/faro-core';
export function isSampled() {
    const sendAllSignals = 1;
    const sessionTracking = faro.config.sessionTracking;
    const samplingRate = (sessionTracking === null || sessionTracking === void 0 ? void 0 : sessionTracking.sampling)
        ? sessionTracking.sampling.resolve({ meta: faro.metas.value })
        : sendAllSignals;
    return Math.random() < samplingRate;
}
//# sourceMappingURL=sampling.js.map