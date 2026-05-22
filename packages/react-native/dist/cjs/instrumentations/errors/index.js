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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorsInstrumentation = exports.ErrorMechanism = void 0;
var faro_core_1 = require("@grafana/faro-core");
var const_1 = require("./const");
var const_2 = require("./const");
Object.defineProperty(exports, "ErrorMechanism", { enumerable: true, get: function () { return const_2.ErrorMechanism; } });
var stackTraceParser_1 = require("./stackTraceParser");
/**
 * Errors instrumentation for React Native
 *
 * Features:
 * - Captures unhandled errors and promise rejections using ErrorUtils
 * - Parses React Native stack traces (dev, release, Metro bundler formats)
 * - Adds platform context (OS, version, Hermes engine)
 * - Error deduplication to prevent duplicate reports
 * - Configurable error filtering
 *
 * @example
 * ```tsx
 * import { ErrorsInstrumentation, initializeFaro } from '@grafana/faro-react-native';
 *
 * await initializeFaro({
 *   // ...config
 *   instrumentations: [
 *     new ErrorsInstrumentation({
 *       ignoreErrors: [/network timeout/i, /cancelled/i],
 *       enableDeduplication: true,
 *       deduplicationWindow: 5000,
 *     }),
 *   ],
 * });
 * ```
 */
