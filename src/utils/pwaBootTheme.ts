import { THEME_BG_COLORS, THEME_NAV_BG_COLORS } from '../themes'

/** Sync html/body hex backgrounds before Vue hydrates (iOS ignores CSS variables for PWA chrome). */
export function applyPwaBootTheme(): void {
  if (!document.documentElement.classList.contains('is-standalone-pwa')) {
    return
  }

  const match = document.documentElement.className.match(/theme-(\w+)/)
  const themeId = match?.[1] ?? 'dark'
  const bg = THEME_BG_COLORS[themeId] ?? THEME_BG_COLORS.dark
  const nav = THEME_NAV_BG_COLORS[themeId] ?? THEME_NAV_BG_COLORS.dark

  document.documentElement.style.backgroundColor = bg
  document.body.style.backgroundColor = nav
}
