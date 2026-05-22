"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionInstrumentation = void 0;
var faro_core_1 = require("@grafana/faro-core");
var sessionAttributes_1 = require("./sessionAttributes");
var sessionManager_1 = require("./sessionManager");
var sessionConstants_1 = require("./sessionManager/sessionConstants");
var sessionManagerUtils_1 = require("./sessionManager/sessionManagerUtils");
/**
 * Session instrumentation for React Native
 * Manages persistent or volatile sessions with expiration and inactivity tracking
 */
var SessionInstrumentation = /** @class */ (function (_super) {
    __extends(SessionInstrumentation, _super);
    function SessionInstrumentation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = '@grafana/faro-react-native:instrumentation-session';
        _this.version = faro_core_1.VERSION;
        return _this;
    }
    SessionInstrumentation.prototype.getDefaultSessionDeviceAttributes = function () {
        var cfg = this.config;
        if (cfg.preloadedSessionDeviceAttributes != null) {
            return cfg.preloadedSessionDeviceAttributes;
        }
        return (0, sessionAttributes_1.minimalSessionDeviceAttributes)();
    };
    SessionInstrumentation.prototype.sendSessionStartEvent = function (meta) {
        var _a;
        var session = meta.session;
        if (session && session.id !== ((_a = this.notifiedSession) === null || _a === void 0 ? void 0 : _a.id)) {
            this.notifiedSession = session;
            // no need to add attributes and session id, they are included as part of meta
            // automatically
            this.api.pushEvent(faro_core_1.EVENT_SESSION_START, {}, undefined, { skipDedupe: true });
        }
    };
    SessionInstrumentation.prototype.createInitialSession = function (SessionManagerClass, sessionsConfig) {
        var _a, _b, _c, _d, _e, _f, _g;
        var storedUserSession = SessionManagerClass.fetchUserSession();
        var sessionsConfigTyped = sessionsConfig;
        var maxPersistenceMs = (_a = sessionsConfigTyped.maxSessionPersistenceTime) !== null && _a !== void 0 ? _a : sessionConstants_1.MAX_SESSION_PERSISTENCE_TIME;
        if (sessionsConfig.persistent && storedUserSession) {
            var now = (0, faro_core_1.dateNow)();
            var shouldClearPersistentSession = storedUserSession.lastActivity < now - maxPersistenceMs;
            if (shouldClearPersistentSession) {
                SessionManagerClass.removeUserSession();
                storedUserSession = null;
            }
        }
        var defaultAttributes = this.getDefaultSessionDeviceAttributes();
        var emitSessionStartOnInit;
        var initialSession;
        if ((0, sessionManagerUtils_1.isUserSessionValid)(storedUserSession)) {
            var sessionId = storedUserSession === null || storedUserSession === void 0 ? void 0 : storedUserSession.sessionId;
            initialSession = (0, sessionManagerUtils_1.createUserSessionObject)({
                sessionId: sessionId,
                isSampled: (storedUserSession === null || storedUserSession === void 0 ? void 0 : storedUserSession.isSampled) || false,
                started: storedUserSession === null || storedUserSession === void 0 ? void 0 : storedUserSession.started,
            });
            var storedUserSessionMeta = storedUserSession === null || storedUserSession === void 0 ? void 0 : storedUserSession.sessionMeta;
            // For resumed sessions we want to merge the previous overrides with the configured ones.
            // If the same key is present in both, the new one will override the old one.
            var overrides = __assign(__assign({}, (_b = sessionsConfig.session) === null || _b === void 0 ? void 0 : _b.overrides), storedUserSessionMeta === null || storedUserSessionMeta === void 0 ? void 0 : storedUserSessionMeta.overrides);
            initialSession.sessionMeta = __assign(__assign({}, sessionsConfig.session), { id: sessionId, attributes: __assign(__assign(__assign(__assign({}, (_c = sessionsConfig.session) === null || _c === void 0 ? void 0 : _c.attributes), storedUserSessionMeta === null || storedUserSessionMeta === void 0 ? void 0 : storedUserSessionMeta.attributes), defaultAttributes), { 
                    // For valid resumed sessions we do not want to recalculate the sampling decision on each init phase.
                    isSampled: initialSession.isSampled.toString() }), overrides: overrides });
            emitSessionStartOnInit = false;
        }
        else {
            var sessionId = (_e = (_d = sessionsConfig.session) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : (0, faro_core_1.genShortID)();
            initialSession = (0, sessionManagerUtils_1.createUserSessionObject)({
                sessionId: sessionId,
                isSampled: (0, sessionManager_1.isSampled)(),
            });
            var overrides = (_f = sessionsConfig.session) === null || _f === void 0 ? void 0 : _f.overrides;
            initialSession.sessionMeta = __assign({ id: sessionId, attributes: __assign(__assign({ isSampled: initialSession.isSampled.toString() }, (_g = sessionsConfig.session) === null || _g === void 0 ? void 0 : _g.attributes), defaultAttributes) }, (overrides ? { overrides: overrides } : {}));
            emitSessionStartOnInit = true;
        }
        return { initialSession: initialSession, emitSessionStartOnInit: emitSessionStartOnInit };
    };
    SessionInstrumentation.prototype.registerBeforeSendHook = function (SessionManagerClass) {
        var _a;
        var updateSession = new SessionManagerClass().updateSession;
        (_a = this.transports) === null || _a === void 0 ? void 0 : _a.addBeforeSendHooks(function (item) {
            var _a, _b, _c;
            updateSession();
            var attributes = (_a = item.meta.session) === null || _a === void 0 ? void 0 : _a.attributes;
            // Only filter out items when session is explicitly NOT sampled (isSampled='false')
            // If isSampled='true', remove the attribute before sending (it's internal)
            // If no isSampled attribute, pass through the item unchanged
            if ((attributes === null || attributes === void 0 ? void 0 : attributes['isSampled']) === 'false') {
                // Session is not sampled - drop this item
                return null;
            }
            if ((attributes === null || attributes === void 0 ? void 0 : attributes['isSampled']) === 'true') {
                // Session is sampled - remove internal isSampled attribute before sending
                var newItem = JSON.parse(JSON.stringify(item));
                var newAttributes = (_b = newItem.meta.session) === null || _b === void 0 ? void 0 : _b.attributes;
                newAttributes === null || newAttributes === void 0 ? true : delete newAttributes['isSampled'];
                if (Object.keys(newAttributes !== null && newAttributes !== void 0 ? newAttributes : {}).length === 0) {
                    (_c = newItem.meta.session) === null || _c === void 0 ? true : delete _c.attributes;
                }
                return newItem;
            }
            // No isSampled attribute or other value - pass through unchanged
            return item;
        });
    };
    SessionInstrumentation.prototype.initialize = function () {
        var sessionTrackingConfig = this.config.sessionTracking;
        if (!(sessionTrackingConfig === null || sessionTrackingConfig === void 0 ? void 0 : sessionTrackingConfig.enabled)) {
            this.metas.addListener(this.sendSessionStartEvent.bind(this));
            return;
        }
        var SessionManagerClass = (0, sessionManager_1.getSessionManagerByConfig)(sessionTrackingConfig);
        this.registerBeforeSendHook(SessionManagerClass);
        var _a = this.createInitialSession(SessionManagerClass, sessionTrackingConfig), initialSession = _a.initialSession, emitSessionStartOnInit = _a.emitSessionStartOnInit;
        SessionManagerClass.storeUserSession(initialSession);
        var initialSessionMeta = initialSession.sessionMeta;
        this.notifiedSession = initialSessionMeta;
        this.api.setSession(initialSessionMeta);
        this.sessionManagerInstance = new SessionManagerClass();
        if (emitSessionStartOnInit) {
            this.api.pushEvent(faro_core_1.EVENT_SESSION_START, {}, undefined, { skipDedupe: true });
        }
        this.metas.addListener(this.sendSessionStartEvent.bind(this));
    };
    /**
     * Clean up session manager listeners
     */
    SessionInstrumentation.prototype.unpatch = function () {
        if (this.sessionManagerInstance && 'unpatch' in this.sessionManagerInstance) {
            this.sessionManagerInstance.unpatch();
        }
    };
    return SessionInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.SessionInstrumentation = SessionInstrumentation;
//# sourceMappingURL=index.js.map