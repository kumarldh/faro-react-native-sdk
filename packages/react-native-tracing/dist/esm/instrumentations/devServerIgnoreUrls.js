const REACT_NATIVE_DEV_SERVER_IGNORE_URLS = [
    /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\]|10\.0\.2\.2)(?::\d+)?\/symbolicate(?:[/?#]|$)/,
];
export function getReactNativeDevServerIgnoreUrls() {
    return REACT_NATIVE_DEV_SERVER_IGNORE_URLS;
}
//# sourceMappingURL=devServerIgnoreUrls.js.map