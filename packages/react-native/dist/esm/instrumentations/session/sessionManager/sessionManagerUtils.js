var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { dateNow, deepEqual, EVENT_OVERRIDES_SERVICE_NAME, faro, genShortID, isEmpty } from '@grafana/faro-core';
import { isSampled } from './sampling';
import { MAX_SESSION_PERSISTENCE_TIME } from './sessionConstants';
const DEFAULT_SESSION_EXPIRATION_MS = 4 * 60 * 60 * 1000; // 4 hours (not in faro-core)
function getSessionTimeouts() {
    var _a, _b, _c;
    const inactivityTimeout = (_c = (_b = (_a = faro.config) === null || _a === void 0 ? void 0 : _a.sessionTracking) === null || _b === void 0 ? void 0 : _b.maxSessionPersistenceTime) !== null && _c !== void 0 ? _c : MAX_SESSION_PERSISTENCE_TIME;
    return {
        sessionExpirationTime: DEFAULT_SESSION_EXPIRATION_MS,
        inactivityTimeout,
    };
}
export function createUserSessionObject({ sessionId, started, lastActivity, isSampled: sampledValue = true, } = {}) {
    var _a, _b;
    const now = dateNow();
    const generateSessionId = (_b = (_a = faro.config) === null || _a === void 0 ? void 0 : _a.sessionTracking) === null || _b === void 0 ? void 0 : _b.generateSessionId;
    if (sessionId == null) {
        sessionId = typeof generateSessionId === 'function' ? generateSessionId() : genShortID();
    }
    return {
        sessionId,
        lastActivity: lastActivity !== null && lastActivity !== void 0 ? lastActivity : now,
        started: started !== null && started !== void 0 ? started : now,
        isSampled: sampledValue,
    };
}
export function isUserSessionValid(session) {
    if (session == null) {
        return false;
    }
    const { sessionExpirationTime, inactivityTimeout } = getSessionTimeouts();
    const now = dateNow();
    const lifetimeValid = now - session.started < sessionExpirationTime;
    if (!lifetimeValid) {
        return false;
    }
    const inactivityPeriodValid = now - session.lastActivity < inactivityTimeout;
    return inactivityPeriodValid;
}
export function getUserSessionUpdater({ fetchUserSession, storeUserSession, }) {
    return function updateSession() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (!fetchUserSession || !storeUserSession) {
                return;
            }
            const sessionFromStorage = yield fetchUserSession();
            if (isUserSessionValid(sessionFromStorage)) {
                yield storeUserSession(Object.assign(Object.assign({}, sessionFromStorage), { lastActivity: dateNow() }));
            }
            else {
                let newSession = addSessionMetadataToNextSession(createUserSessionObject({ isSampled: isSampled() }), sessionFromStorage);
                yield storeUserSession(newSession);
                (_a = faro.api) === null || _a === void 0 ? void 0 : _a.setSession(newSession.sessionMeta);
                (_c = (_b = faro.config.sessionTracking) === null || _b === void 0 ? void 0 : _b.onSessionChange) === null || _c === void 0 ? void 0 : _c.call(_b, (_d = sessionFromStorage === null || sessionFromStorage === void 0 ? void 0 : sessionFromStorage.sessionMeta) !== null && _d !== void 0 ? _d : null, newSession.sessionMeta);
            }
        });
    };
}
export function addSessionMetadataToNextSession(newSession, previousSession) {
    var _a, _b, _c, _d, _e, _f, _g;
    const sessionWithMeta = Object.assign(Object.assign({}, newSession), { sessionMeta: {
            id: newSession.sessionId,
            attributes: Object.assign(Object.assign(Object.assign({}, (_b = (_a = faro.config.sessionTracking) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.attributes), ((_d = (_c = faro.metas.value.session) === null || _c === void 0 ? void 0 : _c.attributes) !== null && _d !== void 0 ? _d : {})), { isSampled: newSession.isSampled.toString() }),
        } });
    const overrides = (_f = (_e = faro.metas.value.session) === null || _e === void 0 ? void 0 : _e.overrides) !== null && _f !== void 0 ? _f : (_g = previousSession === null || previousSession === void 0 ? void 0 : previousSession.sessionMeta) === null || _g === void 0 ? void 0 : _g.overrides;
    if (!isEmpty(overrides)) {
        sessionWithMeta.sessionMeta.overrides = overrides;
    }
    const previousSessionId = previousSession === null || previousSession === void 0 ? void 0 : previousSession.sessionId;
    if (previousSessionId != null) {
        sessionWithMeta.sessionMeta.attributes['previousSession'] = previousSessionId;
    }
    return sessionWithMeta;
}
export function getSessionMetaUpdateHandler({ fetchUserSession, storeUserSession, }) {
    return function syncSessionIfChangedExternally(meta) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = meta.session;
            const sessionFromSessionStorage = yield fetchUserSession();
            let sessionId = session === null || session === void 0 ? void 0 : session.id;
            const sessionAttributes = session === null || session === void 0 ? void 0 : session.attributes;
            const sessionOverrides = session === null || session === void 0 ? void 0 : session.overrides;
            const storedSessionMeta = sessionFromSessionStorage === null || sessionFromSessionStorage === void 0 ? void 0 : sessionFromSessionStorage.sessionMeta;
            const storedSessionMetaOverrides = storedSessionMeta === null || storedSessionMeta === void 0 ? void 0 : storedSessionMeta.overrides;
            const hasSessionOverridesChanged = !!sessionOverrides && !deepEqual(sessionOverrides, storedSessionMetaOverrides);
            const hasAttributesChanged = !!sessionAttributes && !deepEqual(sessionAttributes, storedSessionMeta === null || storedSessionMeta === void 0 ? void 0 : storedSessionMeta.attributes);
            const hasSessionIdChanged = !!session && sessionId !== (sessionFromSessionStorage === null || sessionFromSessionStorage === void 0 ? void 0 : sessionFromSessionStorage.sessionId);
            if (hasSessionIdChanged || hasAttributesChanged || hasSessionOverridesChanged) {
                const userSession = addSessionMetadataToNextSession(createUserSessionObject({ sessionId, isSampled: isSampled() }), sessionFromSessionStorage);
                yield storeUserSession(userSession);
                sendOverrideEvent(hasSessionOverridesChanged, sessionOverrides, storedSessionMetaOverrides);
                faro.api.setSession(userSession.sessionMeta);
            }
        });
    };
}
function sendOverrideEvent(hasSessionOverridesChanged, sessionOverrides = {}, storedSessionOverrides = {}) {
    var _a, _b, _c;
    if (!hasSessionOverridesChanged) {
        return;
    }
    const serviceName = sessionOverrides.serviceName;
    const previousServiceName = (_c = (_a = storedSessionOverrides.serviceName) !== null && _a !== void 0 ? _a : (_b = faro.metas.value.app) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : '';
    if (serviceName && serviceName !== previousServiceName) {
        faro.api.pushEvent(EVENT_OVERRIDES_SERVICE_NAME, {
            serviceName,
            previousServiceName,
        });
    }
}
//# sourceMappingURL=sessionManagerUtils.js.map