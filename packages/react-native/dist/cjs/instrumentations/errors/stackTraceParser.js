"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeHermesStackFilename = normalizeHermesStackFilename;
exports.parseStackTraceLine = parseStackTraceLine;
exports.parseStackTrace = parseStackTrace;
exports.toFaroStackFrames = toFaroStackFrames;
exports.getStackFramesFromError = getStackFramesFromError;
exports.getPlatformErrorContext = getPlatformErrorContext;
exports.enhanceErrorWithContext = enhanceErrorWithContext;
var react_native_1 = require("react-native");
/**
 * Parse React Native stack traces into structured stack frames
 *
 * React Native stack traces have different formats depending on platform and environment:
 *
 * iOS/Android (Dev):
 *   at functionName (file.js:123:45)
 *   at anonymous (native)
 *
 * iOS/Android (Release):
 *   functionName@123:456
 *   @[native code]
 *
 * Metro bundler:
 *   at Object.functionName (/path/to/file.js:123:456)
 */
var REACT_NATIVE_STACK_REGEX = /^\s*at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)$/;
var REACT_NATIVE_NATIVE_REGEX = /^\s*at\s+(.+?)\s+\(native\)$/;
var REACT_NATIVE_RELEASE_REGEX = /^(.+?)@(\d+):(\d+)$/;
var REACT_NATIVE_ANONYMOUS_REGEX = /^\s*at\s+anonymous\s+\((.+?):(\d+):(\d+)\)$/;
var METRO_BUNDLER_REGEX = /^\s*at\s+(?:Object\.)?(.+?)\s+\((.+?):(\d+):(\d+)\)$/;
/**
 * Hermes (Android release) often reports the bundle segment as `address at index.android.bundle`
 * inside parentheses. The collector hashes `frame.filename` for uploaded maps; it must match the
 * source map `file` field (e.g. `index.android.bundle`), not the verbose Hermes label.
 */
function normalizeHermesStackFilename(filename) {
    var _a, _b;
    var trimmed = filename.trim();
    var m = /^address\s+at\s+(.+)$/i.exec(trimmed);
    return (_b = (_a = m === null || m === void 0 ? void 0 : m[1]) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : filename;
}
/**
 * iOS Simulator (and Android) stacks often carry full filesystem paths such as
 * `…/Foo.app/main.jsbundle` while uploaded maps are keyed by the bundle basename (`main.jsbundle`)
 * that matches Metro’s source map `file` field — same as ingest’s bundle lookup hashes.
 */
function collapseBundledArtifactPath(filename, releaseBasename) {
    var key = releaseBasename.trim();
    if (!key || filename === key) {
        return filename;
    }
    var suffix = "/".concat(key);
    return filename.endsWith(suffix) ? key : filename;
}
var UNKNOWN_RELEASE_FILENAME = '<unknown>';
/**
 * Parse a single stack trace line into a structured frame and record how it was parsed.
 */
function parseStackTraceLineDetailed(line) {
    if (!line || typeof line !== 'string') {
        return { frame: null, kind: 'unparsed' };
    }
    var trimmedLine = line.trim();
    if (!trimmedLine) {
        return { frame: null, kind: 'unparsed' };
    }
    // Try standard React Native format: at functionName (file.js:123:45)
    var match = trimmedLine.match(REACT_NATIVE_STACK_REGEX);
    if (match && match[2] && match[3] && match[4]) {
        return {
            kind: 'react_native_paren',
            frame: {
                function: match[1] || '<anonymous>',
                filename: normalizeHermesStackFilename(match[2]),
                lineno: parseInt(match[3], 10),
                colno: parseInt(match[4], 10),
            },
        };
    }
    // Try Metro bundler format: at Object.functionName (/path/to/file.js:123:456)
    match = trimmedLine.match(METRO_BUNDLER_REGEX);
    if (match && match[2] && match[3] && match[4]) {
        return {
            kind: 'metro_paren',
            frame: {
                function: match[1] || '<anonymous>',
                filename: normalizeHermesStackFilename(match[2]),
                lineno: parseInt(match[3], 10),
                colno: parseInt(match[4], 10),
            },
        };
    }
    // Try anonymous format: at anonymous (file.js:123:45)
    match = trimmedLine.match(REACT_NATIVE_ANONYMOUS_REGEX);
    if (match && match[1] && match[2] && match[3]) {
        return {
            kind: 'anonymous_paren',
            frame: {
                function: '<anonymous>',
                filename: normalizeHermesStackFilename(match[1]),
                lineno: parseInt(match[2], 10),
                colno: parseInt(match[3], 10),
            },
        };
    }
    // Try native format: at functionName (native)
    match = trimmedLine.match(REACT_NATIVE_NATIVE_REGEX);
    if (match) {
        return {
            kind: 'native',
            frame: {
                function: match[1] || '<native>',
                filename: '<native>',
                isNative: true,
            },
        };
    }
    // Try release/minified format: functionName@123:456
    match = trimmedLine.match(REACT_NATIVE_RELEASE_REGEX);
    if (match && match[2] && match[3]) {
        return {
            kind: 'release_func_at',
            frame: {
                function: match[1] || '<anonymous>',
                filename: UNKNOWN_RELEASE_FILENAME,
                lineno: parseInt(match[2], 10),
                colno: parseInt(match[3], 10),
                releaseLine: true,
            },
        };
    }
    return { frame: null, kind: 'unparsed' };
}
/**
 * Parse a single stack trace line into a structured frame
 */
function parseStackTraceLine(line) {
    return parseStackTraceLineDetailed(line).frame;
}
/**
 * Parse a full stack trace string into an array of structured frames
 */
function parseStackTrace(stackTrace) {
    if (!stackTrace || typeof stackTrace !== 'string') {
        return [];
    }
    var lines = stackTrace.split('\n');
    var frames = [];
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var frame = parseStackTraceLineDetailed(line).frame;
        if (frame) {
            frames.push(frame);
        }
    }
    return frames;
}
/**
 * Convert parsed stack frames to Faro's StackFrame format
 */
