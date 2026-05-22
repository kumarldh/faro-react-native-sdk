"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSessionObject = createUserSessionObject;
exports.isUserSessionValid = isUserSessionValid;
exports.getUserSessionUpdater = getUserSessionUpdater;
exports.addSessionMetadataToNextSession = addSessionMetadataToNextSession;
exports.getSessionMetaUpdateHandler = getSessionMetaUpdateHandler;
var faro_core_1 = require("@grafana/faro-core");
var sampling_1 = require("./sampling");
var sessionConstants_1 = require("./sessionConstants");
var DEFAULT_SESSION_EXPIRATION_MS = 4 * 60 * 60 * 1000; // 4 hours (not in faro-core)
function getSessionTimeouts() {
    var _a, _b, _c;
    var inactivityTimeout = (_c = (_b = (_a = faro_core_1.faro.config) === null || _a === void 0 ? void 0 : _a.sessionTracking) === null || _b === void 0 ? void 0 : _b.maxSessionPersistenceTime) !== null && _c !== void 0 ? _c : sessionConstants_1.MAX_SESSION_PERSISTENCE_TIME;
    return {
        sessionExpirationTime: DEFAULT_SESSION_EXPIRATION_MS,
        inactivityTimeout: inactivityTimeout,
    };
}
function createUserSessionObject(_a) {
    var _b, _c;
    var _d = _a === void 0 ? {} : _a, sessionId = _d.sessionId, started = _d.started, lastActivity = _d.lastActivity, _e = _d.isSampled, sampledValue = _e === void 0 ? true : _e;
    var now = (0, faro_core_1.dateNow)();
    var generateSessionId = (_c = (_b = faro_core_1.faro.config) === null || _b === void 0 ? void 0 : _b.sessionTracking) === null || _c === void 0 ? void 0 : _c.generateSessionId;
    if (sessionId == null) {
        sessionId = typeof generateSessionId === 'function' ? generateSessionId() : (0, faro_core_1.genShortID)();
    }
    return {
        sessionId: sessionId,
        lastActivity: lastActivity !== null && lastActivity !== void 0 ? lastActivity : now,
        started: started !== null && started !== void 0 ? started : now,
        isSampled: sampledValue,
    };
}
function isUserSessionValid(session) {
    if (session == null) {
        return false;
    }
    var _a = getSessionTimeouts(), sessionExpirationTime = _a.sessionExpirationTime, inactivityTimeout = _a.inactivityTimeout;
    var now = (0, faro_core_1.dateNow)();
    var lifetimeValid = now - session.started < sessionExpirationTime;
    if (!lifetimeValid) {
        return false;
    }
    var inactivityPeriodValid = now - session.lastActivity < inactivityTimeout;
    return inactivityPeriodValid;
}
function getUserSessionUpdater(_a) {
    var fetchUserSession = _a.fetchUserSession, storeUserSession = _a.storeUserSession;
    return function updateSession() {
        return __awaiter(this, void 0, void 0, function () {
            var sessionFromStorage, newSession;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!fetchUserSession || !storeUserSession) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, fetchUserSession()];
                    case 1:
                        sessionFromStorage = _e.sent();
                        if (!isUserSessionValid(sessionFromStorage)) return [3 /*break*/, 3];
                        return [4 /*yield*/, storeUserSession(__assign(__assign({}, sessionFromStorage), { lastActivity: (0, faro_core_1.dateNow)() }))];
                    case 2:
                        _e.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        newSession = addSessionMetadataToNextSession(createUserSessionObject({ isSampled: (0, sampling_1.isSampled)() }), sessionFromStorage);
                        return [4 /*yield*/, storeUserSession(newSession)];
                    case 4:
                        _e.sent();
                        (_a = faro_core_1.faro.api) === null || _a === void 0 ? void 0 : _a.setSession(newSession.sessionMeta);
                        (_c = (_b = faro_core_1.faro.config.sessionTracking) === null || _b === void 0 ? void 0 : _b.onSessionChange) === null || _c === void 0 ? void 0 : _c.call(_b, (_d = sessionFromStorage === null || sessionFromStorage === void 0 ? void 0 : sessionFromStorage.sessionMeta) !== null && _d !== void 0 ? _d : null, newSession.sessionMeta);
                        _e.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
}
function addSessionMetadataToNextSession(newSession, previousSession) {
    var _a, _b, _c, _d, _e, _f, _g;
    var sessionWithMeta = __assign(__assign({}, newSession), { sessionMeta: {
            id: newSession.sessionId,
            attributes: __assign(__assign(__assign({}, (_b = (_a = faro_core_1.faro.config.sessionTracking) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.attributes), ((_d = (_c = faro_core_1.faro.metas.value.session) === null || _c === void 0 ? void 0 : _c.attributes) !== null && _d !== void 0 ? _d : {})), { isSampled: newSession.isSampled.toString() }),
        } });
    var overrides = (_f = (_e = faro_core_1.faro.metas.value.session) === null || _e === void 0 ? void 0 : _e.overrides) !== null && _f !== void 0 ? _f : (_g = previousSession === null || previousSession === void 0 ? void 0 : previousSession.sessionMeta) === null || _g === void 0 ? void 0 : _g.overrides;
    if (!(0, faro_core_1.isEmpty)(overrides)) {
        sessionWithMeta.sessionMeta.overrides = overrides;
    }
    var previousSessionId = previousSession === null || previousSession === void 0 ? void 0 : previousSession.sessionId;
    if (previousSessionId != null) {
        sessionWithMeta.sessionMeta.attributes['previousSession'] = previousSessionId;
    }
    return sessionWithMeta;
}
function getSessionMetaUpdateHandler(_a) {
    var fetchUserSession = _a.fetchUserSession, storeUserSession = _a.storeUserSession;
    return function syncSessionIfChangedExternally(meta) {
        return __awaiter(this, void 0, void 0, function () {
            var session, sessionFromSessionStorage, sessionId, sessionAttributes, sessionOverrides, storedSessionMeta, storedSessionMetaOverrides, hasSessionOverridesChanged, hasAttributesChanged, hasSessionIdChanged, userSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        session = meta.session;
                        return [4 /*yield*/, fetchUserSession()];
                    case 1:
                        sessionFromSessionStorage = _a.sent();
                        sessionId = session === null || session === void 0 ? void 0 : session.id;
                        sessionAttributes = session === null || session === void 0 ? void 0 : session.attributes;
                        sessionOverrides = session === null || session === void 0 ? void 0 : session.overrides;
                        storedSessionMeta = sessionFromSessionStorage === null || sessionFromSessionStorage === void 0 ? void 0 : sessionFromSessionStorage.sessionMeta;
                        storedSessionMetaOverrides = storedSessionMeta === null || storedSessionMeta === void 0 ? void 0 : storedSessionMeta.overrides;
                        hasSessionOverridesChanged = !!sessionOverrides && !(0, faro_core_1.deepEqual)(sessionOverrides, storedSessionMetaOverrides);
                        hasAttributesChanged = !!sessionAttributes && !(0, faro_core_1.deepEqual)(sessionAttributes, storedSessionMeta === null || storedSessionMeta === void 0 ? void 0 : storedSessionMeta.attributes);
                        hasSessionIdChanged = !!session && sessionId !== (sessionFromSessionStorage === null || sessionFromSessionStorage === void 0 ? void 0 : sessionFromSessionStorage.sessionId);
                        if (!(hasSessionIdChanged || hasAttributesChanged || hasSessionOverridesChanged)) return [3 /*break*/, 3];
                        userSession = addSessionMetadataToNextSession(createUserSessionObject({ sessionId: sessionId, isSampled: (0, sampling_1.isSampled)() }), sessionFromSessionStorage);
                        return [4 /*yield*/, storeUserSession(userSession)];
                    case 2:
                        _a.sent();
                        sendOverrideEvent(hasSessionOverridesChanged, sessionOverrides, storedSessionMetaOverrides);
                        faro_core_1.faro.api.setSession(userSession.sessionMeta);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
}
function sendOverrideEvent(hasSessionOverridesChanged, sessionOverrides, storedSessionOverrides) {
    var _a, _b, _c;
    if (sessionOverrides === void 0) { sessionOverrides = {}; }
    if (storedSessionOverrides === void 0) { storedSessionOverrides = {}; }
    if (!hasSessionOverridesChanged) {
        return;
    }
    var serviceName = sessionOverrides.serviceName;
    var previousServiceName = (_c = (_a = storedSessionOverrides.serviceName) !== null && _a !== void 0 ? _a : (_b = faro_core_1.faro.metas.value.app) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : '';
    if (serviceName && serviceName !== previousServiceName) {
        faro_core_1.faro.api.pushEvent(faro_core_1.EVENT_OVERRIDES_SERVICE_NAME, {
            serviceName: serviceName,
            previousServiceName: previousServiceName,
        });
    }
}
//# sourceMappingURL=sessionManagerUtils.js.map