// Theme imports
import './dark.css'
import './og.css'
import './light.css'
import './cyber.css'

// Theme configuration
export interface ThemeConfig {
  id: string
  name: string
  description: string
}

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

export const getThemeById = (id: string): ThemeConfig | undefined => {
  return THEMES.find((theme) => theme.id === id)
}

export const getDefaultTheme = (): ThemeConfig => {
  return THEMES[0] // Dark theme as default
}
