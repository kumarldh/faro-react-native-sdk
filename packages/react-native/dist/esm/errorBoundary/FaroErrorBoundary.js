import { Component } from 'react';
import { faro } from '@grafana/faro-core';
import { faroErrorBoundaryInitialState } from './const';
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
export class FaroErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = faroErrorBoundaryInitialState;
        this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    }
    /**
     * Creates an error with React component stack included
     */
    getErrorWithComponentStack(error, errorInfo) {
        if (!errorInfo.componentStack) {
            return error;
        }
        const newError = new Error(error.message);
        newError.name = `React ErrorBoundary ${error.name}`;
        newError.stack = errorInfo.componentStack;
        return newError;
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }
    componentDidCatch(error, errorInfo) {
        var _a, _b, _c, _d;
        const errorWithComponentStack = this.getErrorWithComponentStack(error, errorInfo);
        // Call beforeCapture hook
        (_b = (_a = this.props).beforeCapture) === null || _b === void 0 ? void 0 : _b.call(_a, errorWithComponentStack);
        // Send error to Faro
        faro.api.pushError(errorWithComponentStack, this.props.pushErrorOptions);
        // Call onError hook
        (_d = (_c = this.props).onError) === null || _d === void 0 ? void 0 : _d.call(_c, errorWithComponentStack);
        // Note: Don't call setState here - getDerivedStateFromError already set the state
    }
    componentDidMount() {
        var _a, _b;
        (_b = (_a = this.props).onMount) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    componentWillUnmount() {
        var _a, _b;
        (_b = (_a = this.props).onUnmount) === null || _b === void 0 ? void 0 : _b.call(_a, this.state.error);
    }
    resetErrorBoundary() {
        var _a, _b;
        (_b = (_a = this.props).onReset) === null || _b === void 0 ? void 0 : _b.call(_a, this.state.error);
        this.setState(faroErrorBoundaryInitialState);
    }
    render() {
        if (!this.state.hasError || !this.state.error) {
            return typeof this.props.children === 'function'
                ? this.props.children()
                : this.props.children;
        }
        const element = typeof this.props.fallback !== 'function'
            ? this.props.fallback
            : this.props.fallback(this.state.error, this.resetErrorBoundary);
        // Check if element exists - isValidElement may fail in monorepos with multiple React instances
        if (element != null) {
            return element;
        }
        if (this.props.fallback) {
            console.warn('[Faro ErrorBoundary] Cannot get a valid ReactElement from "fallback"');
        }
        return null;
    }
}
//# sourceMappingURL=FaroErrorBoundary.js.map