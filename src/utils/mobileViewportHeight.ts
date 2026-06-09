import { isStandalonePwa } from './isStandalonePwa'

/** Browser tabs: pin shell to visualViewport (Safari toolbar). PWA uses CSS 100vh on iOS. */
export function syncMobileAppHeight(): void {
  if (isStandalonePwa()) {
    document.documentElement.style.removeProperty('--app-height')
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
