import type { NavigationState, PartialState, Route } from '@react-navigation/native';
/**
 * Gets the currently active route from navigation state
 */
export declare function getCurrentRoute(state: NavigationState | PartialState<NavigationState> | undefined): Route<string> | undefined;
/**
 * Extracts the route name from a route object
 */
export declare function getRouteName(route: Route<string> | undefined): string | undefined;
/**
 * Handles navigation state changes and updates Faro with the new screen
 * @param state - The current navigation state
 */
export declare function onNavigationStateChange(state: NavigationState | undefined): void;
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
export declare function createNavigationStateChangeHandler(): (state: NavigationState | undefined) => void;
