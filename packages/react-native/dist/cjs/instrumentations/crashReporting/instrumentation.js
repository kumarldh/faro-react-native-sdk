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
exports.CrashReportingInstrumentation = void 0;
var react_native_1 = require("react-native");
var faro_core_1 = require("@grafana/faro-core");
var const_1 = require("../errors/const");
/**
 * Crash Reporting Instrumentation (Experimental).
 *
 * Retrieves crash reports from previous app sessions and sends them via Faro API.
 *
 * **Platform Support**:
 * - **Android**: Uses ApplicationExitInfo API (Android 11+ / API 30+)
 *   Captures: CRASH, CRASH_NATIVE, ANR, LOW_MEMORY, EXCESSIVE_RESOURCE_USAGE
 * - **iOS**: Uses PLCrashReporter (requires adding dependency to podspec)
 *   Captures: Signal crashes (SIGSEGV, SIGABRT, etc.) and Mach exceptions
 *
 * **Note**: This instrumentation only retrieves crash data from previous sessions.
 * The crash itself terminates the app, so the report is sent on next app launch.
 *
 * @example
 * ```typescript
 * import { initializeFaro, CrashReportingInstrumentation } from '@grafana/faro-react-native';
 *
 * initializeFaro({
 *   url: 'https://collector.example.com',
 *   instrumentations: [
 *     new CrashReportingInstrumentation(),
 *   ],
 * });
 * ```
 */
