"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFaroErrorBoundary = withFaroErrorBoundary;
var react_1 = __importDefault(require("react"));
var faro_core_1 = require("@grafana/faro-core");
var FaroErrorBoundary_1 = require("./FaroErrorBoundary");
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
function withFaroErrorBoundary(WrappedComponent, errorBoundaryProps) {
    var _a, _b;
    var componentDisplayName = (_b = (_a = WrappedComponent.displayName) !== null && _a !== void 0 ? _a : WrappedComponent.name) !== null && _b !== void 0 ? _b : faro_core_1.unknownString;
    var Component = function (wrappedComponentProps) {
        return react_1.default.createElement(FaroErrorBoundary_1.FaroErrorBoundary, errorBoundaryProps, react_1.default.createElement(WrappedComponent, wrappedComponentProps));
    };
    Component.displayName = "faroErrorBoundary(".concat(componentDisplayName, ")");
    return Component;
}
//# sourceMappingURL=withFaroErrorBoundary.js.map