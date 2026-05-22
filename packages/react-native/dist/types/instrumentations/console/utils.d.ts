import type { ExceptionStackFrame, LogArgsSerializer } from '@grafana/faro-core';
/**
 * Error details extracted from console.error arguments
 */
export interface ErrorDetails {
    value?: string;
    type?: string;
    stackFrames?: ExceptionStackFrame[];
}
/**
 * React Native-specific log args serializer that handles objects better
 * Converts objects to JSON strings instead of [object Object]
 */
export declare const reactNativeLogArgsSerializer: LogArgsSerializer;
/**
 * Extracts error details from an array of arguments
 * Similar to web SDK's getDetailsFromErrorArgs but adapted for React Native
 */
export declare function getDetailsFromErrorArgs(args: [unknown?, ...unknown[]]): ErrorDetails;
/**
 * Gets error details from console.error arguments
 * If first argument is an Error, extracts error details with stack frames
 * Otherwise, uses the provided serializer to stringify the arguments
 */
export declare function getDetailsFromConsoleErrorArgs(args: [unknown?, ...unknown[]], serializer: LogArgsSerializer): ErrorDetails;
