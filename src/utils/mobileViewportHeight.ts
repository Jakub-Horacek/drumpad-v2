import { isStandalonePwa } from './isStandalonePwa'

/**
 * Sync --app-height to the visible viewport.
 * Browser: visualViewport (accounts for Safari's bottom toolbar).
 * PWA: innerHeight (full screen — no browser chrome to reserve space for).
 */
export function syncMobileAppHeight(): void {
  const height = isStandalonePwa()
    ? window.innerHeight
    : (window.visualViewport?.height ?? window.innerHeight)

  document.documentElement.style.setProperty('--app-height', `${height}px`)
}

export function setupMobileViewportHeight(): void {
  syncMobileAppHeight()
  window.addEventListener('resize', syncMobileAppHeight)
  window.visualViewport?.addEventListener('resize', syncMobileAppHeight)
  window.visualViewport?.addEventListener('scroll', syncMobileAppHeight)
}
