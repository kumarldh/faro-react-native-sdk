import { faro, UserActionState, } from '@grafana/faro-core';
/**
 * PushEvent options with action context for linking events to user actions.
 * When an active user action exists, adds payload.action so events appear in
 * Grafana's user action table (e.g. HTTP Errors column).
 */
export function getPushEventOptionsWithActionContext() {
    var _a, _b, _c;
    try {
        const currentAction = (_b = (_a = faro.api) === null || _a === void 0 ? void 0 : _a.getActiveUserAction) === null || _b === void 0 ? void 0 : _b.call(_a);
        const state = (_c = currentAction === null || currentAction === void 0 ? void 0 : currentAction.getState) === null || _c === void 0 ? void 0 : _c.call(currentAction);
        if (currentAction && (state === UserActionState.Started || state === UserActionState.Halted)) {
            const name = currentAction.name;
            const parentId = currentAction.parentId;
            return {
                customPayloadTransformer: (payload) => {
                    payload.action = { name, parentId };
                    return payload;
                },
            };
        }
    }
    catch (_) {
        // Silently fail - don't log to avoid instrumentation loops
    }
    return undefined;
}
//# sourceMappingURL=actionContext.js.map