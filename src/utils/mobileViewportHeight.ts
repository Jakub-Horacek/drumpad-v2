import { isStandalonePwa } from './isStandalonePwa'
import { syncPwaLayout } from './pwaLayout'

export function syncMobileAppHeight(): void {
  if (isStandalonePwa()) {
    syncPwaLayout()
    return
  }

  const height = window.visualViewport?.height ?? window.innerHeight
  document.documentElement.style.setProperty('--app-height', `${height}px`)
}

export function setupMobileViewportHeight(): void {
  const schedule = (): void => syncMobileAppHeight()

  schedule()

  window.addEventListener('resize', schedule)
  window.addEventListener('orientationchange', schedule)
  window.visualViewport?.addEventListener('resize', schedule)
  window.visualViewport?.addEventListener('scroll', schedule)

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule)
  }

  window.addEventListener('load', schedule)
}
