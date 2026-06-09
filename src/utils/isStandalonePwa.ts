const STANDALONE_DISPLAY_MEDIA_QUERY =
  '(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)'

/** True when running as an installed PWA, not in a browser tab. */
export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  if (document.documentElement.classList.contains('is-standalone-pwa')) {
    return true
  }

  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean }
  if (navigatorWithStandalone.standalone === true) {
    return true
  }

  return window.matchMedia(STANDALONE_DISPLAY_MEDIA_QUERY).matches
}
