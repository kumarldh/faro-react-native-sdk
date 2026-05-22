"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPushEventOptionsWithActionContext = getPushEventOptionsWithActionContext;
var faro_core_1 = require("@grafana/faro-core");
/**
 * PushEvent options with action context for linking events to user actions.
 * When an active user action exists, adds payload.action so events appear in
 * Grafana's user action table (e.g. HTTP Errors column).
 */
function getPushEventOptionsWithActionContext() {
    var _a, _b, _c;
    try {
        var currentAction = (_b = (_a = faro_core_1.faro.api) === null || _a === void 0 ? void 0 : _a.getActiveUserAction) === null || _b === void 0 ? void 0 : _b.call(_a);
        var state = (_c = currentAction === null || currentAction === void 0 ? void 0 : currentAction.getState) === null || _c === void 0 ? void 0 : _c.call(currentAction);
        if (currentAction && (state === faro_core_1.UserActionState.Started || state === faro_core_1.UserActionState.Halted)) {
            var name_1 = currentAction.name;
            var parentId_1 = currentAction.parentId;
            return {
                customPayloadTransformer: function (payload) {
                    payload.action = { name: name_1, parentId: parentId_1 };
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