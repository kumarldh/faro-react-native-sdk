import { type AppStateStatus } from 'react-native';
/**
 * Mock AppState for testing
 */
export declare function mockAppState(): {
    setCurrentState: (state: AppStateStatus) => void;
    triggerChange: (state: AppStateStatus) => void;
};
