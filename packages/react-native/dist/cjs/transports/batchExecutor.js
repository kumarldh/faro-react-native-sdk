"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RNBatchExecutor = void 0;
var react_native_1 = require("react-native");
var DEFAULT_SEND_TIMEOUT_MS = 250;
var DEFAULT_BATCH_ITEM_LIMIT = 50;
var RNBatchExecutor = /** @class */ (function () {
    function RNBatchExecutor(sendFn, options) {
        var _this = this;
        var _a, _b;
        this.signalBuffer = [];
        this.itemLimit = (_a = options === null || options === void 0 ? void 0 : options.itemLimit) !== null && _a !== void 0 ? _a : DEFAULT_BATCH_ITEM_LIMIT;
        this.sendTimeout = (_b = options === null || options === void 0 ? void 0 : options.sendTimeout) !== null && _b !== void 0 ? _b : DEFAULT_SEND_TIMEOUT_MS;
        this.paused = (options === null || options === void 0 ? void 0 : options.paused) || false;
        this.sendFn = sendFn;
        if (!this.paused) {
            this.start();
        }
        // Send batched/buffered data when app goes to background
        // This is the React Native equivalent of document.visibilitychange
        this.appStateSubscription = react_native_1.AppState.addEventListener('change', function (nextAppState) {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                _this.flush();
            }
        });
    }
    RNBatchExecutor.prototype.addItem = function (item) {
        if (this.paused) {
            return;
        }
        this.signalBuffer.push(item);
        if (this.signalBuffer.length >= this.itemLimit) {
            this.flush();
        }
    };
    RNBatchExecutor.prototype.start = function () {
        var _this = this;
        this.paused = false;
        if (this.sendTimeout > 0) {
            // Use global setInterval (not window.setInterval)
            this.flushInterval = setInterval(function () { return _this.flush(); }, this.sendTimeout);
        }
    };
    RNBatchExecutor.prototype.pause = function () {
        this.paused = true;
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
        }
    };
    RNBatchExecutor.prototype.cleanup = function () {
        this.pause();
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
        }
    };
    RNBatchExecutor.prototype.groupItems = function (items) {
        var itemMap = new Map();
        items.forEach(function (item) {
            var metaKey = JSON.stringify(item.meta);
            var currentItems = itemMap.get(metaKey);
            if (currentItems === undefined) {
                currentItems = [item];
            }
            else {
                currentItems = __spreadArray(__spreadArray([], currentItems, true), [item], false);
            }
            itemMap.set(metaKey, currentItems);
        });
        return Array.from(itemMap.values());
    };
    RNBatchExecutor.prototype.flush = function () {
        if (this.paused || this.signalBuffer.length === 0) {
            return;
        }
        var itemGroups = this.groupItems(this.signalBuffer);
        itemGroups.forEach(this.sendFn);
        this.signalBuffer = [];
    };
    return RNBatchExecutor;
}());
exports.RNBatchExecutor = RNBatchExecutor;
//# sourceMappingURL=batchExecutor.js.map