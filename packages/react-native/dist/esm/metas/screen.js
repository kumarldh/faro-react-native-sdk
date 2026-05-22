import { isFunction } from '@grafana/faro-core';
let currentScreen;
let screenId;
/**
 * Screen meta for React Native
 * Tracks the current screen name instead of URL (as in web page meta)
 */
export function createScreenMeta({ generateScreenId, initialScreenMeta } = {}) {
    const screenMeta = () => {
        const screenName = currentScreen || 'unknown';
        if (generateScreenId !== undefined && isFunction(generateScreenId) && currentScreen !== screenName) {
            screenId = generateScreenId(screenName);
        }
        return {
            page: Object.assign(Object.assign({ url: `screen://${screenName}` }, (screenId ? { id: screenId } : {})), initialScreenMeta),
        };
    };
    return screenMeta;
}
/**
 * Updates the current screen name
 * Called by navigation instrumentation when screen changes
 */
export function setCurrentScreen(screenName) {
    currentScreen = screenName;
}
/**
 * Gets the current screen name
 */
export function getCurrentScreen() {
    return currentScreen;
}
/**
 * Default screen meta with no custom configuration
 */
export const getScreenMeta = () => {
    return createScreenMeta();
};
//# sourceMappingURL=screen.js.map