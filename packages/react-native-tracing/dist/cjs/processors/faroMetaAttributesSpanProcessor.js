"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaroMetaAttributesSpanProcessor = void 0;
var semconv_1 = require("../semconv");
/**
 * Span processor that adds Faro meta attributes to spans
 *
 * This processor enriches spans with:
 * - Session ID
 * - User information (email, id, username, etc.)
 *
 * IMPORTANT: This processor delegates to a wrapped processor and does NOT log
 * to avoid infinite loops.
 */
var FaroMetaAttributesSpanProcessor = /** @class */ (function () {
    function FaroMetaAttributesSpanProcessor(processor, metas) {
        this.processor = processor;
        this.metas = metas;
    }
    FaroMetaAttributesSpanProcessor.prototype.forceFlush = function () {
        return this.processor.forceFlush();
    };
    FaroMetaAttributesSpanProcessor.prototype.onStart = function (span, parentContext) {
        var _a;
        var session = this.metas.value.session;
        if (session === null || session === void 0 ? void 0 : session.id) {
            span.attributes[semconv_1.ATTR_SESSION_ID] = session.id;
        }
        var user = (_a = this.metas.value.user) !== null && _a !== void 0 ? _a : {};
        if (user.email) {
            span.attributes['user.email'] = user.email;
        }
        if (user.id) {
            span.attributes['user.id'] = user.id;
        }
        if (user.username) {
            span.attributes['user.name'] = user.username;
        }
        if (user.fullName) {
            span.attributes['user.full_name'] = user.fullName;
        }
        if (user.roles) {
            span.attributes['user.roles'] = user.roles.split(',').map(function (role) { return role.trim(); });
        }
        if (user.hash) {
            span.attributes['user.hash'] = user.hash;
        }
        this.processor.onStart(span, parentContext);
    };
    FaroMetaAttributesSpanProcessor.prototype.onEnd = function (span) {
        this.processor.onEnd(span);
    };
    FaroMetaAttributesSpanProcessor.prototype.shutdown = function () {
        return this.processor.shutdown();
    };
    return FaroMetaAttributesSpanProcessor;
}());
exports.FaroMetaAttributesSpanProcessor = FaroMetaAttributesSpanProcessor;
//# sourceMappingURL=faroMetaAttributesSpanProcessor.js.map