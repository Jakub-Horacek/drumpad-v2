import { ref, type Ref } from 'vue'

const STANDALONE_DISPLAY_MEDIA_QUERY = '(display-mode: standalone), (display-mode: fullscreen)'

function detectStandalonePwa(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean }
  if (navigatorWithStandalone.standalone === true) {
    return true
  }

  return window.matchMedia(STANDALONE_DISPLAY_MEDIA_QUERY).matches
}

function createStandalonePwaState(): { isStandalonePwa: Ref<boolean> } {
  const isStandalonePwa = ref(detectStandalonePwa())

  if (typeof window === 'undefined') {
    return { isStandalonePwa }
  }

  const mql = window.matchMedia(STANDALONE_DISPLAY_MEDIA_QUERY)
  const sync = () => {
    isStandalonePwa.value = detectStandalonePwa()
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
