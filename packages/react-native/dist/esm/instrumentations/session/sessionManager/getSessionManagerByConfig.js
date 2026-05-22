import { MmkvPersistentSessionsManager } from './MmkvPersistentSessionsManager';
import { VolatileSessionsManager } from './VolatileSessionManager';
export function getSessionManagerByConfig(sessionTrackingConfig) {
    if (!sessionTrackingConfig.persistent) {
        return VolatileSessionsManager;
    }
    return MmkvPersistentSessionsManager;
}
//# sourceMappingURL=getSessionManagerByConfig.js.map