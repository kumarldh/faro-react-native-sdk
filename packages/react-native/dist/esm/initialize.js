var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initializeFaro as initializeFaroCore } from '@grafana/faro-core';
import { makeRNConfig } from './config/makeRNConfig';
import { loadSessionDeviceAttributesForInit } from './instrumentations/session/sessionAttributes';
/**
 * Awaits async device/session attribute collection, then initializes Faro with core `initializeFaro`.
 * On failure during collection, uses `minimalSessionDeviceAttributes` before init.
 */
export function initializeFaro(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const preloadedSessionDeviceAttributes = yield loadSessionDeviceAttributesForInit();
        const fullConfig = makeRNConfig(config, preloadedSessionDeviceAttributes);
        return initializeFaroCore(fullConfig);
    });
}
//# sourceMappingURL=initialize.js.map