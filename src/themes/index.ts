// Theme imports
import './dark.css'
import './og.css'
import './light.css'
import './cyber.css'

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
