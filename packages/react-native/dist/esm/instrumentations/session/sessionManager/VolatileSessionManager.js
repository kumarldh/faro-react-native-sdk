import { AppState } from 'react-native';
import { faro } from '@grafana/faro-core';
import { throttle } from '../../../utils/throttle';
import { STORAGE_UPDATE_DELAY } from './sessionConstants';
import { getSessionMetaUpdateHandler, getUserSessionUpdater } from './sessionManagerUtils';
export class VolatileSessionsManager {
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
            fetchUserSession: VolatileSessionsManager.fetchUserSession,
            storeUserSession: VolatileSessionsManager.storeUserSession,
        });
        this.init();
    }
    static removeUserSession() {
        VolatileSessionsManager.volatileStorage = null;
    }
    static storeUserSession(session) {
        VolatileSessionsManager.volatileStorage = session;
    }
    static fetchUserSession() {
        return VolatileSessionsManager.volatileStorage;
    }
    init() {
        // Listen to app state changes (equivalent to visibilitychange in web)
        this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
        // Users can call the setSession() method, so we need to sync this with the in-memory session
        const unsubscribe = faro.metas.addListener(getSessionMetaUpdateHandler({
            fetchUserSession: VolatileSessionsManager.fetchUserSession,
            storeUserSession: VolatileSessionsManager.storeUserSession,
        }));
        this.metaUnsubscribe = typeof unsubscribe === 'function' ? unsubscribe : null;
    }
    /**
     * Clean up listeners when the instrumentation is unpatched
     */
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
VolatileSessionsManager.volatileStorage = null;
//# sourceMappingURL=VolatileSessionManager.js.map