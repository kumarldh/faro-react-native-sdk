/**
 * Error mechanism values (source of the error).
 * Aligns with Web SDK and market conventions (Datadog error.source, Sentry mechanism.type).
 */
export const ErrorMechanism = {
    UNCAUGHT: 'uncaught',
    UNHANDLED_REJECTION: 'unhandledrejection',
    CONSOLE: 'console',
    /** Used by CrashReportingInstrumentation */
    CRASH: 'crash',
    /** Used by ANRInstrumentation */
    ANR: 'anr',
};
/** Type for non-Error promise rejections (primitives, plain objects). Matches Web SDK. */
export const primitiveUnhandledType = 'UnhandledRejection';
//# sourceMappingURL=const.js.map