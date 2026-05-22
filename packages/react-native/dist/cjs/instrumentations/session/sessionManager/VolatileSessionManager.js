"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolatileSessionsManager = void 0;
var react_native_1 = require("react-native");
var faro_core_1 = require("@grafana/faro-core");
var throttle_1 = require("../../../utils/throttle");
var sessionConstants_1 = require("./sessionConstants");
var sessionManagerUtils_1 = require("./sessionManagerUtils");
var VolatileSessionsManager = /** @class */ (function () {
    function VolatileSessionsManager() {
        var _this = this;
        this.appStateSubscription = null;
        this.metaUnsubscribe = null;
        this.updateSession = (0, throttle_1.throttle)(function () { return _this.updateUserSession(); }, sessionConstants_1.STORAGE_UPDATE_DELAY);
        this.handleAppStateChange = function (nextAppState) {
            if (nextAppState === 'active') {
                _this.updateSession();
            }
        };
        this.updateUserSession = (0, sessionManagerUtils_1.getUserSessionUpdater)({
            fetchUserSession: VolatileSessionsManager.fetchUserSession,
            storeUserSession: VolatileSessionsManager.storeUserSession,
        });
        this.init();
    }
    VolatileSessionsManager.removeUserSession = function () {
        VolatileSessionsManager.volatileStorage = null;
    };
    VolatileSessionsManager.storeUserSession = function (session) {
        VolatileSessionsManager.volatileStorage = session;
    };
    VolatileSessionsManager.fetchUserSession = function () {
        return VolatileSessionsManager.volatileStorage;
    };
    VolatileSessionsManager.prototype.init = function () {
        // Listen to app state changes (equivalent to visibilitychange in web)
        this.appStateSubscription = react_native_1.AppState.addEventListener('change', this.handleAppStateChange);
        // Users can call the setSession() method, so we need to sync this with the in-memory session
        var unsubscribe = faro_core_1.faro.metas.addListener((0, sessionManagerUtils_1.getSessionMetaUpdateHandler)({
            fetchUserSession: VolatileSessionsManager.fetchUserSession,
            storeUserSession: VolatileSessionsManager.storeUserSession,
        }));
        this.metaUnsubscribe = typeof unsubscribe === 'function' ? unsubscribe : null;
    };
    /**
     * Clean up listeners when the instrumentation is unpatched
     */
    VolatileSessionsManager.prototype.unpatch = function () {
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }
        if (this.metaUnsubscribe) {
            this.metaUnsubscribe();
            this.metaUnsubscribe = null;
        }
    };
    VolatileSessionsManager.volatileStorage = null;
    return VolatileSessionsManager;
}());
exports.VolatileSessionsManager = VolatileSessionsManager;
//# sourceMappingURL=VolatileSessionManager.js.map