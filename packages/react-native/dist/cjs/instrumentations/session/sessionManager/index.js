"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolatileSessionsManager = exports.isSampled = exports.MmkvPersistentSessionsManager = exports.getSessionManagerByConfig = void 0;
var getSessionManagerByConfig_1 = require("./getSessionManagerByConfig");
Object.defineProperty(exports, "getSessionManagerByConfig", { enumerable: true, get: function () { return getSessionManagerByConfig_1.getSessionManagerByConfig; } });
var MmkvPersistentSessionsManager_1 = require("./MmkvPersistentSessionsManager");
Object.defineProperty(exports, "MmkvPersistentSessionsManager", { enumerable: true, get: function () { return MmkvPersistentSessionsManager_1.MmkvPersistentSessionsManager; } });
var sampling_1 = require("./sampling");
Object.defineProperty(exports, "isSampled", { enumerable: true, get: function () { return sampling_1.isSampled; } });
__exportStar(require("./sessionConstants"), exports);
__exportStar(require("./sessionManagerUtils"), exports);
__exportStar(require("./types"), exports);
var VolatileSessionManager_1 = require("./VolatileSessionManager");
Object.defineProperty(exports, "VolatileSessionsManager", { enumerable: true, get: function () { return VolatileSessionManager_1.VolatileSessionsManager; } });
//# sourceMappingURL=index.js.map