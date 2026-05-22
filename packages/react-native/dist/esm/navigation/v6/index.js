import { BaseInstrumentation } from '@grafana/faro-core';
/**
 * React Navigation v6 instrumentation for Faro
 * Tracks navigation events and screen changes
 */
export class ReactNativeNavigationIntegration extends BaseInstrumentation {
    constructor(_config) {
        super();
        this.name = '@grafana/faro-react-native-navigation';
        this.version = '1.0.0';
        // config will be used when implementing navigation tracking
    }
    initialize() {
        // TODO: Implement navigation tracking
        this.logInfo('React Navigation integration initialized (placeholder)');
    }
}
//# sourceMappingURL=index.js.map