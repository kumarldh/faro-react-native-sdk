"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactNativeLogArgsSerializer = void 0;
exports.getDetailsFromErrorArgs = getDetailsFromErrorArgs;
exports.getDetailsFromConsoleErrorArgs = getDetailsFromConsoleErrorArgs;
var faro_core_1 = require("@grafana/faro-core");
/**
 * React Native-specific log args serializer that handles objects better
 * Converts objects to JSON strings instead of [object Object]
 */
var reactNativeLogArgsSerializer = function (args) {
    return args
        .map(function (arg) {
        try {
            // Handle null and undefined
            if (arg === null)
                return 'null';
            if (arg === undefined)
                return 'undefined';
            // Handle Error objects
            if ((0, faro_core_1.isError)(arg)) {
                return "".concat(arg.name, ": ").concat(arg.message);
            }
            // Handle objects and arrays - stringify them
            if ((0, faro_core_1.isObject)(arg) || Array.isArray(arg)) {
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
};
exports.reactNativeLogArgsSerializer = reactNativeLogArgsSerializer;
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
    var stackFrames = [];
    var lines = error.stack.split('\n').slice(1); // Skip first line (error message)
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        // Match patterns like:
        // "    at functionName (file.js:10:5)"
        // "    at file.js:10:5"
        var match = line.match(/^\s*at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?$/);
        if (match) {
            var functionName = match[1], filename = match[2], lineNo = match[3], colNo = match[4];
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
    var value;
    var type;
    var stackFrames = [];
    if ((0, faro_core_1.isError)(error)) {
        value = error.message;
        type = error.name;
        stackFrames = getStackFramesFromError(error);
    }
    else if ((0, faro_core_1.isObject)(error)) {
        // Handle error-like objects
        value = String(error);
        var errorObj = error;
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
function getDetailsFromErrorArgs(args) {
    var _a;
    var firstArg = args[0];
    var value;
    var type;
    var stackFrames = [];
    if ((0, faro_core_1.isError)(firstArg)) {
        _a = getErrorDetails(firstArg), value = _a[0], type = _a[1], stackFrames = _a[2];
    }
    else if ((0, faro_core_1.isString)(firstArg)) {
        value = firstArg;
    }
    else if ((0, faro_core_1.isObject)(firstArg)) {
        try {
            value = JSON.stringify(firstArg);
        }
        catch (_b) {
            value = String(firstArg);
        }
    }
    return { value: value, type: type, stackFrames: stackFrames };
}
/**
 * Gets error details from console.error arguments
 * If first argument is an Error, extracts error details with stack frames
 * Otherwise, uses the provided serializer to stringify the arguments
 */
function getDetailsFromConsoleErrorArgs(args, serializer) {
    if ((0, faro_core_1.isError)(args[0])) {
        return getDetailsFromErrorArgs(args);
    }
    else {
        return { value: serializer(args) };
    }
}
//# sourceMappingURL=utils.js.map