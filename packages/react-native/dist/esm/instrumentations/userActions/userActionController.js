import { Observable, UserActionState } from '@grafana/faro-core';
import { monitorHttpRequests } from './httpRequestMonitor';
const defaultFollowUpActionTimeRange = 100; // 100ms after activity stops
const defaultHaltTimeout = 10 * 1000; // 10 seconds max wait for HTTP
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
export class UserActionController {
    constructor(userAction) {
        this.userAction = userAction;
        this.http = monitorHttpRequests();
        this.runningRequests = new Map();
        this.isHalted = false;
    }
    /**
     * Attach the controller to start monitoring
     */
    attach() {
        // Subscribe to HTTP requests while action is active/halting
        this.allMonitorsSub = new Observable()
            .merge(this.http)
            .takeWhile(() => {
            const state = this.userAction.getState();
            return [UserActionState.Started, UserActionState.Halted].includes(state);
        })
            .filter((msg) => {
            // If the user action is in halt state, we only keep listening to ended http requests
            if (this.isHalted && !(isRequestEndMessage(msg) && this.runningRequests.has(msg.request.requestId))) {
                return false;
            }
            return true;
        })
            .subscribe((msg) => {
            if (isRequestStartMessage(msg)) {
                // Track started HTTP requests
                this.runningRequests.set(msg.request.requestId, msg.request);
            }
            if (isRequestEndMessage(msg)) {
                this.runningRequests.delete(msg.request.requestId);
            }
            // Clear any existing follow-up timeout
            this.clearFollowUpTimeout();
            // If we have pending HTTP requests, don't schedule follow-up yet
            if (this.runningRequests.size > 0) {
                // Enter halt state if we have pending requests
                if (this.userAction.getState() === UserActionState.Started) {
                    this.halt();
                }
            }
            else {
                // No pending requests, schedule action end
                this.scheduleFollowUpAction();
            }
        });
        // Start initial follow-up timeout
        this.scheduleFollowUpAction();
    }
    /**
     * Put the action in halt state (waiting for async operations)
     */
    halt() {
        if (this.userAction.getState() === UserActionState.Started && !this.isHalted) {
            this.userAction.halt();
            this.isHalted = true;
            // Start halt timeout - max time to wait for pending operations
            this.haltTid = startTimeout(() => {
                this.end();
            }, defaultHaltTimeout);
        }
    }
    /**
     * End the user action
     */
    end() {
        this.clearFollowUpTimeout();
        this.clearHaltTimeout();
        // Skip if already ended (e.g. user called action.end() manually) - avoids duplicate events
        const state = this.userAction.getState();
        if (state === UserActionState.Ended || state === UserActionState.Cancelled) {
            this.cleanup();
            return;
        }
        this.userAction.end();
        this.cleanup();
    }
    /**
     * Schedule the follow-up action to end the user action
     */
    scheduleFollowUpAction() {
        this.clearFollowUpTimeout();
        this.followUpTid = startTimeout(() => {
            this.end();
        }, defaultFollowUpActionTimeRange);
    }
    /**
     * Clear the follow-up timeout
     */
    clearFollowUpTimeout() {
        if (this.followUpTid !== undefined) {
            clearTimeout(this.followUpTid);
            this.followUpTid = undefined;
        }
    }
    /**
     * Clear the halt timeout
     */
    clearHaltTimeout() {
        if (this.haltTid !== undefined) {
            clearTimeout(this.haltTid);
            this.haltTid = undefined;
        }
    }
    /**
     * Clean up subscriptions
     */
    cleanup() {
        var _a;
        (_a = this.allMonitorsSub) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        this.allMonitorsSub = undefined;
    }
}
//# sourceMappingURL=userActionController.js.map