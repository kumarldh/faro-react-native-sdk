"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionManagerByConfig = getSessionManagerByConfig;
var MmkvPersistentSessionsManager_1 = require("./MmkvPersistentSessionsManager");
var VolatileSessionManager_1 = require("./VolatileSessionManager");
function getSessionManagerByConfig(sessionTrackingConfig) {
    if (!sessionTrackingConfig.persistent) {
        return VolatileSessionManager_1.VolatileSessionsManager;
    }
    return MmkvPersistentSessionsManager_1.MmkvPersistentSessionsManager;
}
//# sourceMappingURL=getSessionManagerByConfig.js.map