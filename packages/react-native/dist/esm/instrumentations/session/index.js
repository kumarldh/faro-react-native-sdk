import { BaseInstrumentation, dateNow, EVENT_SESSION_START, genShortID, VERSION } from '@grafana/faro-core';
import { minimalSessionDeviceAttributes } from './sessionAttributes';
import { getSessionManagerByConfig, isSampled } from './sessionManager';
import { MAX_SESSION_PERSISTENCE_TIME } from './sessionManager/sessionConstants';
import { createUserSessionObject, isUserSessionValid } from './sessionManager/sessionManagerUtils';
/**
 * Session instrumentation for React Native
 * Manages persistent or volatile sessions with expiration and inactivity tracking
 */
export class SessionInstrumentation extends BaseInstrumentation {
    constructor() {
        super(...arguments);
        this.name = '@grafana/faro-react-native:instrumentation-session';
        this.version = VERSION;
    }
    getDefaultSessionDeviceAttributes() {
        const cfg = this.config;
        if (cfg.preloadedSessionDeviceAttributes != null) {
            return cfg.preloadedSessionDeviceAttributes;
        }
        return minimalSessionDeviceAttributes();
    }
    sendSessionStartEvent(meta) {
        var _a;
        const session = meta.session;
        if (session && session.id !== ((_a = this.notifiedSession) === null || _a === void 0 ? void 0 : _a.id)) {
            this.notifiedSession = session;
            // no need to add attributes and session id, they are included as part of meta
            // automatically
            this.api.pushEvent(EVENT_SESSION_START, {}, undefined, { skipDedupe: true });
        }
    }
    createInitialSession(SessionManagerClass, sessionsConfig) {
        var _a, _b, _c, _d, _e, _f, _g;
        let storedUserSession = SessionManagerClass.fetchUserSession();
        const sessionsConfigTyped = sessionsConfig;
        const maxPersistenceMs = (_a = sessionsConfigTyped.maxSessionPersistenceTime) !== null && _a !== void 0 ? _a : MAX_SESSION_PERSISTENCE_TIME;
        if (sessionsConfig.persistent && storedUserSession) {
            const now = dateNow();
            const shouldClearPersistentSession = storedUserSession.lastActivity < now - maxPersistenceMs;
            if (shouldClearPersistentSession) {
                SessionManagerClass.removeUserSession();
                storedUserSession = null;
            }
        }
        const defaultAttributes = this.getDefaultSessionDeviceAttributes();
        let emitSessionStartOnInit;
        let initialSession;
        if (isUserSessionValid(storedUserSession)) {
            const sessionId = storedUserSession === null || storedUserSession === void 0 ? void 0 : storedUserSession.sessionId;
            initialSession = createUserSessionObject({
                sessionId,
                isSampled: (storedUserSession === null || storedUserSession === void 0 ? void 0 : storedUserSession.isSampled) || false,
                started: storedUserSession === null || storedUserSession === void 0 ? void 0 : storedUserSession.started,
            });
            const storedUserSessionMeta = storedUserSession === null || storedUserSession === void 0 ? void 0 : storedUserSession.sessionMeta;
            // For resumed sessions we want to merge the previous overrides with the configured ones.
            // If the same key is present in both, the new one will override the old one.
            const overrides = Object.assign(Object.assign({}, (_b = sessionsConfig.session) === null || _b === void 0 ? void 0 : _b.overrides), storedUserSessionMeta === null || storedUserSessionMeta === void 0 ? void 0 : storedUserSessionMeta.overrides);
            initialSession.sessionMeta = Object.assign(Object.assign({}, sessionsConfig.session), { id: sessionId, attributes: Object.assign(Object.assign(Object.assign(Object.assign({}, (_c = sessionsConfig.session) === null || _c === void 0 ? void 0 : _c.attributes), storedUserSessionMeta === null || storedUserSessionMeta === void 0 ? void 0 : storedUserSessionMeta.attributes), defaultAttributes), { 
                    // For valid resumed sessions we do not want to recalculate the sampling decision on each init phase.
                    isSampled: initialSession.isSampled.toString() }), overrides });
            emitSessionStartOnInit = false;
        }
        else {
            const sessionId = (_e = (_d = sessionsConfig.session) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : genShortID();
            initialSession = createUserSessionObject({
                sessionId,
                isSampled: isSampled(),
            });
            const overrides = (_f = sessionsConfig.session) === null || _f === void 0 ? void 0 : _f.overrides;
            initialSession.sessionMeta = Object.assign({ id: sessionId, attributes: Object.assign(Object.assign({ isSampled: initialSession.isSampled.toString() }, (_g = sessionsConfig.session) === null || _g === void 0 ? void 0 : _g.attributes), defaultAttributes) }, (overrides ? { overrides } : {}));
            emitSessionStartOnInit = true;
        }
        return { initialSession, emitSessionStartOnInit };
    }
    registerBeforeSendHook(SessionManagerClass) {
        var _a;
        const { updateSession } = new SessionManagerClass();
        (_a = this.transports) === null || _a === void 0 ? void 0 : _a.addBeforeSendHooks((item) => {
            var _a, _b, _c;
            updateSession();
            const attributes = (_a = item.meta.session) === null || _a === void 0 ? void 0 : _a.attributes;
            // Only filter out items when session is explicitly NOT sampled (isSampled='false')
            // If isSampled='true', remove the attribute before sending (it's internal)
            // If no isSampled attribute, pass through the item unchanged
            if ((attributes === null || attributes === void 0 ? void 0 : attributes['isSampled']) === 'false') {
                // Session is not sampled - drop this item
                return null;
            }
            if ((attributes === null || attributes === void 0 ? void 0 : attributes['isSampled']) === 'true') {
                // Session is sampled - remove internal isSampled attribute before sending
                let newItem = JSON.parse(JSON.stringify(item));
                const newAttributes = (_b = newItem.meta.session) === null || _b === void 0 ? void 0 : _b.attributes;
                newAttributes === null || newAttributes === void 0 ? true : delete newAttributes['isSampled'];
                if (Object.keys(newAttributes !== null && newAttributes !== void 0 ? newAttributes : {}).length === 0) {
                    (_c = newItem.meta.session) === null || _c === void 0 ? true : delete _c.attributes;
                }
                return newItem;
            }
            // No isSampled attribute or other value - pass through unchanged
            return item;
        });
    }
    initialize() {
        const sessionTrackingConfig = this.config.sessionTracking;
        if (!(sessionTrackingConfig === null || sessionTrackingConfig === void 0 ? void 0 : sessionTrackingConfig.enabled)) {
            this.metas.addListener(this.sendSessionStartEvent.bind(this));
            return;
        }
        const SessionManagerClass = getSessionManagerByConfig(sessionTrackingConfig);
        this.registerBeforeSendHook(SessionManagerClass);
        const { initialSession, emitSessionStartOnInit } = this.createInitialSession(SessionManagerClass, sessionTrackingConfig);
        SessionManagerClass.storeUserSession(initialSession);
        const initialSessionMeta = initialSession.sessionMeta;
        this.notifiedSession = initialSessionMeta;
        this.api.setSession(initialSessionMeta);
        this.sessionManagerInstance = new SessionManagerClass();
        if (emitSessionStartOnInit) {
            this.api.pushEvent(EVENT_SESSION_START, {}, undefined, { skipDedupe: true });
        }
        this.metas.addListener(this.sendSessionStartEvent.bind(this));
    }
    /**
     * Clean up session manager listeners
     */
    unpatch() {
        if (this.sessionManagerInstance && 'unpatch' in this.sessionManagerInstance) {
            this.sessionManagerInstance.unpatch();
        }
    }
}
//# sourceMappingURL=index.js.map