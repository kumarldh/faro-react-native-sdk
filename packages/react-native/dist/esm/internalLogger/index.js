/**
 * Internal logger levels - copied from @grafana/faro-core to avoid bundling web code
 * Keep in sync with @grafana/faro-core's InternalLoggerLevel
 */
export var InternalLoggerLevel;
(function (InternalLoggerLevel) {
    InternalLoggerLevel[InternalLoggerLevel["OFF"] = 0] = "OFF";
    InternalLoggerLevel[InternalLoggerLevel["ERROR"] = 1] = "ERROR";
    InternalLoggerLevel[InternalLoggerLevel["WARN"] = 2] = "WARN";
    InternalLoggerLevel[InternalLoggerLevel["INFO"] = 3] = "INFO";
    InternalLoggerLevel[InternalLoggerLevel["VERBOSE"] = 4] = "VERBOSE";
})(InternalLoggerLevel || (InternalLoggerLevel = {}));
/**
 * Log levels for console/logging - copied from @grafana/faro-core to avoid bundling web code
 * Keep in sync with @grafana/faro-core's LogLevel
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel["TRACE"] = "trace";
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["LOG"] = "log";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (LogLevel = {}));
export const defaultLogLevel = LogLevel.LOG;
export const allLogLevels = [
    LogLevel.TRACE,
    LogLevel.DEBUG,
    LogLevel.INFO,
    LogLevel.LOG,
    LogLevel.WARN,
    LogLevel.ERROR,
];
//# sourceMappingURL=index.js.map