import { type Faro } from '@grafana/faro-core';
import type { ReactNativeConfig } from './config/types';
/**
 * Awaits async device/session attribute collection, then initializes Faro with core `initializeFaro`.
 * On failure during collection, uses `minimalSessionDeviceAttributes` before init.
 */
export declare function initializeFaro(config: ReactNativeConfig): Promise<Faro>;
