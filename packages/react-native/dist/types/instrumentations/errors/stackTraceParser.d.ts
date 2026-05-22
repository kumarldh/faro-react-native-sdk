import type { ExceptionStackFrame as StackFrame } from '@grafana/faro-core';
/**
 * Hermes (Android release) often reports the bundle segment as `address at index.android.bundle`
 * inside parentheses. The collector hashes `frame.filename` for uploaded maps; it must match the
 * source map `file` field (e.g. `index.android.bundle`), not the verbose Hermes label.
 */
export declare function normalizeHermesStackFilename(filename: string): string;
export interface ParsedStackFrame {
    function?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    isNative?: boolean;
    /** Set when the line matched Hermes/minified `func@line:col` (no path). */
    releaseLine?: boolean;
}
export interface StackFrameParseOptions {
    /**
     * Hermes / minified RN release lines use `func@line:col` with no file path. Those frames are tagged
     * with `releaseLine` and use this as `filename` (default `bundle.js`). Match the Metro plugin’s
     * source map `file` field (or `sourceMapFile` option there).
     */
    releaseBundleFilename?: string;
}
/**
 * Parse a single stack trace line into a structured frame
 */
export declare function parseStackTraceLine(line: string): ParsedStackFrame | null;
/**
 * Parse a full stack trace string into an array of structured frames
 */
export declare function parseStackTrace(stackTrace: string): ParsedStackFrame[];
/**
 * Convert parsed stack frames to Faro's StackFrame format
 */
export declare function toFaroStackFrames(parsedFrames: ParsedStackFrame[], options?: StackFrameParseOptions): StackFrame[];
/**
 * Extract and parse stack frames from an Error object
 */
export declare function getStackFramesFromError(error: Error, options?: StackFrameParseOptions): StackFrame[];
/**
 * Get platform-specific error context
 */
export declare function getPlatformErrorContext(): Record<string, string>;
/**
 * Enhance error with React Native specific information
 */
export declare function enhanceErrorWithContext(error: Error, additionalContext?: Record<string, string>, stackParseOptions?: StackFrameParseOptions): {
    error: Error;
    stackFrames: StackFrame[];
    context: Record<string, string>;
};
