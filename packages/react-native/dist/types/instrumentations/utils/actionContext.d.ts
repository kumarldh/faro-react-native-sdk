import { type PushEventOptions } from '@grafana/faro-core';
/**
 * PushEvent options with action context for linking events to user actions.
 * When an active user action exists, adds payload.action so events appear in
 * Grafana's user action table (e.g. HTTP Errors column).
 */
export declare function getPushEventOptionsWithActionContext(): PushEventOptions | undefined;
