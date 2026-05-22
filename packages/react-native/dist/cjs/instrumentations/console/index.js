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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleInstrumentation = void 0;
var faro_core_1 = require("@grafana/faro-core");
var const_1 = require("../errors/const");
var utils_1 = require("./utils");
/**
 * Console instrumentation for React Native
 * Captures console logs and errors
 *
 * Features:
 * - Configurable log levels
 * - Advanced error serialization
 * - Option to treat console.error as log or error
 * - Unpatch support for cleanup
 */
var ConsoleInstrumentation = /** @class */ (function (_super) {
    __extends(ConsoleInstrumentation, _super);
    function ConsoleInstrumentation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = '@grafana/faro-react-native:instrumentation-console';
        _this.version = faro_core_1.VERSION;
        _this.originalConsole = {};
        _this.errorSerializer = utils_1.reactNativeLogArgsSerializer;
        _this.patchedLevels = [];
        _this.isProcessing = false;
        return _this;
    }
    ConsoleInstrumentation.prototype.initialize = function () {
        var _this = this;
        var _a, _b;
        var instrumentationOptions = this.config.consoleInstrumentation;
        // Configure error serialization
        var serializeErrors = (instrumentationOptions === null || instrumentationOptions === void 0 ? void 0 : instrumentationOptions.serializeErrors) || !!(instrumentationOptions === null || instrumentationOptions === void 0 ? void 0 : instrumentationOptions.errorSerializer);
        this.errorSerializer = serializeErrors
            ? ((_a = instrumentationOptions === null || instrumentationOptions === void 0 ? void 0 : instrumentationOptions.errorSerializer) !== null && _a !== void 0 ? _a : faro_core_1.defaultErrorArgsSerializer)
            : utils_1.reactNativeLogArgsSerializer;
        // Store original console methods - use unpatchedConsole from config if available
        // to avoid capturing React Native's patched console (LogBox, DevTools)
        var sourceConsole = (_b = this.config.unpatchedConsole) !== null && _b !== void 0 ? _b : console;
        faro_core_1.allLogLevels.forEach(function (level) {
            _this.originalConsole[level] = sourceConsole[level];
        });
        // Determine which levels to patch
        this.patchedLevels = faro_core_1.allLogLevels.filter(function (level) { var _a; return !((_a = instrumentationOptions === null || instrumentationOptions === void 0 ? void 0 : instrumentationOptions.disabledLevels) !== null && _a !== void 0 ? _a : ConsoleInstrumentation.defaultDisabledLevels).includes(level); });
        // Patch console methods
        this.patchedLevels.forEach(function (level) {
            console[level] = function () {
                var _a, _b, _c, _d;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // Prevent re-entry to avoid infinite loops
                if (_this.isProcessing) {
                    (_b = (_a = _this.originalConsole)[level]) === null || _b === void 0 ? void 0 : _b.call.apply(_b, __spreadArray([_a], args, false));
                    return;
                }
                _this.isProcessing = true;
                try {
                    if (level === faro_core_1.LogLevel.ERROR && !(instrumentationOptions === null || instrumentationOptions === void 0 ? void 0 : instrumentationOptions.consoleErrorAsLog)) {
                        // Handle console.error as an error with advanced serialization
                        var _e = (0, utils_1.getDetailsFromConsoleErrorArgs)(args, _this.errorSerializer), value = _e.value, type = _e.type, stackFrames = _e.stackFrames;
                        var context = { mechanism: const_1.ErrorMechanism.CONSOLE };
                        if (value && !type && !stackFrames) {
                            // Simple error without stack frames
                            _this.api.pushError(new Error(ConsoleInstrumentation.consoleErrorPrefix + value), { context: context });
                        }
                        else {
                            // Error with type and/or stack frames (type from error.name, matches Web SDK)
                            _this.api.pushError(new Error(ConsoleInstrumentation.consoleErrorPrefix + (value !== null && value !== void 0 ? value : '')), {
                                context: context,
                                type: type,
                                stackFrames: stackFrames,
                            });
                        }
                    }
                    else if (level === faro_core_1.LogLevel.ERROR && (instrumentationOptions === null || instrumentationOptions === void 0 ? void 0 : instrumentationOptions.consoleErrorAsLog)) {
                        // Handle console.error as a log with error details in context
                        var _f = (0, utils_1.getDetailsFromConsoleErrorArgs)(args, _this.errorSerializer), value = _f.value, type = _f.type, stackFrames = _f.stackFrames;
                        _this.api.pushLog(value ? [ConsoleInstrumentation.consoleErrorPrefix + value] : args, {
                            level: level,
                            context: {
                                value: value !== null && value !== void 0 ? value : '',
                                type: type !== null && type !== void 0 ? type : '',
                                stackFrames: (stackFrames === null || stackFrames === void 0 ? void 0 : stackFrames.length) ? (0, faro_core_1.defaultErrorArgsSerializer)(stackFrames) : '',
                            },
                        });
                    }
                    else {
                        // Handle other log levels normally
                        _this.api.pushLog(args, { level: level });
                    }
                }
                catch (_err) {
                    // Silently ignore errors to prevent infinite loops during bootstrap
                }
                finally {
                    // Always call original console method (still protected by isProcessing flag)
                    (_d = (_c = _this.originalConsole)[level]) === null || _d === void 0 ? void 0 : _d.call.apply(_d, __spreadArray([_c], args, false));
                    _this.isProcessing = false;
                }
            };
        });
    };
    /**
     * Restore original console methods
     * Call this to clean up and unpatch the console
     */
    ConsoleInstrumentation.prototype.unpatch = function () {
        var _this = this;
        this.patchedLevels.forEach(function (level) {
            if (_this.originalConsole[level]) {
                console[level] = _this.originalConsole[level];
            }
        });
        this.patchedLevels = [];
    };
    ConsoleInstrumentation.defaultDisabledLevels = [faro_core_1.LogLevel.DEBUG, faro_core_1.LogLevel.TRACE, faro_core_1.LogLevel.LOG];
    ConsoleInstrumentation.consoleErrorPrefix = 'console.error: ';
    return ConsoleInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.ConsoleInstrumentation = ConsoleInstrumentation;
//# sourceMappingURL=index.js.map