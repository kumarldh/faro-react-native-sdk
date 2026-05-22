import { allLogLevels, BaseInstrumentation, defaultErrorArgsSerializer, LogLevel, VERSION } from '@grafana/faro-core';
import { ErrorMechanism } from '../errors/const';
import { getDetailsFromConsoleErrorArgs, reactNativeLogArgsSerializer } from './utils';
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
export class ConsoleInstrumentation extends BaseInstrumentation {
    constructor() {
        super(...arguments);
        this.name = '@grafana/faro-react-native:instrumentation-console';
        this.version = VERSION;
        this.originalConsole = {};
        this.errorSerializer = reactNativeLogArgsSerializer;
        this.patchedLevels = [];
        this.isProcessing = false;
    }
    initialize() {
        var _a, _b;
        const instrumentationOptions = this.config.consoleInstrumentation;
        // Configure error serialization
        const serializeErrors = (instrumentationOptions === null || instrumentationOptions === void 0 ? void 0 : instrumentationOptions.serializeErrors) || !!(instrumentationOptions === null || instrumentationOptions === void 0 ? void 0 : instrumentationOptions.errorSerializer);
        this.errorSerializer = serializeErrors
            ? ((_a = instrumentationOptions === null || instrumentationOptions === void 0 ? void 0 : instrumentationOptions.errorSerializer) !== null && _a !== void 0 ? _a : defaultErrorArgsSerializer)
            : reactNativeLogArgsSerializer;
        // Store original console methods - use unpatchedConsole from config if available
        // to avoid capturing React Native's patched console (LogBox, DevTools)
        const sourceConsole = (_b = this.config.unpatchedConsole) !== null && _b !== void 0 ? _b : console;
        allLogLevels.forEach((level) => {
            this.originalConsole[level] = sourceConsole[level];
        });
        // Determine which levels to patch
        this.patchedLevels = allLogLevels.filter((level) => { var _a; return !((_a = instrumentationOptions === null || instrumentationOptions === void 0 ? void 0 : instrumentationOptions.disabledLevels) !== null && _a !== void 0 ? _a : ConsoleInstrumentation.defaultDisabledLevels).includes(level); });
        // Patch console methods
        this.patchedLevels.forEach((level) => {
            console[level] = (...args) => {
                var _a, _b, _c, _d;
                // Prevent re-entry to avoid infinite loops
                if (this.isProcessing) {
                    (_b = (_a = this.originalConsole)[level]) === null || _b === void 0 ? void 0 : _b.call(_a, ...args);
                    return;
                }
                this.isProcessing = true;
                try {
                    if (level === LogLevel.ERROR && !(instrumentationOptions === null || instrumentationOptions === void 0 ? void 0 : instrumentationOptions.consoleErrorAsLog)) {
                        // Handle console.error as an error with advanced serialization
                        const { value, type, stackFrames } = getDetailsFromConsoleErrorArgs(args, this.errorSerializer);
                        const context = { mechanism: ErrorMechanism.CONSOLE };
                        if (value && !type && !stackFrames) {
                            // Simple error without stack frames
                            this.api.pushError(new Error(ConsoleInstrumentation.consoleErrorPrefix + value), { context });
                        }
                        else {
                            // Error with type and/or stack frames (type from error.name, matches Web SDK)
                            this.api.pushError(new Error(ConsoleInstrumentation.consoleErrorPrefix + (value !== null && value !== void 0 ? value : '')), {
                                context,
                                type,
                                stackFrames,
                            });
                        }
                    }
                    else if (level === LogLevel.ERROR && (instrumentationOptions === null || instrumentationOptions === void 0 ? void 0 : instrumentationOptions.consoleErrorAsLog)) {
                        // Handle console.error as a log with error details in context
                        const { value, type, stackFrames } = getDetailsFromConsoleErrorArgs(args, this.errorSerializer);
                        this.api.pushLog(value ? [ConsoleInstrumentation.consoleErrorPrefix + value] : args, {
                            level,
                            context: {
                                value: value !== null && value !== void 0 ? value : '',
                                type: type !== null && type !== void 0 ? type : '',
                                stackFrames: (stackFrames === null || stackFrames === void 0 ? void 0 : stackFrames.length) ? defaultErrorArgsSerializer(stackFrames) : '',
                            },
                        });
                    }
                    else {
                        // Handle other log levels normally
                        this.api.pushLog(args, { level });
                    }
                }
                catch (_err) {
                    // Silently ignore errors to prevent infinite loops during bootstrap
                }
                finally {
                    // Always call original console method (still protected by isProcessing flag)
                    (_d = (_c = this.originalConsole)[level]) === null || _d === void 0 ? void 0 : _d.call(_c, ...args);
                    this.isProcessing = false;
                }
            };
        });
    }
    /**
     * Restore original console methods
     * Call this to clean up and unpatch the console
     */
    unpatch() {
        this.patchedLevels.forEach((level) => {
            if (this.originalConsole[level]) {
                console[level] = this.originalConsole[level];
            }
        });
        this.patchedLevels = [];
    }
}
ConsoleInstrumentation.defaultDisabledLevels = [LogLevel.DEBUG, LogLevel.TRACE, LogLevel.LOG];
ConsoleInstrumentation.consoleErrorPrefix = 'console.error: ';
//# sourceMappingURL=index.js.map