var ErrorsInstrumentation = /** @class */ (function (_super) {
    __extends(ErrorsInstrumentation, _super);
    function ErrorsInstrumentation(options) {
        if (options === void 0) { options = {}; }
        var _a, _b, _c, _d;
        var _this = _super.call(this) || this;
        _this.name = '@grafana/faro-react-native-errors';
        _this.version = '1.0.0';
        _this.errorFingerprints = [];
        _this.options = {
            ignoreErrors: (_a = options.ignoreErrors) !== null && _a !== void 0 ? _a : [],
            enableDeduplication: (_b = options.enableDeduplication) !== null && _b !== void 0 ? _b : true,
            deduplicationWindow: (_c = options.deduplicationWindow) !== null && _c !== void 0 ? _c : 5000,
            maxDeduplicationEntries: (_d = options.maxDeduplicationEntries) !== null && _d !== void 0 ? _d : 50,
            releaseBundleFilename: options.releaseBundleFilename,
        };
        return _this;
    }
    ErrorsInstrumentation.prototype.initialize = function () {
        // Capture unhandled JavaScript errors
        this.setupGlobalErrorHandler();
        // Capture unhandled promise rejections
        this.setupUnhandledRejectionHandler();
    };
    ErrorsInstrumentation.prototype.setupGlobalErrorHandler = function () {
        var _this = this;
        // Store the original error handler
        this.originalErrorHandler = global.ErrorUtils.getGlobalHandler();
        // Set our custom handler
        global.ErrorUtils.setGlobalHandler(function (error, isFatal) {
            try {
                // Check if error should be ignored
                if (_this.shouldIgnoreError(error)) {
                    return;
                }
                // Check for duplicate errors
                if (_this.options.enableDeduplication && _this.isDuplicateError(error)) {
                    return;
                }
                // Enhance error with React Native context and stack frames
                var _a = (0, stackTraceParser_1.enhanceErrorWithContext)(error, {
                    mechanism: const_1.ErrorMechanism.UNCAUGHT,
                    isFatal: String(isFatal !== null && isFatal !== void 0 ? isFatal : false),
                }, { releaseBundleFilename: _this.options.releaseBundleFilename }), enhancedError = _a.error, stackFrames = _a.stackFrames, context = _a.context;
                // Push error to Faro with enhanced data (type from error.name, matches Web SDK)
                _this.api.pushError(enhancedError, {
                    type: enhancedError.name || 'Error',
                    context: context,
                    stackFrames: stackFrames,
                });
                // Track error fingerprint for deduplication
                if (_this.options.enableDeduplication) {
                    _this.addErrorFingerprint(error);
                }
            }
            catch (_e) {
                // Don't let error reporting cause more errors
            }
            finally {
                // Always call the original handler to maintain normal error behavior
                if (_this.originalErrorHandler) {
                    _this.originalErrorHandler(error, isFatal);
                }
            }
        });
    };
    ErrorsInstrumentation.prototype.setupUnhandledRejectionHandler = function () {
        var _this = this;
        var _a;
        // React Native supports the standard unhandledrejection event
        this.unhandledRejectionListener = function (event) {
            try {
                var reason = event.reason;
                // Convert reason to an Error if it isn't one (matches Web SDK approach)
                var isPrimitiveRejection = !(reason instanceof Error);
                var error = void 0;
                if (reason instanceof Error) {
                    error = reason;
                }
                else {
                    error = new Error("Unhandled Promise Rejection: ".concat(typeof reason === 'object' ? JSON.stringify(reason) : String(reason)));
                }
                // Check if error should be ignored
                if (_this.shouldIgnoreError(error)) {
                    return;
                }
                // Check for duplicate errors
                if (_this.options.enableDeduplication && _this.isDuplicateError(error)) {
                    return;
                }
                // Enhance error with React Native context and stack frames
                var _a = (0, stackTraceParser_1.enhanceErrorWithContext)(error, {
                    mechanism: const_1.ErrorMechanism.UNHANDLED_REJECTION,
                }, { releaseBundleFilename: _this.options.releaseBundleFilename }), enhancedError = _a.error, stackFrames = _a.stackFrames, context = _a.context;
                // Type: use actual error type for Error objects; 'UnhandledRejection' for primitives (Web SDK)
                var errorType = isPrimitiveRejection ? const_1.primitiveUnhandledType : enhancedError.name || 'Error';
                _this.api.pushError(enhancedError, {
                    type: errorType,
                    context: context,
                    stackFrames: stackFrames,
                });
                // Track error fingerprint for deduplication
                if (_this.options.enableDeduplication) {
                    _this.addErrorFingerprint(error);
                }
            }
            catch (_e) {
                // Don't let error reporting cause more errors
            }
        };
        // Add the listener
        (_a = global.addEventListener) === null || _a === void 0 ? void 0 : _a.call(global, 'unhandledrejection', this.unhandledRejectionListener);
    };
    /**
     * Check if error should be ignored based on ignoreErrors patterns
     */
    ErrorsInstrumentation.prototype.shouldIgnoreError = function (error) {
        if (!error || !error.message) {
            return false;
        }
        return this.options.ignoreErrors.some(function (pattern) { return pattern.test(error.message); });
    };
    /**
     * Check if error is a duplicate based on message and stack
     */
    ErrorsInstrumentation.prototype.isDuplicateError = function (error) {
        var _this = this;
        var message = error.message || '';
        var stack = error.stack || '';
        var now = Date.now();
        // Clean up old entries first
        this.cleanupOldFingerprints(now);
        // Check if we've seen this error recently
        return this.errorFingerprints.some(function (fingerprint) {
            return (fingerprint.message === message &&
                fingerprint.stack === stack &&
                now - fingerprint.timestamp < _this.options.deduplicationWindow);
        });
    };
    /**
     * Add error fingerprint for deduplication tracking
     */
    ErrorsInstrumentation.prototype.addErrorFingerprint = function (error) {
        var message = error.message || '';
        var stack = error.stack || '';
        var timestamp = Date.now();
        this.errorFingerprints.push({ message: message, stack: stack, timestamp: timestamp });
        // Limit the number of tracked fingerprints
        if (this.errorFingerprints.length > this.options.maxDeduplicationEntries) {
            this.errorFingerprints.shift();
        }
    };
    /**
     * Remove error fingerprints older than the deduplication window
     */
    ErrorsInstrumentation.prototype.cleanupOldFingerprints = function (now) {
        var _this = this;
        this.errorFingerprints = this.errorFingerprints.filter(function (fingerprint) { return now - fingerprint.timestamp < _this.options.deduplicationWindow; });
    };
    ErrorsInstrumentation.prototype.unpatch = function () {
        var _a;
        // Restore original error handler
        if (this.originalErrorHandler) {
            global.ErrorUtils.setGlobalHandler(this.originalErrorHandler);
        }
        // Remove unhandled rejection listener
        if (this.unhandledRejectionListener) {
            (_a = global.removeEventListener) === null || _a === void 0 ? void 0 : _a.call(global, 'unhandledrejection', this.unhandledRejectionListener);
        }
        // Clear deduplication tracking
        this.errorFingerprints = [];
    };
    return ErrorsInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.ErrorsInstrumentation = ErrorsInstrumentation;
//# sourceMappingURL=index.js.map