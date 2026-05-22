/**
 * Jest stub for optional peer `@grafana/faro-react-native-tracing`.
 * Mapped via moduleNameMapper so tests run without installing the tracing workspace package.
 */
import { BaseInstrumentation, VERSION } from '@grafana/faro-core';
export class TracingInstrumentation extends BaseInstrumentation {
    constructor() {
        super(...arguments);
        this.name = '@grafana/faro-react-native-tracing';
        this.version = VERSION;
    }
    initialize() { }
}
//# sourceMappingURL=mockFaroReactNativeTracing.js.map