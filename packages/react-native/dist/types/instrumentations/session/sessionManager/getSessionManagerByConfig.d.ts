import type { Config } from '@grafana/faro-core';
import type { SessionManager } from './types';
export declare function getSessionManagerByConfig(sessionTrackingConfig: Required<Config>['sessionTracking']): SessionManager;
