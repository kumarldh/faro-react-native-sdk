import { BaseInstrumentation } from '@grafana/faro-core';
import type { ReactNavigationConfig } from '../types';
/**
 * React Navigation v6 instrumentation for Faro
 * Tracks navigation events and screen changes
 */
export declare class ReactNativeNavigationIntegration extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native-navigation";
    readonly version = "1.0.0";
    constructor(_config?: ReactNavigationConfig);
    initialize(): void;
}
