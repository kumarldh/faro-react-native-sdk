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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchTransport = void 0;
var faro_core_1 = require("@grafana/faro-core");
var DEFAULT_BUFFER_SIZE = 30;
var DEFAULT_CONCURRENCY = 5;
var DEFAULT_RATE_LIMIT_BACKOFF_MS = 5000;
var MAX_CONSECUTIVE_FAILURES = 3;
var FAILURE_BACKOFF_MS = 30000; // 30 seconds
var TOO_MANY_REQUESTS = 429;
var ACCEPTED = 202;
var FetchTransport = /** @class */ (function (_super) {
    __extends(FetchTransport, _super);
    function FetchTransport(options) {
        var _a, _b, _c, _d;
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.name = '@grafana/faro-react-native:transport-fetch';
        _this.version = faro_core_1.VERSION;
        _this.consecutiveFailures = 0;
        _this.sessionReadyPromise = null;
        _this.sessionReadyResolve = null;
        _this.sessionReady = false;
        _this.metasListenerRegistered = false;
        _this.rateLimitBackoffMs = (_a = options.defaultRateLimitBackoffMs) !== null && _a !== void 0 ? _a : DEFAULT_RATE_LIMIT_BACKOFF_MS;
        _this.getNow = (_b = options.getNow) !== null && _b !== void 0 ? _b : (function () { return Date.now(); });
        // Align with getNow so tests (and apps) that supply a clock do not see spurious backoff
        _this.disabledUntil = new Date(_this.getNow());
        _this.promiseBuffer = (0, faro_core_1.createPromiseBuffer)({
            size: (_c = options.bufferSize) !== null && _c !== void 0 ? _c : DEFAULT_BUFFER_SIZE,
            concurrency: (_d = options.concurrency) !== null && _d !== void 0 ? _d : DEFAULT_CONCURRENCY,
        });
        return _this;
    }
    /**
     * Register a listener for metas changes to detect when session becomes available.
     * Uses faro-core's metas listener pattern instead of polling with setTimeout.
     */
    FetchTransport.prototype.registerSessionListener = function () {
        var _this = this;
        var _a;
        if (this.metasListenerRegistered || !((_a = this.metas) === null || _a === void 0 ? void 0 : _a.addListener)) {
            return;
        }
        this.metasListenerRegistered = true;
        this.metas.addListener(function (meta) {
            var _a;
            if (((_a = meta.session) === null || _a === void 0 ? void 0 : _a.id) && _this.sessionReadyResolve) {
                _this.sessionReady = true;
                _this.sessionReadyResolve();
                _this.sessionReadyResolve = null;
            }
        });
    };
    /**
     * Wait for session to be available before sending.
     * This prevents 400 errors from the collector due to missing X-Faro-Session-Id header.
     *
     * Only waits if session tracking is enabled. If disabled, returns immediately.
     */
    FetchTransport.prototype.waitForSession = function () {
        var _this = this;
        var _a, _b, _c, _d;
        // Only wait for session if session tracking is enabled
        var sessionTrackingEnabled = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.sessionTracking) === null || _b === void 0 ? void 0 : _b.enabled;
        if (!sessionTrackingEnabled) {
            return Promise.resolve();
        }
        // Already have session
        if (this.sessionReady) {
            return Promise.resolve();
        }
        // Check if session is now available
        var sessionMeta = (_d = (_c = this.metas) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.session;
        if (sessionMeta === null || sessionMeta === void 0 ? void 0 : sessionMeta.id) {
            this.sessionReady = true;
            return Promise.resolve();
        }
        // Return existing promise if we're already waiting
        if (this.sessionReadyPromise) {
            return this.sessionReadyPromise;
        }
        // Register listener to be notified when session becomes available
        this.registerSessionListener();
        // Create a promise that resolves when session becomes available via listener
        this.sessionReadyPromise = new Promise(function (resolve) {
            var _a, _b;
            _this.sessionReadyResolve = resolve;
            // Also check immediately in case session was set between our check and listener registration
            var sessionMeta = (_b = (_a = _this.metas) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.session;
            if (sessionMeta === null || sessionMeta === void 0 ? void 0 : sessionMeta.id) {
                _this.sessionReady = true;
                resolve();
                _this.sessionReadyResolve = null;
            }
        });
        return this.sessionReadyPromise;
    };
    FetchTransport.prototype.send = function (items) {
        return __awaiter(this, void 0, void 0, function () {
            var now, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // DEBUG: Log at the very start of send
                        this.logDebug("FetchTransport.send() called with ".concat(items.length, " items"));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        now = new Date(this.getNow());
                        // Check if we're in backoff period
                        if (this.disabledUntil > now) {
                            this.logDebug("FetchTransport: in backoff period until ".concat(this.disabledUntil));
                            return [2 /*return*/, Promise.resolve()];
                        }
                        // Wait for session to be ready before sending
                        // This prevents 400 errors from missing X-Faro-Session-Id header
                        return [4 /*yield*/, this.waitForSession()];
                    case 2:
                        // Wait for session to be ready before sending
                        // This prevents 400 errors from missing X-Faro-Session-Id header
                        _b.sent();
                        return [4 /*yield*/, this.promiseBuffer.add(function () {
                                var transportBody = (0, faro_core_1.getTransportBody)(items);
                                var body = JSON.stringify(transportBody);
                                // DEBUG: Log measurement payloads to see what's being sent
                                if (transportBody.measurements && transportBody.measurements.length > 0) {
                                    for (var _i = 0, _a = transportBody.measurements; _i < _a.length; _i++) {
                                        var m = _a[_i];
                                        _this.logDebug("FetchTransport: measurement payload - type=".concat(m.type, ", values=").concat(JSON.stringify(m.values)));
                                    }
                                }
                                var _b = _this.options, url = _b.url, requestOptions = _b.requestOptions, apiKey = _b.apiKey, userKey = _b.userKey;
                                var _c = requestOptions !== null && requestOptions !== void 0 ? requestOptions : {}, headers = _c.headers, restOfRequestOptions = __rest(_c, ["headers"]);
                                var sessionId;
                                var sessionMeta = _this.metas.value.session;
                                if (sessionMeta != null) {
                                    sessionId = sessionMeta.id;
                                }
                                // DEBUG: Log fetch attempt
                                _this.logDebug("FetchTransport: sending ".concat(items.length, " items to ").concat(url));
                                // Create an AbortController for timeout
                                var controller = new AbortController();
                                var timeoutId = setTimeout(function () {
                                    controller.abort();
                                    _this.logDebug("FetchTransport: request timed out after 10s");
                                }, 10000);
                                return fetch(url, __assign({ method: 'POST', headers: __assign(__assign(__assign(__assign({ 'Content-Type': 'application/json' }, (headers !== null && headers !== void 0 ? headers : {})), (apiKey ? { 'x-api-key': apiKey } : {})), (userKey ? { 'user_key': userKey } : {})), (sessionId ? { 'x-faro-session-id': sessionId } : {})), body: body, signal: controller.signal }, (restOfRequestOptions !== null && restOfRequestOptions !== void 0 ? restOfRequestOptions : {})))
                                    .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                    var text;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                clearTimeout(timeoutId);
                                                // DEBUG: Log response status
                                                this.logDebug("FetchTransport: response status ".concat(response.status));
                                                // Reset failure counter on success
                                                this.consecutiveFailures = 0;
                                                if (response.status === TOO_MANY_REQUESTS) {
                                                    this.disabledUntil = this.getRetryAfterDate(response);
                                                    this.logDebug("FetchTransport: rate limited, disabled until ".concat(this.disabledUntil));
                                                }
                                                if (!(response.status !== ACCEPTED && response.status !== 200)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, response.text().catch(function () { return ''; })];
                                            case 1:
                                                text = _a.sent();
                                                this.logDebug("FetchTransport: non-success response: ".concat(response.status, " ").concat(text.slice(0, 200)));
                                                _a.label = 2;
                                            case 2: return [2 /*return*/, response];
                                        }
                                    });
                                }); })
                                    .catch(function (error) {
                                    clearTimeout(timeoutId);
                                    // DEBUG: Log the error
                                    _this.logDebug("FetchTransport: fetch failed - ".concat((error === null || error === void 0 ? void 0 : error.message) || error));
                                    // Increment failure counter
                                    _this.consecutiveFailures++;
                                    // After MAX_CONSECUTIVE_FAILURES, enable circuit breaker to prevent infinite loops
                                    if (_this.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
                                        _this.disabledUntil = new Date(_this.getNow() + FAILURE_BACKOFF_MS);
                                        // Reset counter so we can try again after backoff
                                        _this.consecutiveFailures = 0;
                                        _this.logDebug("FetchTransport: circuit breaker activated, disabled for 30s");
                                    }
                                    // Do NOT log errors to console - this causes infinite loops in React Native
                                    // when the DevTools console override intercepts even unpatchedConsole calls
                                });
                            })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FetchTransport.prototype.getIgnoreUrls = function () {
        var _a;
        return [this.options.url].concat((_a = this.config.ignoreUrls) !== null && _a !== void 0 ? _a : []);
    };
    FetchTransport.prototype.isBatched = function () {
        return true;
    };
    FetchTransport.prototype.getRetryAfterDate = function (response) {
        var now = this.getNow();
        var retryAfterHeader = response.headers.get('Retry-After');
        if (retryAfterHeader) {
            var delay = Number(retryAfterHeader);
            if (!isNaN(delay)) {
                return new Date(delay * 1000 + now);
            }
            var date = Date.parse(retryAfterHeader);
            if (!isNaN(date)) {
                return new Date(date);
            }
        }
        return new Date(now + this.rateLimitBackoffMs);
    };
    return FetchTransport;
}(faro_core_1.BaseTransport));
exports.FetchTransport = FetchTransport;
//# sourceMappingURL=transport.js.map