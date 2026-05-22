import { Component, type ErrorInfo, type ReactNode } from 'react';
import type { FaroErrorBoundaryProps, FaroErrorBoundaryState } from './types';
/**
 * React Error Boundary with Faro integration
 *
 * Catches React component errors and sends them to Faro for monitoring.
 * Provides lifecycle hooks and custom fallback UI support.
 *
 * @example
 * ```tsx
 * import { FaroErrorBoundary } from '@grafana/faro-react-native';
 *
 * function App() {
 *   return (
 *     <FaroErrorBoundary
 *       fallback={<Text>Something went wrong</Text>}
 *     >
 *       <YourApp />
 *     </FaroErrorBoundary>
 *   );
 * }
 * ```
 */
export declare class FaroErrorBoundary extends Component<FaroErrorBoundaryProps, FaroErrorBoundaryState> {
    state: FaroErrorBoundaryState;
    constructor(props: FaroErrorBoundaryProps);
    /**
     * Creates an error with React component stack included
     */
    getErrorWithComponentStack(error: Error, errorInfo: ErrorInfo): Error;
    static getDerivedStateFromError(error: Error): FaroErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    resetErrorBoundary(): void;
    render(): ReactNode;
}
