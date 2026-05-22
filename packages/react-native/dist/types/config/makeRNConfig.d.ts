import type { SessionAttributes } from '../instrumentations/session/sessionAttributes';
import type { ReactNativeConfig, ReactNativeFullConfig } from './types';
/**
 * Creates a full Faro config from React Native flag-based config.
 *
 * Based on flags, builds instrumentations and transports automatically.
 * Client just enables what they need; makeRNConfig does the rest.
 *
 * @param preloadedSessionDeviceAttributes Device/session fields for session meta (passed from async `initializeFaro`).
 */
export declare function makeRNConfig(config: ReactNativeConfig, preloadedSessionDeviceAttributes?: SessionAttributes): ReactNativeFullConfig;
