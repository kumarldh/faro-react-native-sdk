import { BaseInstrumentation, LogLevel } from '@grafana/faro-core';
/**
 * Console instrumentation for React Native
 * Captures console logs and errors
 *
 * Features:
 * - Configurable log levels
 * - Advanced error serialization
 * - Option to treat console.error as log or error
 * - Unpatch support for cleanup
 */
export declare class ConsoleInstrumentation extends BaseInstrumentation {
    readonly name = "@grafana/faro-react-native:instrumentation-console";
    readonly version = "2.3.1";
    static defaultDisabledLevels: LogLevel[];
    static consoleErrorPrefix: string;
    private originalConsole;
    private errorSerializer;
    private patchedLevels;
    private isProcessing;
    initialize(): void;
    /**
     * Restore original console methods
     * Call this to clean up and unpatch the console
     */
    unpatch(): void;
}
