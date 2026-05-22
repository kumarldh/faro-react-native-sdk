"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFaroNavigation = useFaroNavigation;
var react_1 = require("react");
var utils_1 = require("./utils");
/**
 * Hook to integrate Faro with React Navigation
 *
 * This hook automatically tracks navigation changes and updates Faro's view meta.
 * It works with both NavigationContainer refs and the useNavigationContainerRef hook.
 *
 * @param navigationRef - Reference to the NavigationContainer
 *
 * @example
 * ```
 * import { useNavigationContainerRef } from '@react-navigation/native';
 * import { useFaroNavigation } from '@grafana/faro-react-native';
 *
 * function App() {
 *   const navigationRef = useNavigationContainerRef();
 *   useFaroNavigation(navigationRef);
 *
 *   return (
 *     <NavigationContainer ref={navigationRef}>
 *       // your navigation
 *     </NavigationContainer>
 *   );
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ParamList is app-specific, using any for flexibility
function useFaroNavigation(navigationRef) {
    var unsubscribeRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (!navigationRef.current) {
            return;
        }
        // Get initial state and track it
        var initialState = navigationRef.current.getRootState();
        if (initialState) {
            (0, utils_1.onNavigationStateChange)(initialState);
        }
        // Subscribe to navigation state changes
        unsubscribeRef.current = navigationRef.current.addListener('state', function (e) {
            (0, utils_1.onNavigationStateChange)(e.data.state);
        });
        // Cleanup subscription on unmount
        return function () {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
        };
    }, [navigationRef]);
}
//# sourceMappingURL=useFaroNavigation.js.map