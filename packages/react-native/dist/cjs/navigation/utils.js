"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentRoute = getCurrentRoute;
exports.getRouteName = getRouteName;
exports.onNavigationStateChange = onNavigationStateChange;
exports.createNavigationStateChangeHandler = createNavigationStateChangeHandler;
var faro_core_1 = require("@grafana/faro-core");
var screen_1 = require("../metas/screen");
/**
 * Gets the currently active route from navigation state
 */
function getCurrentRoute(state) {
    var _a;
    if (!state || !state.routes || state.routes.length === 0) {
        return undefined;
    }
    var route = state.routes[(_a = state.index) !== null && _a !== void 0 ? _a : 0];
    // If this route has nested state, recursively get the active route
    if (route === null || route === void 0 ? void 0 : route.state) {
        return getCurrentRoute(route.state);
    }
    // Only return if route has all required properties
    if (route && 'key' in route && 'name' in route && route.key && route.name) {
        return route;
    }
    return undefined;
}
/**
 * Extracts the route name from a route object
 */
function getRouteName(route) {
    return route === null || route === void 0 ? void 0 : route.name;
}
/**
 * Handles navigation state changes and updates Faro with the new screen
 * @param state - The current navigation state
 */
function onNavigationStateChange(state) {
    var _a, _b;
    if (!state) {
        return;
    }
    var currentRoute = getCurrentRoute(state);
    var screenName = getRouteName(currentRoute);
    if (screenName) {
        // Update the screen meta
        (0, screen_1.setCurrentScreen)(screenName);
        // Update the view meta which will trigger VIEW_CHANGED event
        (_a = faro_core_1.faro.api) === null || _a === void 0 ? void 0 : _a.setView({ name: screenName });
        // Optionally push additional attributes if route has params
        if (currentRoute === null || currentRoute === void 0 ? void 0 : currentRoute.params) {
            (_b = faro_core_1.faro.api) === null || _b === void 0 ? void 0 : _b.pushEvent('navigation', {
                screen: screenName,
                params: JSON.stringify(currentRoute.params),
            });
        }
    }
}
/**
 * Creates a navigation state change handler
 * Use this with NavigationContainer's onStateChange prop
 *
 * @example
 * ```
 * import { NavigationContainer } from '@react-navigation/native';
 * import { createNavigationStateChangeHandler } from '@grafana/faro-react-native';
 *
 * const onStateChange = createNavigationStateChangeHandler();
 *
 * // In your component:
 * <NavigationContainer onStateChange={onStateChange}>
 *   // your navigation
 * </NavigationContainer>
 * ```
 */
function createNavigationStateChangeHandler() {
    return onNavigationStateChange;
}
//# sourceMappingURL=utils.js.map