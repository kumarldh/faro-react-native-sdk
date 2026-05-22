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
exports.ReactNativeNavigationIntegration = void 0;
var faro_core_1 = require("@grafana/faro-core");
/**
 * React Navigation v6 instrumentation for Faro
 * Tracks navigation events and screen changes
 */
var ReactNativeNavigationIntegration = /** @class */ (function (_super) {
    __extends(ReactNativeNavigationIntegration, _super);
    function ReactNativeNavigationIntegration(_config) {
        var _this = _super.call(this) || this;
        _this.name = '@grafana/faro-react-native-navigation';
        _this.version = '1.0.0';
        return _this;
        // config will be used when implementing navigation tracking
    }
    ReactNativeNavigationIntegration.prototype.initialize = function () {
        // TODO: Implement navigation tracking
        this.logInfo('React Navigation integration initialized (placeholder)');
    };
    return ReactNativeNavigationIntegration;
}(faro_core_1.BaseInstrumentation));
exports.ReactNativeNavigationIntegration = ReactNativeNavigationIntegration;
//# sourceMappingURL=index.js.map