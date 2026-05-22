/**
 * Jest stub for optional peer `@grafana/faro-react-native-tracing`.
 * Mapped via moduleNameMapper so tests run without installing the tracing workspace package.
 */
import { BaseInstrumentation } from '@grafana/faro-core';
export declare class TracingInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native-tracing";
    readonly version = "2.3.1";
    initialize(): void;
}
