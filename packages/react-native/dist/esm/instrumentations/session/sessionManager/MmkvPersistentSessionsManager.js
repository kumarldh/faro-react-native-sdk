import { AppState } from 'react-native';
import { faro, stringifyExternalJson } from '@grafana/faro-core';
import { throttle } from '../../../utils/throttle';
import { STORAGE_KEY, STORAGE_UPDATE_DELAY } from './sessionConstants';
import { getSessionMetaUpdateHandler, getUserSessionUpdater } from './sessionManagerUtils';
function createMmkvInstance() {
    try {
        const { MMKV } = require('react-native-mmkv');
        return new MMKV({ id: 'grafana-faro-react-native-session' });
    }
    catch (_a) {
        throw new Error('sessionTracking.persistent is true but react-native-mmkv could not be loaded. Install it: yarn add react-native-mmkv, then rebuild native projects.');
    }
}
let mmkvSingleton;
function getMmkv() {
    if (mmkvSingleton == null) {
        mmkvSingleton = createMmkvInstance();
    }
    return mmkvSingleton;
}
/** @internal */
export function resetMmkvSingletonForTests() {
    mmkvSingleton = undefined;
}
/**
 * Persistent session storage backed by MMKV (synchronous reads/writes).
 * Used when `sessionTracking.persistent` is true.
 */
export class MmkvPersistentSessionsManager {
    constructor() {
        this.appStateSubscription = null;
        this.metaUnsubscribe = null;
        this.updateSession = throttle(() => this.updateUserSession(), STORAGE_UPDATE_DELAY);
        this.handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active') {
                this.updateSession();
            }
        };
        this.updateUserSession = getUserSessionUpdater({
            fetchUserSession: MmkvPersistentSessionsManager.fetchUserSession,
            storeUserSession: MmkvPersistentSessionsManager.storeUserSession,
        });
        this.init();
    }
    static removeUserSession() {
        var _a, _b;
        try {
            getMmkv().remove(STORAGE_KEY);
        }
        catch (error) {
            (_b = (_a = faro.unpatchedConsole) === null || _a === void 0 ? void 0 : _a.warn) === null || _b === void 0 ? void 0 : _b.call(_a, 'Failed to remove session from MMKV:', error);
        }
    }
    static storeUserSession(session) {
        var _a, _b;
        try {
            getMmkv().set(STORAGE_KEY, stringifyExternalJson(session));
        }
        catch (error) {
            (_b = (_a = faro.unpatchedConsole) === null || _a === void 0 ? void 0 : _a.warn) === null || _b === void 0 ? void 0 : _b.call(_a, 'Failed to store session in MMKV:', error);
        }
    }
    static fetchUserSession() {
        var _a, _b;
        try {
            const storedSession = getMmkv().getString(STORAGE_KEY);
            if (storedSession) {
                return JSON.parse(storedSession);
            }
            return null;
        }
        catch (error) {
            (_b = (_a = faro.unpatchedConsole) === null || _a === void 0 ? void 0 : _a.warn) === null || _b === void 0 ? void 0 : _b.call(_a, 'Failed to fetch session from MMKV:', error);
            return null;
        }
    }
    init() {
        this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
        const unsubscribe = faro.metas.addListener(getSessionMetaUpdateHandler({
            fetchUserSession: MmkvPersistentSessionsManager.fetchUserSession,
            storeUserSession: MmkvPersistentSessionsManager.storeUserSession,
        }));
        this.metaUnsubscribe = typeof unsubscribe === 'function' ? unsubscribe : null;
    }
    unpatch() {
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }
        if (this.metaUnsubscribe) {
            this.metaUnsubscribe();
            this.metaUnsubscribe = null;
        }
    }
}
//# sourceMappingURL=MmkvPersistentSessionsManager.js.map