"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageMeta = getPageMeta;
/**
 * Returns empty page meta for React Native.
 * This overrides the default page meta from faro-core which is web-specific.
 * In React Native, we use view meta for screen tracking instead.
 */
function getPageMeta() {
    return function () { return ({
        page: {},
    }); };
}
//# sourceMappingURL=page.js.map