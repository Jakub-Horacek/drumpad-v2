import { THEME_NAV_BG_COLORS } from '../themes'

/** Sync html/body hex backgrounds before Vue hydrates (iOS ignores CSS variables for PWA chrome). */
export function applyPwaBootTheme(): void {
  if (!document.documentElement.classList.contains('is-standalone-pwa')) {
    return
  }

  const match = document.documentElement.className.match(/theme-(\w+)/)
  const themeId = match?.[1] ?? 'dark'
  const nav = THEME_NAV_BG_COLORS[themeId] ?? THEME_NAV_BG_COLORS.dark

  document.documentElement.style.backgroundColor = nav
  document.body.style.backgroundColor = nav
}
