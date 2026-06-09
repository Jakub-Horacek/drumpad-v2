import { isStandalonePwa } from './isStandalonePwa'

/** Standalone PWA: same flex shell as Safari, pinned to innerHeight / 100vh on iOS. */
export function syncPwaLayout(): void {
  if (!isStandalonePwa()) {
    return
  }

  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
}

export function setupPwaLayout(): void {
  const schedule = (): void => syncPwaLayout()

  schedule()

  window.addEventListener('resize', schedule)
  window.addEventListener('orientationchange', schedule)
  window.visualViewport?.addEventListener('resize', schedule)

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule)
  }

  window.addEventListener('load', schedule)
}
