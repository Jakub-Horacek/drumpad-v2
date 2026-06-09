import { isStandalonePwa } from './isStandalonePwa'

const NAV_PADDING_PX = 12 // 0.75rem
const IOS_HOME_INDICATOR_FALLBACK = 34

function isIosDevice(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function isMobileTouch(): boolean {
  return window.matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)').matches
}

function clearStandaloneLayout(): void {
  const { documentElement: html, body } = document

  html.classList.remove('pwa-layout-ready')
  html.style.removeProperty('height')
  html.style.removeProperty('max-height')
  html.style.removeProperty('overflow')

  body.style.removeProperty('position')
  body.style.removeProperty('top')
  body.style.removeProperty('left')
  body.style.removeProperty('right')
  body.style.removeProperty('width')
  body.style.removeProperty('height')
  body.style.removeProperty('max-height')
  body.style.removeProperty('margin')
  body.style.removeProperty('padding')
  body.style.removeProperty('overflow')
  body.style.removeProperty('display')
  body.style.removeProperty('flex-direction')
  body.style.removeProperty('box-sizing')

  html.style.removeProperty('--pwa-height')
  html.style.removeProperty('--pwa-nav-height')

  const nav = document.querySelector<HTMLElement>('.mobile-nav')
  nav?.style.removeProperty('position')
  nav?.style.removeProperty('left')
  nav?.style.removeProperty('right')
  nav?.style.removeProperty('bottom')
  nav?.style.removeProperty('width')
  nav?.style.removeProperty('margin')
  nav?.style.removeProperty('z-index')
  nav?.style.removeProperty('box-sizing')
  nav?.style.removeProperty('padding-top')
  nav?.style.removeProperty('padding-left')
  nav?.style.removeProperty('padding-right')
  nav?.style.removeProperty('padding-bottom')
  nav?.style.removeProperty('transform')

  const main = document.querySelector<HTMLElement>('.app-main')
  main?.style.removeProperty('padding-bottom')
}

function applyStandaloneShell(screenHeight: number): void {
  const { documentElement: html, body } = document

  html.style.height = `${screenHeight}px`
  html.style.maxHeight = `${screenHeight}px`
  html.style.overflow = 'visible'

  body.style.position = 'fixed'
  body.style.top = '0'
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'
  body.style.height = `${screenHeight}px`
  body.style.maxHeight = `${screenHeight}px`
  body.style.margin = '0'
  body.style.padding = '0'
  // Must stay visible — overflow:hidden on ancestors clips fixed nav translateY.
  body.style.overflow = 'visible'
  body.style.display = 'flex'
  body.style.flexDirection = 'column'
  body.style.boxSizing = 'border-box'

  html.style.setProperty('--pwa-height', `${screenHeight}px`)
}

/** Shift fixed nav down until its box meets the physical screen bottom. */
function pinNavToScreenBottom(screenHeight: number): void {
  const nav = document.querySelector<HTMLElement>('.mobile-nav')
  const app = document.querySelector<HTMLElement>('#app')
  const main = document.querySelector<HTMLElement>('.app-main')
  if (!nav) {
    return
  }

  if (app) {
    app.style.overflow = 'hidden'
  }

  nav.style.position = 'fixed'
  nav.style.left = '0'
  nav.style.right = '0'
  nav.style.bottom = '0'
  nav.style.width = '100%'
  nav.style.margin = '0'
  nav.style.zIndex = '200'
  nav.style.boxSizing = 'border-box'
  nav.style.paddingTop = `${NAV_PADDING_PX}px`
  nav.style.paddingLeft = `${NAV_PADDING_PX}px`
  nav.style.paddingRight = `${NAV_PADDING_PX}px`
  nav.style.paddingBottom = `${NAV_PADDING_PX}px`
  nav.style.transform = 'none'

  // Force layout before measuring the iOS layout-viewport shortfall.
  void nav.offsetHeight

  let gap = Math.max(0, screenHeight - nav.getBoundingClientRect().bottom)
  if (gap === 0 && isIosDevice()) {
    gap = IOS_HOME_INDICATOR_FALLBACK
  }
  if (gap > 0) {
    nav.style.transform = `translate3d(0, ${gap}px, 0)`
  }

  const navHeight = nav.getBoundingClientRect().height
  document.documentElement.style.setProperty('--pwa-nav-height', `${navHeight}px`)

  if (main) {
    main.style.paddingBottom = `${navHeight}px`
  }
}

/**
 * iOS standalone: CSS viewport units lie. Measure the real screen in JS and
 * pin the nav with inline styles so scoped component CSS cannot override.
 */
export function syncPwaLayout(): void {
  if (!isStandalonePwa() || !isMobileTouch()) {
    clearStandaloneLayout()
    return
  }

  const screenHeight = window.innerHeight
  applyStandaloneShell(screenHeight)
  pinNavToScreenBottom(screenHeight)
  document.documentElement.classList.add('pwa-layout-ready')
}

let layoutRaf = 0

function schedulePwaLayout(): void {
  if (layoutRaf) {
    return
  }
  layoutRaf = requestAnimationFrame(() => {
    layoutRaf = 0
    syncPwaLayout()
    requestAnimationFrame(syncPwaLayout)
  })
}

export function setupPwaLayout(): void {
  schedulePwaLayout()

  window.addEventListener('resize', schedulePwaLayout)
  window.addEventListener('orientationchange', schedulePwaLayout)
  window.visualViewport?.addEventListener('resize', schedulePwaLayout)
  window.visualViewport?.addEventListener('scroll', schedulePwaLayout)

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedulePwaLayout)
  }

  window.addEventListener('load', schedulePwaLayout)
}
