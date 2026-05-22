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
exports.TracingInstrumentation = void 0;
/**
 * Jest stub for optional peer `@grafana/faro-react-native-tracing`.
 * Mapped via moduleNameMapper so tests run without installing the tracing workspace package.
 */
var faro_core_1 = require("@grafana/faro-core");
var TracingInstrumentation = /** @class */ (function (_super) {
    __extends(TracingInstrumentation, _super);
    function TracingInstrumentation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = '@grafana/faro-react-native-tracing';
        _this.version = faro_core_1.VERSION;
        return _this;
    }
    TracingInstrumentation.prototype.initialize = function () { };
    return TracingInstrumentation;
}(faro_core_1.BaseInstrumentation));
exports.TracingInstrumentation = TracingInstrumentation;
//# sourceMappingURL=mockFaroReactNativeTracing.js.map