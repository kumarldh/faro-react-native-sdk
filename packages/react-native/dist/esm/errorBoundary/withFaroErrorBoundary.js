import React, {} from 'react';
import { unknownString } from '@grafana/faro-core';
import { FaroErrorBoundary } from './FaroErrorBoundary';
/**
 * Higher-Order Component that wraps a component with FaroErrorBoundary
 *
 * @example
 * ```tsx
 * import { withFaroErrorBoundary } from '@grafana/faro-react-native';
 * import { Text } from 'react-native';
 *
 * const MyComponent = () => <Text>Hello</Text>;
 *
 * export default withFaroErrorBoundary(MyComponent, {
 *   fallback: <Text>Error occurred</Text>
 * });
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic HOC must accept any component props
export function withFaroErrorBoundary(WrappedComponent, errorBoundaryProps) {
    var _a, _b;
    const componentDisplayName = (_b = (_a = WrappedComponent.displayName) !== null && _a !== void 0 ? _a : WrappedComponent.name) !== null && _b !== void 0 ? _b : unknownString;
    const Component = (wrappedComponentProps) => React.createElement(FaroErrorBoundary, errorBoundaryProps, React.createElement(WrappedComponent, wrappedComponentProps));
    Component.displayName = `faroErrorBoundary(${componentDisplayName})`;
    return Component;
}
//# sourceMappingURL=withFaroErrorBoundary.js.map