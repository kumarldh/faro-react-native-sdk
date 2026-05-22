/**
 * Error mechanism values (source of the error).
 * Aligns with Web SDK and market conventions (Datadog error.source, Sentry mechanism.type).
 */
export declare const ErrorMechanism: {
    readonly UNCAUGHT: "uncaught";
    readonly UNHANDLED_REJECTION: "unhandledrejection";
    readonly CONSOLE: "console";
    /** Used by CrashReportingInstrumentation */
    readonly CRASH: "crash";
    /** Used by ANRInstrumentation */
    readonly ANR: "anr";
};
export type ErrorMechanismType = (typeof ErrorMechanism)[keyof typeof ErrorMechanism];
/** Type for non-Error promise rejections (primitives, plain objects). Matches Web SDK. */
export declare const primitiveUnhandledType = "UnhandledRejection";
