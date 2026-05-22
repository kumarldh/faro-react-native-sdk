import { type AppStateStatus } from 'react-native';
import { BaseInstrumentation } from '@grafana/faro-core';
export declare const EVENT_APP_STATE_CHANGED = "app_lifecycle_changed";
/**
 * AppState instrumentation for React Native
 * Tracks app foreground/background/inactive state changes
 *
 * Emits `app_lifecycle_changed` with React Native `AppState` values in `fromState` / `toState`
 * (active, background, inactive, unknown, extension).
 */
export declare class AppStateInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native:instrumentation-appstate";
    readonly version = "2.3.1";
    private currentState;
    private stateStartTime;
    private appStateSubscription;
    initialize(): void;
    /**
     * Handles app state changes and emits app_lifecycle_changed events
     * with native AppState status strings. Includes duration and timestamp for time-in-state analysis.
     */
    private handleAppStateChange;
    /**
     * Get the current app state
     */
    getCurrentState(): AppStateStatus | undefined;
    /**
     * Get the duration the app has been in the current state (in milliseconds)
     */
    getCurrentStateDuration(): number;
    /**
     * Check if app is currently in the foreground (active state)
     */
    isActive(): boolean;
    /**
     * Check if app is currently in the background
     */
    isBackground(): boolean;
    /**
     * Cleanup: Remove app state listener
     */
    unpatch(): void;
}
