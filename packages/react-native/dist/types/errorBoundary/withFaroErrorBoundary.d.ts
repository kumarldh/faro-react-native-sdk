import { type ComponentType, type FC } from 'react';
import type { FaroErrorBoundaryProps } from './types';
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
export declare function withFaroErrorBoundary<P extends Record<string, any> = {}>(WrappedComponent: ComponentType<P>, errorBoundaryProps: FaroErrorBoundaryProps): FC<P>;
