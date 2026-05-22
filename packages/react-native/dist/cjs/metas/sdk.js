"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSdkMeta = void 0;
var faro_core_1 = require("@grafana/faro-core");
var faroRNPackageMeta_1 = require("../generated/faroRNPackageMeta");
/**
 * SDK meta for React Native.
 * - `sdk.version`: `@grafana/faro-core` release (same as Faro Web SDK).
 * - `sdk.name`: integration id (`faro-web` / `faro-react-native`).
 * - `sdk.integrations`: published `@grafana/faro-react-native` npm name and semver for this build.
 */
var getSdkMeta = function () {
    return function () { return ({
        sdk: {
            name: 'faro-react-native',
            version: faro_core_1.VERSION,
            integrations: [
                {
                    name: faroRNPackageMeta_1.FARO_REACT_NATIVE_NPM_NAME,
                    version: faroRNPackageMeta_1.FARO_REACT_NATIVE_NPM_VERSION,
                },
            ],
        },
    }); };
};
exports.getSdkMeta = getSdkMeta;
//# sourceMappingURL=sdk.js.map