var CrashReportingInstrumentation = /** @class */ (function (_super) {
    __extends(CrashReportingInstrumentation, _super);
    function CrashReportingInstrumentation(options) {
        if (options === void 0) { options = {}; }
        var _a;
        var _this = _super.call(this) || this;
        _this.name = '@grafana/faro-react-native:instrumentation-crash';
        _this.version = faro_core_1.VERSION;
        _this.options = {
            enabled: (_a = options.enabled) !== null && _a !== void 0 ? _a : true,
        };
        return _this;
    }
    CrashReportingInstrumentation.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nativeModule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.options.enabled) {
                            this.logDebug('Crash reporting is disabled');
                            return [2 /*return*/];
                        }
                        nativeModule = this.getNativeModule();
                        if (!nativeModule) {
                            this.logWarn('Native module not available for crash reporting');
                            return [2 /*return*/];
                        }
                        this.logDebug('Initializing crash reporting instrumentation');
                        // Wait for session attributes to be populated before sending crash reports
                        // This ensures crash reports include full session metadata
                        return [4 /*yield*/, this.waitForSessionAttributes()];
                    case 1:
                        // Wait for session attributes to be populated before sending crash reports
                        // This ensures crash reports include full session metadata
                        _a.sent();
                        // Get crash reports from previous session
                        return [4 /*yield*/, this.processCrashReports(nativeModule)];
                    case 2:
                        // Get crash reports from previous session
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Wait for session attributes to be populated.
     *
     * Crash reports are sent in a new session, so we need to wait for
     * SessionInstrumentation to finish collecting device info, OS version, etc.
     * before sending the crash report. Otherwise, the crash report will be missing
     * session metadata.
     *
     * This checks for multiple device-specific attributes that are collected
     * asynchronously (device_id, device_os_detail, device_model_name) to ensure
     * the async getSessionAttributes() call has completed.
     *
     * @param maxWaitMs Maximum time to wait in milliseconds (default 10000ms)
     */
    CrashReportingInstrumentation.prototype.waitForSessionAttributes = function () {
        return __awaiter(this, arguments, void 0, function (maxWaitMs) {
            var startTime, pollInterval, checkCount, sessionAttrs, attrCount, attrKeys, hasDeviceId, hasDeviceOsDetail, hasDeviceModelName, elapsed, finalAttrs, finalAttrCount, finalAttrKeys;
            var _a, _b, _c, _d, _e, _f;
            if (maxWaitMs === void 0) { maxWaitMs = 10000; }
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        startTime = Date.now();
                        pollInterval = 200;
                        checkCount = 0;
                        _g.label = 1;
                    case 1:
                        if (!(Date.now() - startTime < maxWaitMs)) return [3 /*break*/, 3];
                        checkCount++;
                        try {
                            sessionAttrs = (_c = (_b = (_a = this.metas) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.session) === null || _c === void 0 ? void 0 : _c.attributes;
                            if (sessionAttrs) {
                                attrCount = Object.keys(sessionAttrs).length;
                                attrKeys = JSON.stringify(Object.keys(sessionAttrs));
                                hasDeviceId = 'device_id' in sessionAttrs && sessionAttrs['device_id'] !== 'unknown';
                                hasDeviceOsDetail = 'device_os_detail' in sessionAttrs && sessionAttrs['device_os_detail'] !== 'unknown';
                                hasDeviceModelName = 'device_model_name' in sessionAttrs;
                                if (hasDeviceId && hasDeviceOsDetail && hasDeviceModelName) {
                                    elapsed = Date.now() - startTime;
                                    this.logDebug("Session attributes ready after ".concat(elapsed, "ms (").concat(checkCount, " checks, ").concat(attrCount, " attrs)"));
                                    return [2 /*return*/];
                                }
                                else {
                                    this.logDebug("Check #".concat(checkCount, ": Found ").concat(attrCount, " session attributes: ").concat(attrKeys, " but still missing required attrs - device_id:").concat(hasDeviceId, ", device_os_detail:").concat(hasDeviceOsDetail, ", device_model_name:").concat(hasDeviceModelName));
                                }
                            }
                            else {
                                this.logDebug("Check #".concat(checkCount, ": No session attributes available yet"));
                            }
                        }
                        catch (error) {
                            // Continue waiting if we can't access metas yet
                            this.logDebug("Check #".concat(checkCount, ": Error accessing metas: ").concat(error));
                        }
                        // Wait before next check
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, pollInterval); })];
                    case 2:
                        // Wait before next check
                        _g.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        finalAttrs = (_f = (_e = (_d = this.metas) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.session) === null || _f === void 0 ? void 0 : _f.attributes;
                        finalAttrCount = finalAttrs ? Object.keys(finalAttrs).length : 0;
                        finalAttrKeys = finalAttrs ? JSON.stringify(Object.keys(finalAttrs)) : 'none';
                        this.logWarn("Session attributes not ready after ".concat(maxWaitMs, "ms timeout (").concat(checkCount, " checks, ").concat(finalAttrCount, " attrs: ").concat(finalAttrKeys, "). Sending crash report anyway."));
                        return [2 /*return*/];
                }
            });
        });
    };
    CrashReportingInstrumentation.prototype.getNativeModule = function () {
        var FaroReactNativeModule = react_native_1.NativeModules.FaroReactNativeModule;
        if (!FaroReactNativeModule) {
            return null;
        }
        return FaroReactNativeModule;
    };
    CrashReportingInstrumentation.prototype.processCrashReports = function (nativeModule) {
        return __awaiter(this, void 0, void 0, function () {
            var crashReports, _i, crashReports_1, crashJson, crash, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (typeof nativeModule.getCrashReport !== 'function') {
                            this.logDebug('getCrashReport method not available');
                            return [2 /*return*/];
                        }
                        this.logDebug('Attempting to retrieve crash reports from native module');
                        return [4 /*yield*/, nativeModule.getCrashReport()];
                    case 1:
                        crashReports = (_a.sent());
                        if (!crashReports || crashReports.length === 0) {
                            this.logDebug('No crash reports from previous session');
                            return [2 /*return*/];
                        }
                        this.logDebug("Processing ".concat(crashReports.length, " crash report(s) from previous session"));
                        for (_i = 0, crashReports_1 = crashReports; _i < crashReports_1.length; _i++) {
                            crashJson = crashReports_1[_i];
                            try {
                                this.logDebug("Parsing crash report JSON: ".concat(crashJson.substring(0, 200), "..."));
                                crash = JSON.parse(crashJson);
                                this.sendCrashReport(crash);
                            }
                            catch (parseError) {
                                // If parsing fails, still try to report something
                                this.logError('Failed to parse crash report JSON', parseError);
                                this.api.pushError(new Error('Application crash (parse error)'), {
                                    context: {
                                        mechanism: const_1.ErrorMechanism.CRASH,
                                        parseError: String(parseError),
                                        raw: crashJson.substring(0, 500), // Limit size
                                    },
                                    type: 'crash',
                                });
                            }
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.logError('Failed to process crash reports', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CrashReportingInstrumentation.prototype.sendCrashReport = function (crash) {
        var errorMessage = this.getErrorMessage(crash);
        var error = new Error(errorMessage);
        // Build context from crash data (matching Flutter pattern)
        var context = {
            mechanism: const_1.ErrorMechanism.CRASH,
        };
        if (crash.trace) {
            context['trace'] = crash.trace;
        }
        if (crash.signal) {
            context['signal'] = crash.signal;
        }
        if (crash.timestamp) {
            context['timestamp'] = String(crash.timestamp);
        }
        if (crash.description) {
            context['description'] = crash.description;
        }
        if (crash.processName) {
            context['processName'] = crash.processName;
        }
        if (crash.pid) {
            context['pid'] = String(crash.pid);
        }
        if (crash.importance !== undefined) {
            context['importance'] = String(crash.importance);
        }
        // Push as error via Faro API (matching Flutter pattern)
        this.api.pushError(error, {
            type: 'crash',
            context: context,
        });
        this.logDebug("Reported crash: ".concat(crash.reason, " at ").concat(crash.timestamp));
    };
    /**
     * Build error message matching Flutter SDK format:
     * "{reason}: {description}, status: {status}"
     */
    CrashReportingInstrumentation.prototype.getErrorMessage = function (crash) {
        var _a;
        var reason = crash.reason || 'UNKNOWN';
        var status = (_a = crash.status) !== null && _a !== void 0 ? _a : 0;
        var description;
        switch (crash.reason) {
            case 'ANR':
                description = 'Application Not Responding';
                break;
            case 'CRASH':
                description = 'Application crash (Java/Kotlin)';
                break;
            case 'CRASH_NATIVE':
                description = 'Application crash (Native)';
                break;
            case 'LOW_MEMORY':
                description = 'Application terminated due to low memory';
                break;
            case 'EXCESSIVE_RESOURCE_USAGE':
                description = 'Application terminated due to excessive resource usage';
                break;
            case 'INITIALIZATION_FAILURE':
                description = 'Application failed to initialize';
                break;
            default:
                description = crash.description || 'Application crash';
                break;
        }
        return "".concat(reason, ": ").concat(description, ", status: ").concat(status);
    };
    return CrashReportingInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.CrashReportingInstrumentation = CrashReportingInstrumentation;
//# sourceMappingURL=instrumentation.js.map