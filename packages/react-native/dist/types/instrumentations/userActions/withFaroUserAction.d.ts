import { type ComponentType } from 'react';
import type { GestureResponderEvent } from 'react-native';
export interface WithFaroUserActionProps {
    /**
     * Optional: Override the action name for this specific instance
     */
    faroActionName?: string;
    /**
     * Optional: Additional context to attach to the user action
     */
    faroContext?: Record<string, string>;
    /**
     * The original onPress handler
     */
    onPress?: (event: GestureResponderEvent) => void;
}
/**
 * Higher-Order Component that wraps React Native touchable components
 * to automatically track user interactions.
 *
 * @param Component - The component to wrap (e.g., TouchableOpacity, Button, etc.)
 * @param defaultActionName - The default name for this action
 *
 * @example
 * ```tsx
 * import { TouchableOpacity } from 'react-native';
 * import { withFaroUserAction } from '@grafana/faro-react-native';
 *
 * const TrackedButton = withFaroUserAction(TouchableOpacity, 'submit_form');
 *
 * function MyForm() {
 *   return (
 *     <TrackedButton onPress={handleSubmit}>
 *       <Text>Submit</Text>
 *     </TrackedButton>
 *   );
 * }
 * ```
 */
export declare function withFaroUserAction<P extends Record<string, unknown>>(Component: ComponentType<P>, defaultActionName: string): ComponentType<P & WithFaroUserActionProps>;
/**
 * Manually track a user action without using the HOC
 *
 * @param actionName - The name of the action
 * @param context - Optional context to attach
 *
 * @example
 * ```tsx
 * import { trackUserAction } from '@grafana/faro-react-native';
 *
 * function handleComplexAction() {
 *   const action = trackUserAction('complex_workflow', { step: '1' });
 *
 *   // Do work...
 *   doSomething();
 *
 *   // End the action when done
 *   action?.end();
 * }
 * ```
 */
export declare function trackUserAction(actionName: string, context?: Record<string, string>): import("@grafana/faro-core").UserActionInterface | undefined;
