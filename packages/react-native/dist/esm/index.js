// Main entry point for @grafana/faro-react-native
// Apply PerformanceObserver polyfill first to prevent iOS bad_variant_access crash
import { applyPerformanceObserverPolyfill } from './util/performanceObserverPolyfill';
applyPerformanceObserverPolyfill();
export { initializeFaro } from './initialize';
export { faro } from '@grafana/faro-core';
// Export sampling (Flutter-style interface)
export { SamplingFunction, SamplingRate } from './config/sampling';
// Export instrumentation helpers
export { getRNInstrumentations } from './config/getRNInstrumentations';
// Export instrumentations
export { ErrorMechanism, ErrorsInstrumentation } from './instrumentations/errors';
export { ConsoleInstrumentation } from './instrumentations/console';
export { SessionInstrumentation } from './instrumentations/session';
export { getSessionAttributes, loadSessionDeviceAttributesForInit, minimalSessionDeviceAttributes, } from './instrumentations/session/sessionAttributes';
export { ViewInstrumentation } from './instrumentations/view';
export { AppStateInstrumentation } from './instrumentations/appState';
export { UserActionInstrumentation } from './instrumentations/userActions';
export { HttpInstrumentation } from './instrumentations/http';
export { XHRInstrumentation } from './instrumentations/xhr';
export { PerformanceInstrumentation } from './instrumentations/performance';
export { StartupInstrumentation } from './instrumentations/startup';
export { FrameMonitoringInstrumentation } from './instrumentations/frameMonitoring';
export { ANRInstrumentation } from './instrumentations/anr';
export { CrashReportingInstrumentation } from './instrumentations/crashReporting';
// Export console utilities
export { reactNativeLogArgsSerializer } from './instrumentations/console/utils';
// Export user action helpers
export { withFaroUserAction, trackUserAction, } from './instrumentations/userActions/withFaroUserAction';
export { notifyHttpRequestEnd, notifyHttpRequestStart } from './instrumentations/userActions/httpRequestMonitor';
// Export error boundary
export { FaroErrorBoundary } from './errorBoundary/FaroErrorBoundary';
export { withFaroErrorBoundary } from './errorBoundary/withFaroErrorBoundary';
// Export metas
export { getPageMeta } from './metas/page';
export { getScreenMeta } from './metas/screen';
export { getSdkMeta } from './metas/sdk';
// Export transports
export { FetchTransport } from './transports/fetch';
export { ConsoleTransport } from './transports/console';
export { OfflineTransport } from './transports/offline';
// Export data collection policy
export { createDataCollectionPolicy, getDataCollectionPolicy, initializeDataCollectionPolicy, setDataCollectionPolicy, } from './dataCollection';
// Export user persistence
export { createUserPersistence, getUserPersistence, initializeUserPersistence, setUserPersistence, } from './userPersistence';
// Export navigation utilities
export { ReactNativeNavigationIntegration } from './navigation/v6';
export { useFaroNavigation, createNavigationStateChangeHandler, getCurrentRoute, getRouteName, onNavigationStateChange, } from './navigation';
// Export LogLevel and InternalLoggerLevel from our local copy (avoid bundling faro-core's web code)
export { LogLevel, InternalLoggerLevel, allLogLevels, defaultLogLevel } from './internalLogger';
//# sourceMappingURL=index.js.map