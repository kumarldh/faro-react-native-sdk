"use strict";
/**
 * Semantic convention attributes for React Native tracing
 * Based on OpenTelemetry semantic conventions with React Native-specific additions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ATTR_PROCESS_RUNTIME_VERSION = exports.ATTR_PROCESS_RUNTIME_NAME = exports.ATTR_TELEMETRY_DISTRO_VERSION = exports.ATTR_TELEMETRY_DISTRO_NAME = exports.ATTR_DEPLOYMENT_ENVIRONMENT_NAME = exports.ATTR_SERVICE_NAMESPACE = exports.ATTR_APP_BUILD = exports.ATTR_APP_VERSION = exports.ATTR_DEVICE_LOCALE = exports.ATTR_DEVICE_TYPE = exports.ATTR_DEVICE_OS_VERSION = exports.ATTR_DEVICE_PLATFORM = exports.ATTR_DEVICE_BRAND = exports.ATTR_DEVICE_MODEL = exports.ATTR_SESSION_ID = void 0;
// Session attributes
exports.ATTR_SESSION_ID = 'session.id';
// Device/Platform attributes for React Native
exports.ATTR_DEVICE_MODEL = 'device.model';
exports.ATTR_DEVICE_BRAND = 'device.brand';
exports.ATTR_DEVICE_PLATFORM = 'device.platform';
exports.ATTR_DEVICE_OS_VERSION = 'device.os.version';
exports.ATTR_DEVICE_TYPE = 'device.type';
exports.ATTR_DEVICE_LOCALE = 'device.locale';
// App attributes
exports.ATTR_APP_VERSION = 'app.version';
exports.ATTR_APP_BUILD = 'app.build';
// Service attributes
exports.ATTR_SERVICE_NAMESPACE = 'service.namespace';
exports.ATTR_DEPLOYMENT_ENVIRONMENT_NAME = 'deployment.environment.name';
// Telemetry attributes
exports.ATTR_TELEMETRY_DISTRO_NAME = 'telemetry.distro.name';
exports.ATTR_TELEMETRY_DISTRO_VERSION = 'telemetry.distro.version';
// Process/Runtime attributes
exports.ATTR_PROCESS_RUNTIME_NAME = 'process.runtime.name';
exports.ATTR_PROCESS_RUNTIME_VERSION = 'process.runtime.version';
//# sourceMappingURL=semconv.js.map