/** Colors for the 3×3 pad grid favicon (matches each theme). */
export interface ThemeFaviconPalette {
  background: string
  padFill: string
  padStroke: string
}

export const THEME_FAVICON_PALETTES: Record<string, ThemeFaviconPalette> = {
  dark: { background: '#0f0f23', padFill: '#3b82f6', padStroke: '#4b5563' },
  og: { background: '#282828', padFill: '#f5a623', padStroke: '#5a5a5a' },
  light: { background: '#ffffff', padFill: '#3b82f6', padStroke: '#cbd5e1' },
  cyber: { background: '#000000', padFill: '#ff0080', padStroke: '#444444' },
  sunset: { background: '#1c1218', padFill: '#ff6b4a', padStroke: '#5c3d48' },
  ocean: { background: '#041c2c', padFill: '#14b8a6', padStroke: '#25637a' },
}

/** 1-based pad positions (numpad layout) rendered as filled tiles. */
const FILLED_PAD_POSITIONS = new Set([2, 3, 5, 7, 9])

const VIEW_SIZE = 32
const GRID_INSET = 5
const CELL = 7
const GAP = 1

/**
 * Build an SVG favicon: 3×3 grid with filled and outline-only pads.
 */
export function buildThemeFaviconSvg(themeId: string): string {
  const colors = THEME_FAVICON_PALETTES[themeId] ?? THEME_FAVICON_PALETTES.dark
  const cells: string[] = []

  for (let position = 1; position <= 9; position++) {
    const index = position - 1
    const row = Math.floor(index / 3)
    const col = index % 3
    const x = GRID_INSET + col * (CELL + GAP)
    const y = GRID_INSET + row * (CELL + GAP)
    const filled = FILLED_PAD_POSITIONS.has(position)

    if (filled) {
      cells.push(
        `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="1.5" fill="${colors.padFill}" stroke="${colors.padStroke}" stroke-width="0.75"/>`,
      )
    } else {
      cells.push(
        `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="1.5" fill="none" stroke="${colors.padStroke}" stroke-width="1.1"/>`,
      )
    }
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_SIZE} ${VIEW_SIZE}">`,
    `<rect width="${VIEW_SIZE}" height="${VIEW_SIZE}" rx="6" fill="${colors.background}"/>`,
    ...cells,
    '</svg>',
  ].join('')
}

/** Data URL for inline use (header logo, `<img>`, etc.). */
export function getThemeFaviconDataUrl(themeId: string): string {
  return `data:image/svg+xml,${encodeURIComponent(buildThemeFaviconSvg(themeId))}`
}

const FAVICON_LINK_ID = 'app-favicon'

/**
 * Update the document favicon to match the active theme.
 */
export function applyThemeFavicon(themeId: string): void {
  const href = getThemeFaviconDataUrl(themeId)

  let link = document.getElementById(FAVICON_LINK_ID) as HTMLLinkElement | null
  if (!link) {
    link = document.querySelector('link[rel="icon"]')
  }
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/svg+xml'
    link.id = FAVICON_LINK_ID
    document.head.appendChild(link)
  }

  link.type = 'image/svg+xml'
  link.href = href
}
