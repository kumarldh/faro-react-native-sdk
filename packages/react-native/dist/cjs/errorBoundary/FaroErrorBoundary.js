"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaroErrorBoundary = void 0;
var react_1 = require("react");
var faro_core_1 = require("@grafana/faro-core");
var const_1 = require("./const");
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
var FaroErrorBoundary = /** @class */ (function (_super) {
    __extends(FaroErrorBoundary, _super);
    function FaroErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = const_1.faroErrorBoundaryInitialState;
        _this.resetErrorBoundary = _this.resetErrorBoundary.bind(_this);
        return _this;
    }
    /**
     * Creates an error with React component stack included
     */
    FaroErrorBoundary.prototype.getErrorWithComponentStack = function (error, errorInfo) {
        if (!errorInfo.componentStack) {
            return error;
        }
        var newError = new Error(error.message);
        newError.name = "React ErrorBoundary ".concat(error.name);
        newError.stack = errorInfo.componentStack;
        return newError;
    };
    FaroErrorBoundary.getDerivedStateFromError = function (error) {
        return {
            hasError: true,
            error: error,
        };
    };
    FaroErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        var _a, _b, _c, _d;
        var errorWithComponentStack = this.getErrorWithComponentStack(error, errorInfo);
        // Call beforeCapture hook
        (_b = (_a = this.props).beforeCapture) === null || _b === void 0 ? void 0 : _b.call(_a, errorWithComponentStack);
        // Send error to Faro
        faro_core_1.faro.api.pushError(errorWithComponentStack, this.props.pushErrorOptions);
        // Call onError hook
        (_d = (_c = this.props).onError) === null || _d === void 0 ? void 0 : _d.call(_c, errorWithComponentStack);
        // Note: Don't call setState here - getDerivedStateFromError already set the state
    };
    FaroErrorBoundary.prototype.componentDidMount = function () {
        var _a, _b;
        (_b = (_a = this.props).onMount) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    FaroErrorBoundary.prototype.componentWillUnmount = function () {
        var _a, _b;
        (_b = (_a = this.props).onUnmount) === null || _b === void 0 ? void 0 : _b.call(_a, this.state.error);
    };
    FaroErrorBoundary.prototype.resetErrorBoundary = function () {
        var _a, _b;
        (_b = (_a = this.props).onReset) === null || _b === void 0 ? void 0 : _b.call(_a, this.state.error);
        this.setState(const_1.faroErrorBoundaryInitialState);
    };
    FaroErrorBoundary.prototype.render = function () {
        if (!this.state.hasError || !this.state.error) {
            return typeof this.props.children === 'function'
                ? this.props.children()
                : this.props.children;
        }
        var element = typeof this.props.fallback !== 'function'
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
    };
    return FaroErrorBoundary;
}(react_1.Component));
exports.FaroErrorBoundary = FaroErrorBoundary;
//# sourceMappingURL=FaroErrorBoundary.js.map