import type { Meta, MetaItem } from '@grafana/faro-core';
/**
 * SDK meta for React Native.
 * - `sdk.version`: `@grafana/faro-core` release (same as Faro Web SDK).
 * - `sdk.name`: integration id (`faro-web` / `faro-react-native`).
 * - `sdk.integrations`: published `@grafana/faro-react-native` npm name and semver for this build.
 */
export declare const getSdkMeta: () => MetaItem<Pick<Meta, "sdk">>;
