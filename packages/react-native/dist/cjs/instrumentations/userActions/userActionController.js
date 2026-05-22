"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActionController = void 0;
var faro_core_1 = require("@grafana/faro-core");
var httpRequestMonitor_1 = require("./httpRequestMonitor");
var defaultFollowUpActionTimeRange = 100; // 100ms after activity stops
var defaultHaltTimeout = 10 * 1000; // 10 seconds max wait for HTTP
function isRequestStartMessage(msg) {
    return msg.type === 'http_request_start';
}
function isRequestEndMessage(msg) {
    return msg.type === 'http_request_end';
}
function startTimeout(callback, timeout) {
    return setTimeout(callback, timeout);
}
/**
 * Controller for managing user action lifecycle in React Native
 *
 * Responsibilities:
 * - Monitor HTTP requests triggered by user actions
 * - Intelligently determine when a user action is complete
 * - Handle "halt" state for pending async operations
 * - Auto-end actions after timeout
 */
var UserActionController = /** @class */ (function () {
    function UserActionController(userAction) {
        this.userAction = userAction;
        this.http = (0, httpRequestMonitor_1.monitorHttpRequests)();
        this.runningRequests = new Map();
        this.isHalted = false;
    }
    /**
     * Attach the controller to start monitoring
     */
    UserActionController.prototype.attach = function () {
        var _this = this;
        // Subscribe to HTTP requests while action is active/halting
        this.allMonitorsSub = new faro_core_1.Observable()
            .merge(this.http)
            .takeWhile(function () {
            var state = _this.userAction.getState();
            return [faro_core_1.UserActionState.Started, faro_core_1.UserActionState.Halted].includes(state);
        })
            .filter(function (msg) {
            // If the user action is in halt state, we only keep listening to ended http requests
            if (_this.isHalted && !(isRequestEndMessage(msg) && _this.runningRequests.has(msg.request.requestId))) {
                return false;
            }
            return true;
        })
            .subscribe(function (msg) {
            if (isRequestStartMessage(msg)) {
                // Track started HTTP requests
                _this.runningRequests.set(msg.request.requestId, msg.request);
            }
            if (isRequestEndMessage(msg)) {
                _this.runningRequests.delete(msg.request.requestId);
            }
            // Clear any existing follow-up timeout
            _this.clearFollowUpTimeout();
            // If we have pending HTTP requests, don't schedule follow-up yet
            if (_this.runningRequests.size > 0) {
                // Enter halt state if we have pending requests
                if (_this.userAction.getState() === faro_core_1.UserActionState.Started) {
                    _this.halt();
                }
            }
            else {
                // No pending requests, schedule action end
                _this.scheduleFollowUpAction();
            }
        });
        // Start initial follow-up timeout
        this.scheduleFollowUpAction();
    };
    /**
     * Put the action in halt state (waiting for async operations)
     */
    UserActionController.prototype.halt = function () {
        var _this = this;
        if (this.userAction.getState() === faro_core_1.UserActionState.Started && !this.isHalted) {
            this.userAction.halt();
            this.isHalted = true;
            // Start halt timeout - max time to wait for pending operations
            this.haltTid = startTimeout(function () {
                _this.end();
            }, defaultHaltTimeout);
        }
    };
    /**
     * End the user action
     */
    UserActionController.prototype.end = function () {
        this.clearFollowUpTimeout();
        this.clearHaltTimeout();
        // Skip if already ended (e.g. user called action.end() manually) - avoids duplicate events
        var state = this.userAction.getState();
        if (state === faro_core_1.UserActionState.Ended || state === faro_core_1.UserActionState.Cancelled) {
            this.cleanup();
            return;
        }
        this.userAction.end();
        this.cleanup();
    };
    /**
     * Schedule the follow-up action to end the user action
     */
    UserActionController.prototype.scheduleFollowUpAction = function () {
        var _this = this;
        this.clearFollowUpTimeout();
        this.followUpTid = startTimeout(function () {
            _this.end();
        }, defaultFollowUpActionTimeRange);
    };
    /**
     * Clear the follow-up timeout
     */
    UserActionController.prototype.clearFollowUpTimeout = function () {
        if (this.followUpTid !== undefined) {
            clearTimeout(this.followUpTid);
            this.followUpTid = undefined;
        }
    };
    /**
     * Clear the halt timeout
     */
    UserActionController.prototype.clearHaltTimeout = function () {
        if (this.haltTid !== undefined) {
            clearTimeout(this.haltTid);
            this.haltTid = undefined;
        }
    };
    /**
     * Clean up subscriptions
     */
    UserActionController.prototype.cleanup = function () {
        var _a;
        (_a = this.allMonitorsSub) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        this.allMonitorsSub = undefined;
    };
    return UserActionController;
}());
exports.UserActionController = UserActionController;
//# sourceMappingURL=userActionController.js.map