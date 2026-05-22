"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = throttle;
/**
 * Creates a throttled function that only invokes the provided function at most once per
 * every `wait` milliseconds.
 *
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @returns A throttled version of the function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic utility needs to accept any function signature
function throttle(func, wait) {
    var timeout = null;
    var previous = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Need to preserve function context
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = Date.now();
        var remaining = wait - (now - previous);
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(this, args);
        }
        else if (!timeout) {
            timeout = setTimeout(function () {
                previous = Date.now();
                timeout = null;
                func.apply(_this, args);
            }, remaining);
        }
    };
}
//# sourceMappingURL=throttle.js.map