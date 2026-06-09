import { isStandalonePwa } from './isStandalonePwa'

let dvhProbe: HTMLDivElement | null = null

/** Compare innerHeight to a live 100dvh probe — reliable when clientHeight still matches innerHeight. */
function measureDvhBottomGap(fullHeight: number): number {
  if (!dvhProbe) {
    dvhProbe = document.createElement('div')
    dvhProbe.setAttribute('aria-hidden', 'true')
    dvhProbe.style.cssText =
      'position:fixed;left:0;top:0;width:0;height:100dvh;pointer-events:none;visibility:hidden;'
    document.documentElement.appendChild(dvhProbe)
  }

  const dvhHeight = dvhProbe.getBoundingClientRect().height
  return Math.max(0, fullHeight - dvhHeight)
}

/**
 * iOS standalone PWAs resolve 100dvh to a layout viewport that excludes the
 * home-indicator band (~34px) while env(safe-area-inset-bottom) often returns 0.
 * Size the shell to window.innerHeight and extend nav padding by the measured gap.
 *
 * @see https://stackoverflow.com/questions/79902310/
 */
export function syncPwaShellLayout(): void {
  if (!isStandalonePwa()) {
    document.documentElement.style.removeProperty('--pwa-shell-height')
    document.documentElement.style.removeProperty('--pwa-bottom-gap')
    return
  }

  const fullHeight = window.innerHeight
  const layoutHeight = document.documentElement.clientHeight

  let bottomGap = Math.max(0, fullHeight - layoutHeight, measureDvhBottomGap(fullHeight))

  const vv = window.visualViewport
  if (vv) {
    bottomGap = Math.max(bottomGap, Math.max(0, fullHeight - (vv.height + vv.offsetTop)))
  }

  document.documentElement.style.setProperty('--pwa-shell-height', `${fullHeight}px`)
  document.documentElement.style.setProperty('--pwa-bottom-gap', `${bottomGap}px`)
}

/** Browser: visualViewport height. PWA: physical innerHeight + measured bottom gap. */
export function syncMobileAppHeight(): void {
  if (isStandalonePwa()) {
    syncPwaShellLayout()
    document.documentElement.style.removeProperty('--app-height')
    return
  }

  document.documentElement.style.removeProperty('--pwa-shell-height')
  document.documentElement.style.removeProperty('--pwa-bottom-gap')

  const height = window.visualViewport?.height ?? window.innerHeight
  document.documentElement.style.setProperty('--app-height', `${height}px`)
}

export function setupMobileViewportHeight(): void {
  const schedule = (): void => {
    syncMobileAppHeight()
    if (isStandalonePwa()) {
      requestAnimationFrame(syncPwaShellLayout)
    }
  }

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
