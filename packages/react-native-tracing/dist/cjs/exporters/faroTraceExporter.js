"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaroTraceExporter = void 0;
var core_1 = require("@opentelemetry/core");
var internal_1 = require("@opentelemetry/otlp-transformer/build/src/trace/internal");
var faro_core_1 = require("@grafana/faro-core");
var internalLogger = (0, faro_core_1.createInternalLogger)();
var faroTraceExporter_utils_1 = require("./faroTraceExporter.utils");
/**
 * FaroTraceExporter for React Native
 *
 * Exports OpenTelemetry spans to Faro backend using pushTraces API.
 *
 * IMPORTANT: To avoid infinite loops:
 * - Uses internalLogger instead of console
 * - Does NOT log during export (except errors)
 * - Relies on Faro's internal deduplication
 */
var FaroTraceExporter = /** @class */ (function () {
    function FaroTraceExporter(config) {
        this.config = config;
        this._isShutdown = false;
    }
    FaroTraceExporter.prototype.export = function (spans, resultCallback) {
        if (this._isShutdown) {
            internalLogger.error('FaroTraceExporter: Cannot export spans, exporter is shut down');
            resultCallback({ code: core_1.ExportResultCode.FAILED });
            return;
        }
        try {
            // Convert spans to OTLP format
            var traceEvent = (0, internal_1.createExportTraceServiceRequest)(spans, { useHex: true, useLongBits: false });
            // Send traces to Faro
            this.config.api.pushTraces(traceEvent);
            // Send Faro events for CLIENT spans (HTTP requests, etc.)
            // This is done WITHOUT logging to avoid infinite loops
            (0, faroTraceExporter_utils_1.sendFaroEvents)(traceEvent.resourceSpans);
            resultCallback({ code: core_1.ExportResultCode.SUCCESS });
        }
        catch (error) {
            // Only log critical errors
            internalLogger.error('FaroTraceExporter: Failed to export spans', error);
            resultCallback({ code: core_1.ExportResultCode.FAILED });
        }
    };
    FaroTraceExporter.prototype.shutdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._isShutdown = true;
                return [2 /*return*/, Promise.resolve(undefined)];
            });
        });
    };
    FaroTraceExporter.prototype.forceFlush = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // No-op for now - spans are sent immediately via pushTraces
                return [2 /*return*/, Promise.resolve(undefined)];
            });
        });
    };
    return FaroTraceExporter;
}());
exports.FaroTraceExporter = FaroTraceExporter;
//# sourceMappingURL=faroTraceExporter.js.map