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
exports.AppStateInstrumentation = exports.EVENT_APP_STATE_CHANGED = void 0;
var react_native_1 = require("react-native");
var faro_core_1 = require("@grafana/faro-core");
// Event name aligned with Faro Flutter SDK (app_lifecycle_changed)
exports.EVENT_APP_STATE_CHANGED = 'app_lifecycle_changed';
/**
 * AppState instrumentation for React Native
 * Tracks app foreground/background/inactive state changes
 *
 * Emits `app_lifecycle_changed` with React Native `AppState` values in `fromState` / `toState`
 * (active, background, inactive, unknown, extension).
 */
var AppStateInstrumentation = /** @class */ (function (_super) {
    __extends(AppStateInstrumentation, _super);
    function AppStateInstrumentation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = '@grafana/faro-react-native:instrumentation-appstate';
        _this.version = faro_core_1.VERSION;
        /**
         * Handles app state changes and emits app_lifecycle_changed events
         * with native AppState status strings. Includes duration and timestamp for time-in-state analysis.
         */
        _this.handleAppStateChange = function (nextAppState) {
            var previousState = _this.currentState;
            var now = (0, faro_core_1.dateNow)();
            var duration = _this.stateStartTime ? now - _this.stateStartTime : 0;
            // Update state tracking
            _this.currentState = nextAppState;
            _this.stateStartTime = now;
            // Log the state change (internal debug keeps RN state names)
            _this.logDebug('App state changed', {
                from: previousState,
                to: nextAppState,
                duration: duration,
            });
            // Emit app lifecycle change event (native RN AppState values + duration/timestamp)
            var fromState = previousState !== undefined ? previousState : '';
            var toState = nextAppState;
            _this.api.pushEvent(exports.EVENT_APP_STATE_CHANGED, {
                fromState: fromState,
                toState: toState,
                duration: duration.toString(),
                timestamp: now.toString(),
            }, undefined, { skipDedupe: true });
            // Additional logging for specific transitions
            if (nextAppState === 'background') {
                _this.logInfo('App moved to background', { fromState: previousState, duration: duration });
            }
            else if (nextAppState === 'active' && previousState === 'background') {
                _this.logInfo('App returned to foreground', { duration: duration });
            }
            else if (nextAppState === 'inactive') {
                _this.logDebug('App became inactive', { fromState: previousState });
            }
        };
        return _this;
    }
    AppStateInstrumentation.prototype.initialize = function () {
        // Get initial app state
        this.currentState = react_native_1.AppState.currentState;
        this.stateStartTime = (0, faro_core_1.dateNow)();
        this.logInfo('AppState instrumentation initialized', {
            initialState: this.currentState,
        });
        // Subscribe to app state changes
        this.appStateSubscription = react_native_1.AppState.addEventListener('change', this.handleAppStateChange);
    };
    /**
     * Get the current app state
     */
    AppStateInstrumentation.prototype.getCurrentState = function () {
        return this.currentState;
    };
    /**
     * Get the duration the app has been in the current state (in milliseconds)
     */
    AppStateInstrumentation.prototype.getCurrentStateDuration = function () {
        if (!this.stateStartTime) {
            return 0;
        }
        return (0, faro_core_1.dateNow)() - this.stateStartTime;
    };
    /**
     * Check if app is currently in the foreground (active state)
     */
    AppStateInstrumentation.prototype.isActive = function () {
        return this.currentState === 'active';
    };
    /**
     * Check if app is currently in the background
     */
    AppStateInstrumentation.prototype.isBackground = function () {
        return this.currentState === 'background';
    };
    /**
     * Cleanup: Remove app state listener
     */
    AppStateInstrumentation.prototype.unpatch = function () {
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = undefined;
            this.logInfo('AppState instrumentation unpatched');
        }
    };
    return AppStateInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.AppStateInstrumentation = AppStateInstrumentation;
//# sourceMappingURL=index.js.map