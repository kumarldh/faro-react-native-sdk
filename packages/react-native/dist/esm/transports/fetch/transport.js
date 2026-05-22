var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
import { BaseTransport, createPromiseBuffer, getTransportBody, VERSION } from '@grafana/faro-core';
const DEFAULT_BUFFER_SIZE = 30;
const DEFAULT_CONCURRENCY = 5;
const DEFAULT_RATE_LIMIT_BACKOFF_MS = 5000;
const MAX_CONSECUTIVE_FAILURES = 3;
const FAILURE_BACKOFF_MS = 30000; // 30 seconds
const TOO_MANY_REQUESTS = 429;
const ACCEPTED = 202;
export class FetchTransport extends BaseTransport {
    constructor(options) {
        var _a, _b, _c, _d;
        super();
        this.options = options;
        this.name = '@grafana/faro-react-native:transport-fetch';
        this.version = VERSION;
        this.consecutiveFailures = 0;
        this.sessionReadyPromise = null;
        this.sessionReadyResolve = null;
        this.sessionReady = false;
        this.metasListenerRegistered = false;
        this.rateLimitBackoffMs = (_a = options.defaultRateLimitBackoffMs) !== null && _a !== void 0 ? _a : DEFAULT_RATE_LIMIT_BACKOFF_MS;
        this.getNow = (_b = options.getNow) !== null && _b !== void 0 ? _b : (() => Date.now());
        // Align with getNow so tests (and apps) that supply a clock do not see spurious backoff
        this.disabledUntil = new Date(this.getNow());
        this.promiseBuffer = createPromiseBuffer({
            size: (_c = options.bufferSize) !== null && _c !== void 0 ? _c : DEFAULT_BUFFER_SIZE,
            concurrency: (_d = options.concurrency) !== null && _d !== void 0 ? _d : DEFAULT_CONCURRENCY,
        });
    }
    /**
     * Register a listener for metas changes to detect when session becomes available.
     * Uses faro-core's metas listener pattern instead of polling with setTimeout.
     */
    registerSessionListener() {
        var _a;
        if (this.metasListenerRegistered || !((_a = this.metas) === null || _a === void 0 ? void 0 : _a.addListener)) {
            return;
        }
        this.metasListenerRegistered = true;
        this.metas.addListener((meta) => {
            var _a;
            if (((_a = meta.session) === null || _a === void 0 ? void 0 : _a.id) && this.sessionReadyResolve) {
                this.sessionReady = true;
                this.sessionReadyResolve();
                this.sessionReadyResolve = null;
            }
        });
    }
    /**
     * Wait for session to be available before sending.
     * This prevents 400 errors from the collector due to missing X-Faro-Session-Id header.
     *
     * Only waits if session tracking is enabled. If disabled, returns immediately.
     */
    waitForSession() {
        var _a, _b, _c, _d;
        // Only wait for session if session tracking is enabled
        const sessionTrackingEnabled = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.sessionTracking) === null || _b === void 0 ? void 0 : _b.enabled;
        if (!sessionTrackingEnabled) {
            return Promise.resolve();
        }
        // Already have session
        if (this.sessionReady) {
            return Promise.resolve();
        }
        // Check if session is now available
        const sessionMeta = (_d = (_c = this.metas) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.session;
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
        this.sessionReadyPromise = new Promise((resolve) => {
            var _a, _b;
            this.sessionReadyResolve = resolve;
            // Also check immediately in case session was set between our check and listener registration
            const sessionMeta = (_b = (_a = this.metas) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.session;
            if (sessionMeta === null || sessionMeta === void 0 ? void 0 : sessionMeta.id) {
                this.sessionReady = true;
                resolve();
                this.sessionReadyResolve = null;
            }
        });
        return this.sessionReadyPromise;
    }
    send(items) {
        return __awaiter(this, void 0, void 0, function* () {
            // DEBUG: Log at the very start of send
            this.logDebug(`FetchTransport.send() called with ${items.length} items`);
            try {
                const now = new Date(this.getNow());
                // Check if we're in backoff period
                if (this.disabledUntil > now) {
                    this.logDebug(`FetchTransport: in backoff period until ${this.disabledUntil}`);
                    return Promise.resolve();
                }
                // Wait for session to be ready before sending
                // This prevents 400 errors from missing X-Faro-Session-Id header
                yield this.waitForSession();
                yield this.promiseBuffer.add(() => {
                    const transportBody = getTransportBody(items);
                    const body = JSON.stringify(transportBody);
                    // DEBUG: Log measurement payloads to see what's being sent
                    if (transportBody.measurements && transportBody.measurements.length > 0) {
                        for (const m of transportBody.measurements) {
                            this.logDebug(`FetchTransport: measurement payload - type=${m.type}, values=${JSON.stringify(m.values)}`);
                        }
                    }
                    const { url, requestOptions, apiKey, userKey } = this.options;
                    const _a = requestOptions !== null && requestOptions !== void 0 ? requestOptions : {}, { headers } = _a, restOfRequestOptions = __rest(_a, ["headers"]);
                    let sessionId;
                    const sessionMeta = this.metas.value.session;
                    if (sessionMeta != null) {
                        sessionId = sessionMeta.id;
                    }
                    // DEBUG: Log fetch attempt
                    this.logDebug(`FetchTransport: sending ${items.length} items to ${url}`);
                    // Create an AbortController for timeout
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => {
                        controller.abort();
                        this.logDebug(`FetchTransport: request timed out after 10s`);
                    }, 10000);
                    return fetch(url, Object.assign({ method: 'POST', headers: Object.assign(Object.assign(Object.assign(Object.assign({ 'Content-Type': 'application/json' }, (headers !== null && headers !== void 0 ? headers : {})), (apiKey ? { 'x-api-key': apiKey } : {})), (userKey ? { 'user_key': userKey } : {})), (sessionId ? { 'x-faro-session-id': sessionId } : {})), body, signal: controller.signal }, (restOfRequestOptions !== null && restOfRequestOptions !== void 0 ? restOfRequestOptions : {})))
                        .then((response) => __awaiter(this, void 0, void 0, function* () {
                        clearTimeout(timeoutId);
                        // DEBUG: Log response status
                        this.logDebug(`FetchTransport: response status ${response.status}`);
                        // Reset failure counter on success
                        this.consecutiveFailures = 0;
                        if (response.status === TOO_MANY_REQUESTS) {
                            this.disabledUntil = this.getRetryAfterDate(response);
                            this.logDebug(`FetchTransport: rate limited, disabled until ${this.disabledUntil}`);
                        }
                        // Log non-success responses for debugging
                        if (response.status !== ACCEPTED && response.status !== 200) {
                            const text = yield response.text().catch(() => '');
                            this.logDebug(`FetchTransport: non-success response: ${response.status} ${text.slice(0, 200)}`);
                        }
                        return response;
                    }))
                        .catch((error) => {
                        clearTimeout(timeoutId);
                        // DEBUG: Log the error
                        this.logDebug(`FetchTransport: fetch failed - ${(error === null || error === void 0 ? void 0 : error.message) || error}`);
                        // Increment failure counter
                        this.consecutiveFailures++;
                        // After MAX_CONSECUTIVE_FAILURES, enable circuit breaker to prevent infinite loops
                        if (this.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
                            this.disabledUntil = new Date(this.getNow() + FAILURE_BACKOFF_MS);
                            // Reset counter so we can try again after backoff
                            this.consecutiveFailures = 0;
                            this.logDebug(`FetchTransport: circuit breaker activated, disabled for 30s`);
                        }
                        // Do NOT log errors to console - this causes infinite loops in React Native
                        // when the DevTools console override intercepts even unpatchedConsole calls
                    });
                });
            }
            catch (_a) {
                // Buffer full error - Do NOT log to console as it creates infinite loops
                // The error is typically "Task buffer full" when the device is offline
            }
        });
    }
    getIgnoreUrls() {
        var _a;
        return [this.options.url].concat((_a = this.config.ignoreUrls) !== null && _a !== void 0 ? _a : []);
    }
    isBatched() {
        return true;
    }
    getRetryAfterDate(response) {
        const now = this.getNow();
        const retryAfterHeader = response.headers.get('Retry-After');
        if (retryAfterHeader) {
            const delay = Number(retryAfterHeader);
            if (!isNaN(delay)) {
                return new Date(delay * 1000 + now);
            }
            const date = Date.parse(retryAfterHeader);
            if (!isNaN(date)) {
                return new Date(date);
            }
        }
        return new Date(now + this.rateLimitBackoffMs);
    }
}
//# sourceMappingURL=transport.js.map