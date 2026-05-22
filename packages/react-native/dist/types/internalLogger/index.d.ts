/**
 * Internal logger levels - copied from @grafana/faro-core to avoid bundling web code
 * Keep in sync with @grafana/faro-core's InternalLoggerLevel
 */
export declare enum InternalLoggerLevel {
    OFF = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3,
    VERBOSE = 4
}
/**
 * Log levels for console/logging - copied from @grafana/faro-core to avoid bundling web code
 * Keep in sync with @grafana/faro-core's LogLevel
 */
export declare enum LogLevel {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    LOG = "log",
    WARN = "warn",
    ERROR = "error"
}
export declare const defaultLogLevel = LogLevel.LOG;
export declare const allLogLevels: ReadonlyArray<Readonly<LogLevel>>;
