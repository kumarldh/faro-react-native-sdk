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
exports.UserActionInstrumentation = void 0;
var faro_core_1 = require("@grafana/faro-core");
var userActionController_1 = require("./userActionController");
/**
 * User Actions instrumentation for React Native
 *
 * Tracks user interactions when components use the withFaroUserAction HOC
 * or call the trackUserAction helper directly.
 *
 * Features:
 * - Intelligent duration tracking based on activity
 * - HTTP request correlation
 * - Automatic lifecycle management
 * - Halt state for pending async operations
 *
 * @example
 * ```tsx
 * import { withFaroUserAction } from '@grafana/faro-react-native';
 *
 * const TrackedButton = withFaroUserAction(TouchableOpacity, 'button_pressed');
 *
 * <TrackedButton onPress={handlePress}>
 *   <Text>Click me</Text>
 * </TrackedButton>
 * ```
 */
var UserActionInstrumentation = /** @class */ (function (_super) {
    __extends(UserActionInstrumentation, _super);
    function UserActionInstrumentation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = '@grafana/faro-react-native:instrumentation-user-action';
        _this.version = faro_core_1.VERSION;
        return _this;
    }
    UserActionInstrumentation.prototype.initialize = function () {
        var _this = this;
        this.logInfo('User action instrumentation initialized with enhanced tracking');
        // Subscribe to user action events from the message bus
        this._userActionSub = faro_core_1.userActionsMessageBus.subscribe(function (_a) {
            var type = _a.type, userAction = _a.userAction;
            if (type === 'user_action_start') {
                _this.logDebug("User action started: ".concat(userAction.name));
                _this.processUserActionStarted(userAction);
            }
        });
    };
    /**
     * Process a started user action by attaching a controller
     * The controller handles intelligent duration tracking and HTTP correlation
     */
    UserActionInstrumentation.prototype.processUserActionStarted = function (userAction) {
        try {
            var internalUserAction = userAction;
            var controller = new userActionController_1.UserActionController(internalUserAction);
            controller.attach();
        }
        catch (error) {
            this.logError('Error attaching user action controller:', error);
        }
    };
    UserActionInstrumentation.prototype.unpatch = function () {
        var _a;
        (_a = this._userActionSub) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        this._userActionSub = undefined;
    };
    return UserActionInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.UserActionInstrumentation = UserActionInstrumentation;
//# sourceMappingURL=index.js.map