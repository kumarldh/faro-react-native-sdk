import type { UserActionInternalInterface } from '@grafana/faro-core';
/**
 * Controller for managing user action lifecycle in React Native
 *
 * Responsibilities:
 * - Monitor HTTP requests triggered by user actions
 * - Intelligently determine when a user action is complete
 * - Handle "halt" state for pending async operations
 * - Auto-end actions after timeout
 */
export declare class UserActionController {
    private userAction;
    private readonly http;
    private allMonitorsSub?;
    private followUpTid?;
    private haltTid?;
    private runningRequests;
    private isHalted;
    constructor(userAction: UserActionInternalInterface);
    /**
     * Attach the controller to start monitoring
     */
    attach(): void;
    /**
     * Put the action in halt state (waiting for async operations)
     */
    private halt;
    /**
     * End the user action
     */
    private end;
    /**
     * Schedule the follow-up action to end the user action
     */
    private scheduleFollowUpAction;
    /**
     * Clear the follow-up timeout
     */
    private clearFollowUpTimeout;
    /**
     * Clear the halt timeout
     */
    private clearHaltTimeout;
    /**
     * Clean up subscriptions
     */
    private cleanup;
}
