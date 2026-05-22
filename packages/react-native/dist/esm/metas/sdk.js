import { VERSION } from '@grafana/faro-core';
import { FARO_REACT_NATIVE_NPM_NAME, FARO_REACT_NATIVE_NPM_VERSION } from '../generated/faroRNPackageMeta';
/**
 * SDK meta for React Native.
 * - `sdk.version`: `@grafana/faro-core` release (same as Faro Web SDK).
 * - `sdk.name`: integration id (`faro-web` / `faro-react-native`).
 * - `sdk.integrations`: published `@grafana/faro-react-native` npm name and semver for this build.
 */
export const getSdkMeta = () => {
    return () => ({
        sdk: {
            name: 'faro-react-native',
            version: VERSION,
            integrations: [
                {
                    name: FARO_REACT_NATIVE_NPM_NAME,
                    version: FARO_REACT_NATIVE_NPM_VERSION,
                },
            ],
        },
    });
};
//# sourceMappingURL=sdk.js.map