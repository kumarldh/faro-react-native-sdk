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
exports.getScreenMeta = void 0;
exports.createScreenMeta = createScreenMeta;
exports.setCurrentScreen = setCurrentScreen;
exports.getCurrentScreen = getCurrentScreen;
var faro_core_1 = require("@grafana/faro-core");
var currentScreen;
var screenId;
/**
 * Screen meta for React Native
 * Tracks the current screen name instead of URL (as in web page meta)
 */
function createScreenMeta(_a) {
    var _b = _a === void 0 ? {} : _a, generateScreenId = _b.generateScreenId, initialScreenMeta = _b.initialScreenMeta;
    var screenMeta = function () {
        var screenName = currentScreen || 'unknown';
        if (generateScreenId !== undefined && (0, faro_core_1.isFunction)(generateScreenId) && currentScreen !== screenName) {
            screenId = generateScreenId(screenName);
        }
        return {
            page: __assign(__assign({ url: "screen://".concat(screenName) }, (screenId ? { id: screenId } : {})), initialScreenMeta),
        };
    };
    return screenMeta;
}
/**
 * Updates the current screen name
 * Called by navigation instrumentation when screen changes
 */
function setCurrentScreen(screenName) {
    currentScreen = screenName;
}
/**
 * Gets the current screen name
 */
function getCurrentScreen() {
    return currentScreen;
}
/**
 * Default screen meta with no custom configuration
 */
var getScreenMeta = function () {
    return createScreenMeta();
};
exports.getScreenMeta = getScreenMeta;
//# sourceMappingURL=screen.js.map