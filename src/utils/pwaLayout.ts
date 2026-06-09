import { isStandalonePwa } from './isStandalonePwa'

const IOS_HOME_INDICATOR_FALLBACK = 34

function isIosDevice(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function ensureDvhProbe(): HTMLDivElement {
  let probe = document.getElementById('pwa-dvh-probe') as HTMLDivElement | null
  if (!probe) {
    probe = document.createElement('div')
    probe.id = 'pwa-dvh-probe'
    probe.setAttribute('aria-hidden', 'true')
    probe.style.cssText =
      'position:fixed;top:0;left:0;width:0;height:100dvh;visibility:hidden;pointer-events:none;'
    document.documentElement.appendChild(probe)
  }
  return probe
}

function measureBottomInset(fullHeight: number): number {
  const layoutGap = Math.max(0, fullHeight - document.documentElement.clientHeight)
  const dvhHeight = ensureDvhProbe().getBoundingClientRect().height
  const dvhGap = Math.max(0, fullHeight - dvhHeight)

  const inset = Math.max(layoutGap, dvhGap)
  if (inset > 0) {
    return inset
  }

  if (isIosDevice()) {
    return IOS_HOME_INDICATOR_FALLBACK
  }

  return 0
}

/** Pin standalone shell to physical screen height; position nav at true bottom. */
export function syncPwaLayout(): void {
  if (!isStandalonePwa()) {
    document.documentElement.style.removeProperty('--pwa-height')
    document.documentElement.style.removeProperty('--pwa-bottom-inset')
    document.documentElement.style.removeProperty('--pwa-nav-height')
    return
  }

  const fullHeight = window.innerHeight
  document.documentElement.style.setProperty('--pwa-height', `${fullHeight}px`)
  document.documentElement.style.setProperty(
    '--pwa-bottom-inset',
    `${measureBottomInset(fullHeight)}px`,
  )

  const nav = document.querySelector<HTMLElement>('.mobile-nav')
  if (nav) {
    document.documentElement.style.setProperty(
      '--pwa-nav-height',
      `${nav.getBoundingClientRect().height}px`,
    )
  }
}

export function setupPwaLayout(): void {
  const schedule = (): void => {
    syncPwaLayout()
    requestAnimationFrame(syncPwaLayout)
  }

  schedule()

  window.addEventListener('resize', schedule)
  window.addEventListener('orientationchange', schedule)
  window.visualViewport?.addEventListener('resize', schedule)

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule)
  }

  window.addEventListener('load', schedule)
}
