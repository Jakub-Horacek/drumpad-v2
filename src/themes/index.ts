// Theme imports
import './dark.css'
import './og.css'
import './light.css'
import './cyber.css'
import './sunset.css'
import './ocean.css'

import { applyThemeFavicon } from './favicon'

export {
  applyThemeFavicon,
  buildThemeFaviconSvg,
  getThemeFaviconDataUrl,
  THEME_FAVICON_PALETTES,
} from './favicon'

/**
 * Interface representing a theme configuration.
 * Contains metadata about available themes in the application.
 */
export interface ThemeConfig {
  /** Unique identifier for the theme */
  id: string
  /** Display name of the theme */
  name: string
  /** Description of the theme's visual style */
  description: string
}

/**
 * Array of all available themes in the application.
 * Provides users with different visual styles to choose from.
 */
export const THEMES: ThemeConfig[] = [
  {
    id: 'dark',
    name: 'Dark',
    description: 'Default dark theme with blue accents',
  },
  {
    id: 'og',
    name: 'OG (Original)',
    description: 'Original screenshot colors with orange accents',
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Clean light theme with blue accents',
  },
  {
    id: 'cyber',
    name: 'Cyber',
    description: 'Futuristic cyberpunk theme with neon colors',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm dusk tones with coral accents',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep sea blues with teal accents',
  },
]

/**
 * Get a theme configuration by its ID.
 *
 * @param {string} id - The theme ID to search for
 * @returns {ThemeConfig | undefined} The theme configuration or undefined if not found
 */
export const getThemeById = (id: string): ThemeConfig | undefined => {
  return THEMES.find((theme) => theme.id === id)
}

/**
 * Get the default theme configuration.
 *
 * @returns {ThemeConfig} The default theme (Dark theme)
 */
export const getDefaultTheme = (): ThemeConfig => {
  return THEMES[0] // Dark theme as default
}

/** Browser chrome / status bar colors per theme (--bg-primary). */
export const THEME_BG_COLORS: Record<string, string> = {
  dark: '#0f0f23',
  og: '#282828',
  light: '#ffffff',
  cyber: '#000000',
  sunset: '#1c1218',
  ocean: '#041c2c',
}

/**
 * Apply the active theme to the document root so html/body and browser UI match.
 */
export const applyDocumentTheme = (themeId: string): void => {
  const id = getThemeById(themeId)?.id ?? 'dark'
  document.documentElement.className = `theme-${id}`
  const color = THEME_BG_COLORS[id] ?? THEME_BG_COLORS.dark
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
  document
    .querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    ?.setAttribute('content', id === 'light' ? 'default' : 'black-translucent')

  applyThemeFavicon(id)
}
