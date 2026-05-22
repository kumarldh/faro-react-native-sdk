"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSessionTrackingConfig = exports.MAX_SESSION_PERSISTENCE_TIME = exports.STORAGE_UPDATE_DELAY = exports.STORAGE_KEY = void 0;
exports.STORAGE_KEY = 'com.grafana.faro.session';
exports.STORAGE_UPDATE_DELAY = 1 * 1000; // 1 second
var DEFAULT_SESSION_PERSISTENCE_MS = 15 * 60 * 1000; // 15 minutes
exports.MAX_SESSION_PERSISTENCE_TIME = DEFAULT_SESSION_PERSISTENCE_MS;
/** React Native session defaults */
exports.defaultSessionTrackingConfig = {
    enabled: true,
    persistent: false,
    maxSessionPersistenceTime: exports.MAX_SESSION_PERSISTENCE_TIME,
};
//# sourceMappingURL=sessionConstants.js.map