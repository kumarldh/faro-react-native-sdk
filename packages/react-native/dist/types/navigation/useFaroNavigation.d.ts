import type { NavigationContainerRef } from '@react-navigation/native';
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
export declare function useFaroNavigation(navigationRef: {
    current: NavigationContainerRef<any> | null;
}): void;
