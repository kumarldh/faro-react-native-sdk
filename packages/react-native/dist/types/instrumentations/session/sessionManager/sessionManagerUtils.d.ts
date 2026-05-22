import type { Meta } from '@grafana/faro-core';
import type { FaroUserSession } from './types';
type CreateUserSessionObjectParams = {
    sessionId?: string;
    started?: number;
    lastActivity?: number;
    isSampled?: boolean;
};
export declare function createUserSessionObject({ sessionId, started, lastActivity, isSampled: sampledValue, }?: CreateUserSessionObjectParams): FaroUserSession;
export declare function isUserSessionValid(session: FaroUserSession | null): boolean;
type GetUserSessionUpdaterParams = {
    storeUserSession: (session: FaroUserSession) => void | Promise<void>;
    fetchUserSession: () => FaroUserSession | null | Promise<FaroUserSession | null>;
};
export declare function getUserSessionUpdater({ fetchUserSession, storeUserSession, }: GetUserSessionUpdaterParams): () => Promise<void>;
export declare function addSessionMetadataToNextSession(newSession: FaroUserSession, previousSession: FaroUserSession | null): Required<FaroUserSession>;
type GetUserSessionMetaUpdateHandlerParams = {
    storeUserSession: (session: FaroUserSession) => void | Promise<void>;
    fetchUserSession: () => FaroUserSession | null | Promise<FaroUserSession | null>;
};
export declare function getSessionMetaUpdateHandler({ fetchUserSession, storeUserSession, }: GetUserSessionMetaUpdateHandlerParams): (meta: Meta) => Promise<void>;
export {};
