import { BaseInstrumentation } from '@grafana/faro-core';
/**
 * User Actions instrumentation for React Native
 *
 * Tracks user interactions when components use the withFaroUserAction HOC
 * or call the trackUserAction helper directly.
 *
 * Features:
 * - Intelligent duration tracking based on activity
 * - HTTP request correlation
 * - Automatic lifecycle management
 * - Halt state for pending async operations
 *
 * @example
 * ```tsx
 * import { withFaroUserAction } from '@grafana/faro-react-native';
 *
 * const TrackedButton = withFaroUserAction(TouchableOpacity, 'button_pressed');
 *
 * <TrackedButton onPress={handlePress}>
 *   <Text>Click me</Text>
 * </TrackedButton>
 * ```
 */
export declare class UserActionInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native:instrumentation-user-action";
    readonly version = "2.3.1";
    private _userActionSub?;
    initialize(): void;
    /**
     * Process a started user action by attaching a controller
     * The controller handles intelligent duration tracking and HTTP correlation
     */
    private processUserActionStarted;
    unpatch(): void;
}
