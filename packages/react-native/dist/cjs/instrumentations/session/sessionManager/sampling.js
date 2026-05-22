"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSampled = isSampled;
var faro_core_1 = require("@grafana/faro-core");
function isSampled() {
    var sendAllSignals = 1;
    var sessionTracking = faro_core_1.faro.config.sessionTracking;
    var samplingRate = (sessionTracking === null || sessionTracking === void 0 ? void 0 : sessionTracking.sampling)
        ? sessionTracking.sampling.resolve({ meta: faro_core_1.faro.metas.value })
        : sendAllSignals;
    return Math.random() < samplingRate;
}
//# sourceMappingURL=sampling.js.map