function toFaroStackFrames(parsedFrames, options) {
    var _a;
    var releaseName = (_a = options === null || options === void 0 ? void 0 : options.releaseBundleFilename) !== null && _a !== void 0 ? _a : 'bundle.js';
    var keyedBasename = typeof (options === null || options === void 0 ? void 0 : options.releaseBundleFilename) === 'string' && options.releaseBundleFilename.trim() !== ''
        ? options.releaseBundleFilename.trim()
        : null;
    return parsedFrames.map(function (frame, _index) {
        var filename = normalizeHermesStackFilename(frame.filename || '<unknown>');
        if (frame.releaseLine) {
            filename = releaseName;
        }
        else if (keyedBasename) {
            filename = collapseBundledArtifactPath(filename, keyedBasename);
        }
        return {
            filename: filename,
            function: frame.function || '<anonymous>',
            lineno: frame.lineno,
            colno: frame.colno,
        };
    });
}
/**
 * Extract and parse stack frames from an Error object
 */
function getStackFramesFromError(error, options) {
    if (!error || !error.stack) {
        return [];
    }
    try {
        var parsedFrames = parseStackTrace(error.stack);
        return toFaroStackFrames(parsedFrames, options);
    }
    catch (_e) {
        // If parsing fails, return empty array
        return [];
    }
}
/**
 * Get platform-specific error context
 */
function getPlatformErrorContext() {
    var _a;
    return {
        platform: react_native_1.Platform.OS,
        platformVersion: ((_a = react_native_1.Platform.Version) === null || _a === void 0 ? void 0 : _a.toString()) || 'unknown',
        isHermes: typeof HermesInternal !== 'undefined' ? 'true' : 'false',
    };
}
/**
 * Enhance error with React Native specific information
 */
function enhanceErrorWithContext(error, additionalContext, stackParseOptions) {
    var stackFrames = getStackFramesFromError(error, stackParseOptions);
    var platformContext = getPlatformErrorContext();
    return {
        error: error,
        stackFrames: stackFrames,
        context: __assign(__assign({}, platformContext), additionalContext),
    };
}
//# sourceMappingURL=stackTraceParser.js.map