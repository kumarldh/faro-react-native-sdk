"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MmkvPersistentSessionsManager = void 0;
exports.resetMmkvSingletonForTests = resetMmkvSingletonForTests;
var react_native_1 = require("react-native");
var faro_core_1 = require("@grafana/faro-core");
var throttle_1 = require("../../../utils/throttle");
var sessionConstants_1 = require("./sessionConstants");
var sessionManagerUtils_1 = require("./sessionManagerUtils");
function createMmkvInstance() {
    try {
        var MMKV = require('react-native-mmkv').MMKV;
        return new MMKV({ id: 'grafana-faro-react-native-session' });
    }
    catch (_a) {
        throw new Error('sessionTracking.persistent is true but react-native-mmkv could not be loaded. Install it: yarn add react-native-mmkv, then rebuild native projects.');
    }
}
var mmkvSingleton;
function getMmkv() {
    if (mmkvSingleton == null) {
        mmkvSingleton = createMmkvInstance();
    }
    return mmkvSingleton;
}
/** @internal */
function resetMmkvSingletonForTests() {
    mmkvSingleton = undefined;
}
/**
 * Persistent session storage backed by MMKV (synchronous reads/writes).
 * Used when `sessionTracking.persistent` is true.
 */
var MmkvPersistentSessionsManager = /** @class */ (function () {
    function MmkvPersistentSessionsManager() {
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
            fetchUserSession: MmkvPersistentSessionsManager.fetchUserSession,
            storeUserSession: MmkvPersistentSessionsManager.storeUserSession,
        });
        this.init();
    }
    MmkvPersistentSessionsManager.removeUserSession = function () {
        var _a, _b;
        try {
            getMmkv().remove(sessionConstants_1.STORAGE_KEY);
        }
        catch (error) {
            (_b = (_a = faro_core_1.faro.unpatchedConsole) === null || _a === void 0 ? void 0 : _a.warn) === null || _b === void 0 ? void 0 : _b.call(_a, 'Failed to remove session from MMKV:', error);
        }
    };
    MmkvPersistentSessionsManager.storeUserSession = function (session) {
        var _a, _b;
        try {
            getMmkv().set(sessionConstants_1.STORAGE_KEY, (0, faro_core_1.stringifyExternalJson)(session));
        }
        catch (error) {
            (_b = (_a = faro_core_1.faro.unpatchedConsole) === null || _a === void 0 ? void 0 : _a.warn) === null || _b === void 0 ? void 0 : _b.call(_a, 'Failed to store session in MMKV:', error);
        }
    };
    MmkvPersistentSessionsManager.fetchUserSession = function () {
        var _a, _b;
        try {
            var storedSession = getMmkv().getString(sessionConstants_1.STORAGE_KEY);
            if (storedSession) {
                return JSON.parse(storedSession);
            }
            return null;
        }
        catch (error) {
            (_b = (_a = faro_core_1.faro.unpatchedConsole) === null || _a === void 0 ? void 0 : _a.warn) === null || _b === void 0 ? void 0 : _b.call(_a, 'Failed to fetch session from MMKV:', error);
            return null;
        }
    };
    MmkvPersistentSessionsManager.prototype.init = function () {
        this.appStateSubscription = react_native_1.AppState.addEventListener('change', this.handleAppStateChange);
        var unsubscribe = faro_core_1.faro.metas.addListener((0, sessionManagerUtils_1.getSessionMetaUpdateHandler)({
            fetchUserSession: MmkvPersistentSessionsManager.fetchUserSession,
            storeUserSession: MmkvPersistentSessionsManager.storeUserSession,
        }));
        this.metaUnsubscribe = typeof unsubscribe === 'function' ? unsubscribe : null;
    };
    MmkvPersistentSessionsManager.prototype.unpatch = function () {
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }
        if (this.metaUnsubscribe) {
            this.metaUnsubscribe();
            this.metaUnsubscribe = null;
        }
    };
    return MmkvPersistentSessionsManager;
}());
exports.MmkvPersistentSessionsManager = MmkvPersistentSessionsManager;
//# sourceMappingURL=MmkvPersistentSessionsManager.js.map