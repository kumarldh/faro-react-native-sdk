import { isError, isObject, isString } from '@grafana/faro-core';
/**
 * React Native-specific log args serializer that handles objects better
 * Converts objects to JSON strings instead of [object Object]
 */
export const reactNativeLogArgsSerializer = (args) => args
    .map((arg) => {
    try {
        // Handle null and undefined
        if (arg === null)
            return 'null';
        if (arg === undefined)
            return 'undefined';
        // Handle Error objects
        if (isError(arg)) {
            return `${arg.name}: ${arg.message}`;
        }
        // Handle objects and arrays - stringify them
        if (isObject(arg) || Array.isArray(arg)) {
            try {
                return JSON.stringify(arg);
            }
            catch (_a) {
                return String(arg);
            }
        }
        // Handle primitives
        return String(arg);
    }
    catch (_err) {
        return '';
    }
})
    .join(' ');
/**
 * Gets stack frames from an Error object
 * React Native errors have a `stack` property as a string
 */
function getStackFramesFromError(error) {
    if (!error.stack) {
        return [];
    }
    // Parse React Native stack trace format
    // Example format:
    // "Error: message\n    at functionName (file.js:10:5)\n    at anotherFunction (file.js:20:10)"
    const stackFrames = [];
    const lines = error.stack.split('\n').slice(1); // Skip first line (error message)
    for (const line of lines) {
        // Match patterns like:
        // "    at functionName (file.js:10:5)"
        // "    at file.js:10:5"
        const match = line.match(/^\s*at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?$/);
        if (match) {
            const [, functionName, filename, lineNo, colNo] = match;
            stackFrames.push({
                filename: (filename === null || filename === void 0 ? void 0 : filename.trim()) || '<anonymous>',
                function: (functionName === null || functionName === void 0 ? void 0 : functionName.trim()) || '<anonymous>',
                lineno: lineNo ? parseInt(lineNo, 10) : undefined,
                colno: colNo ? parseInt(colNo, 10) : undefined,
            });
        }
    }
    return stackFrames;
}
/**
 * Extracts error details from Error object
 */
function getErrorDetails(error) {
    var _a;
    let value;
    let type;
    let stackFrames = [];
    if (isError(error)) {
        value = error.message;
        type = error.name;
        stackFrames = getStackFramesFromError(error);
    }
    else if (isObject(error)) {
        // Handle error-like objects
        value = String(error);
        const errorObj = error;
        type =
            errorObj && typeof errorObj === 'object' && 'constructor' in errorObj
                ? (_a = errorObj.constructor) === null || _a === void 0 ? void 0 : _a.name
                : undefined;
    }
    return [value, type, stackFrames];
}
/**
 * Extracts error details from an array of arguments
 * Similar to web SDK's getDetailsFromErrorArgs but adapted for React Native
 */
export function getDetailsFromErrorArgs(args) {
    const [firstArg] = args;
    let value;
    let type;
    let stackFrames = [];
    if (isError(firstArg)) {
        [value, type, stackFrames] = getErrorDetails(firstArg);
    }
    else if (isString(firstArg)) {
        value = firstArg;
    }
    else if (isObject(firstArg)) {
        try {
            value = JSON.stringify(firstArg);
        }
        catch (_a) {
            value = String(firstArg);
        }
    }
    return { value, type, stackFrames };
}
/**
 * Gets error details from console.error arguments
 * If first argument is an Error, extracts error details with stack frames
 * Otherwise, uses the provided serializer to stringify the arguments
 */
export function getDetailsFromConsoleErrorArgs(args, serializer) {
    if (isError(args[0])) {
        return getDetailsFromErrorArgs(args);
    }
    else {
        return { value: serializer(args) };
    }
}
//# sourceMappingURL=utils.js.map