import { isStandalonePwa } from './isStandalonePwa'

/**
 * Sync --app-height to the visible viewport (browser only).
 * PWA layout uses CSS `position: fixed; inset: 0` instead — see main.css.
 */
export function syncMobileAppHeight(): void {
  if (isStandalonePwa()) {
    document.documentElement.style.removeProperty('--app-height')
    return
  }

  const height = window.visualViewport?.height ?? window.innerHeight
  document.documentElement.style.setProperty('--app-height', `${height}px`)
}

export function setupMobileViewportHeight(): void {
  syncMobileAppHeight()
  window.addEventListener('resize', syncMobileAppHeight)
  window.visualViewport?.addEventListener('resize', syncMobileAppHeight)
  window.visualViewport?.addEventListener('scroll', syncMobileAppHeight)
}
