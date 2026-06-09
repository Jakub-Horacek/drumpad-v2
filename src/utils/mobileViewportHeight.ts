/** Sync --app-height to the visible viewport (fixes iOS Safari / PWA bottom gaps). */
export function syncMobileAppHeight(): void {
  const height = window.visualViewport?.height ?? window.innerHeight
  document.documentElement.style.setProperty('--app-height', `${height}px`)
}

export function setupMobileViewportHeight(): void {
  syncMobileAppHeight()
  window.addEventListener('resize', syncMobileAppHeight)
  window.visualViewport?.addEventListener('resize', syncMobileAppHeight)
  window.visualViewport?.addEventListener('scroll', syncMobileAppHeight)
}
