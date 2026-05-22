"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFaroUserAction = withFaroUserAction;
exports.trackUserAction = trackUserAction;
var react_1 = __importDefault(require("react"));
var faro_core_1 = require("@grafana/faro-core");
/**
 * Higher-Order Component that wraps React Native touchable components
 * to automatically track user interactions.
 *
 * @param Component - The component to wrap (e.g., TouchableOpacity, Button, etc.)
 * @param defaultActionName - The default name for this action
 *
 * @example
 * ```tsx
 * import { TouchableOpacity } from 'react-native';
 * import { withFaroUserAction } from '@grafana/faro-react-native';
 *
 * const TrackedButton = withFaroUserAction(TouchableOpacity, 'submit_form');
 *
 * function MyForm() {
 *   return (
 *     <TrackedButton onPress={handleSubmit}>
 *       <Text>Submit</Text>
 *     </TrackedButton>
 *   );
 * }
 * ```
 */
function withFaroUserAction(Component, defaultActionName) {
    return function FaroTrackedComponent(props) {
        var faroActionName = props.faroActionName, faroContext = props.faroContext, onPress = props.onPress, restProps = __rest(props, ["faroActionName", "faroContext", "onPress"]);
        var handlePress = function (event) {
            var _a, _b, _c, _d;
            try {
                // Use the prop-specific name or fall back to the default
                var actionName = faroActionName || defaultActionName;
                // End any active user action before starting a new one to avoid "already running" errors
                // (e.g. when user taps another button before the previous action's HTTP request completes)
                // getActiveUserAction returns UserActionInterface but the runtime object is the full
                // UserAction implementing UserActionInternalInterface (with end)
                var activeAction = (_b = (_a = faro_core_1.faro === null || faro_core_1.faro === void 0 ? void 0 : faro_core_1.faro.api) === null || _a === void 0 ? void 0 : _a.getActiveUserAction) === null || _b === void 0 ? void 0 : _b.call(_a);
                activeAction === null || activeAction === void 0 ? void 0 : activeAction.end();
                // Start a user action - UserActionInstrumentation subscribes to the message bus
                // and attaches UserActionController for auto-ending and HTTP correlation
                (_d = (_c = faro_core_1.faro === null || faro_core_1.faro === void 0 ? void 0 : faro_core_1.faro.api) === null || _c === void 0 ? void 0 : _c.startUserAction) === null || _d === void 0 ? void 0 : _d.call(_c, actionName, faroContext || {}, { triggerName: 'press' });
            }
            catch (error) {
                // Don't let tracking errors break the app
                console.warn('[Faro] Error tracking user action:', error);
            }
            // Always call the original onPress handler
            onPress === null || onPress === void 0 ? void 0 : onPress(event);
        };
        return react_1.default.createElement(Component, __assign(__assign({}, restProps), { onPress: handlePress }));
    };
}
/**
 * Manually track a user action without using the HOC
 *
 * @param actionName - The name of the action
 * @param context - Optional context to attach
 *
 * @example
 * ```tsx
 * import { trackUserAction } from '@grafana/faro-react-native';
 *
 * function handleComplexAction() {
 *   const action = trackUserAction('complex_workflow', { step: '1' });
 *
 *   // Do work...
 *   doSomething();
 *
 *   // End the action when done
 *   action?.end();
 * }
 * ```
 */
function trackUserAction(actionName, context) {
    var _a, _b, _c, _d;
    try {
        // End any active user action before starting a new one
        var activeAction = (_b = (_a = faro_core_1.faro === null || faro_core_1.faro === void 0 ? void 0 : faro_core_1.faro.api) === null || _a === void 0 ? void 0 : _a.getActiveUserAction) === null || _b === void 0 ? void 0 : _b.call(_a);
        activeAction === null || activeAction === void 0 ? void 0 : activeAction.end();
        return (_d = (_c = faro_core_1.faro === null || faro_core_1.faro === void 0 ? void 0 : faro_core_1.faro.api) === null || _c === void 0 ? void 0 : _c.startUserAction) === null || _d === void 0 ? void 0 : _d.call(_c, actionName, context || {}, { triggerName: 'manual' });
    }
    catch (error) {
        console.warn('[Faro] Error tracking user action:', error);
        return undefined;
    }
}
//# sourceMappingURL=withFaroUserAction.js.map