import { ref, type Ref } from 'vue'
import { isStandalonePwa as detectStandalonePwa } from '../utils/isStandalonePwa'
import { syncMobileAppHeight } from '../utils/mobileViewportHeight'

const STANDALONE_DISPLAY_MEDIA_QUERY =
  '(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)'

function applyStandalonePwaClass(isStandalone: boolean): void {
  document.documentElement.classList.toggle('is-standalone-pwa', isStandalone)
}

function createStandalonePwaState(): { isStandalonePwa: Ref<boolean> } {
  const isStandalonePwa = ref(detectStandalonePwa())

  if (typeof window === 'undefined') {
    return { isStandalonePwa }
  }

  applyStandalonePwaClass(isStandalonePwa.value)
  syncMobileAppHeight()

  const mql = window.matchMedia(STANDALONE_DISPLAY_MEDIA_QUERY)
  const sync = () => {
    const next = detectStandalonePwa()
    isStandalonePwa.value = next
    applyStandalonePwaClass(next)
    syncMobileAppHeight()
  }

  mql.addEventListener('change', sync)
  window.addEventListener('resize', sync)

  return { isStandalonePwa }
}

const sharedState = createStandalonePwaState()

/** True when the app runs as an installed PWA (standalone / fullscreen), not in a browser tab. */
export function useStandalonePwa() {
  return sharedState
}
