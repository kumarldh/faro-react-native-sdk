import { type Meta, type MetaItem } from '@grafana/faro-core';
type CreateScreenMetaProps = {
    generateScreenId?: (screenName: string) => string;
    initialScreenMeta?: Meta['page'];
};
/**
 * Screen meta for React Native
 * Tracks the current screen name instead of URL (as in web page meta)
 */
export declare function createScreenMeta({ generateScreenId, initialScreenMeta }?: CreateScreenMetaProps): MetaItem<Pick<Meta, 'page'>>;
/**
 * Updates the current screen name
 * Called by navigation instrumentation when screen changes
 */
export declare function setCurrentScreen(screenName: string): void;
/**
 * Gets the current screen name
 */
export declare function getCurrentScreen(): string | undefined;
/**
 * Default screen meta with no custom configuration
 */
export declare const getScreenMeta: () => MetaItem<Pick<Meta, "page">>;
export {};
