"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamplingFunction = exports.SamplingRate = void 0;
/**
 * Fixed sampling rate.
 *
 * Use this when you want a constant sampling probability regardless of
 * session context.
 *
 * @example
 * ```ts
 * sessionTracking: {
 *   sampling: new SamplingRate(0.1), // 10% of sessions
 * }
 * ```
 */
var SamplingRate = /** @class */ (function () {
    /**
     * Creates a fixed sampling rate.
     *
     * @param rate - The fixed sampling rate (0 to 1). Values are clamped to [0, 1].
     */
    function SamplingRate(rate) {
        this.rate = rate;
    }
    SamplingRate.prototype.resolve = function (_context) {
        return Math.max(0, Math.min(1, this.rate));
    };
    return SamplingRate;
}());
exports.SamplingRate = SamplingRate;
/**
 * Dynamic sampling based on context.
 *
 * Use this when you want to make sampling decisions based on session
 * metadata like user attributes, app environment, or other context.
 *
 * @example
 * ```ts
 * sessionTracking: {
 *   sampling: new SamplingFunction((context) => {
 *     // Sample all beta users
 *     if (context.meta.user?.attributes?.['role'] === 'beta') {
 *       return 1;
 *     }
 *     // Sample 10% of production sessions
 *     if (context.meta.app?.environment === 'production') {
 *       return 0.1;
 *     }
 *     return 1;
 *   }),
 * }
 * ```
 */
var SamplingFunction = /** @class */ (function () {
    /**
     * Creates a dynamic sampler with the given function.
     *
     * @param fn - The function that determines the rate based on context.
     *   Receives a {@link SamplingContext} and should return a rate between 0 and 1.
     */
    function SamplingFunction(fn) {
        this.fn = fn;
    }
    SamplingFunction.prototype.resolve = function (context) {
        return Math.max(0, Math.min(1, this.fn(context)));
    };
    return SamplingFunction;
}());
exports.SamplingFunction = SamplingFunction;
//# sourceMappingURL=sampling.js.map