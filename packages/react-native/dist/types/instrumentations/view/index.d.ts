import { BaseInstrumentation } from '@grafana/faro-core';
/**
 * View instrumentation for React Native
 * Tracks screen/view changes
 *
 * This instrumentation listens to meta changes and emits VIEW_CHANGED events
 * when the screen/view changes. The actual screen tracking is handled by
 * the navigation integration utilities (useFaroNavigation hook).
 */
export declare class ViewInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native:instrumentation-view";
    readonly version = "2.3.1";
    private notifiedView;
    private metaUnsubscribe;
    private sendViewChangedEvent;
    initialize(): void;
    /**
     * Clean up meta listener
     */
    unpatch(): void;
}
