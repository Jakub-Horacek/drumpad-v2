import { ref, type Ref } from 'vue'

/** Matches touch-primary phones/tablets; desktop narrow viewports keep fine pointer + hover. */
export const TOUCH_PRIMARY_MEDIA_QUERY = '(hover: none) and (pointer: coarse)'

function createTouchPrimaryState(): { isTouchPrimary: Ref<boolean> } {
  const isTouchPrimary = ref(false)

  if (typeof window === 'undefined') {
    return { isTouchPrimary }
  }

  const mql = window.matchMedia(TOUCH_PRIMARY_MEDIA_QUERY)
  isTouchPrimary.value = mql.matches
  mql.addEventListener('change', () => {
    isTouchPrimary.value = mql.matches
  })

  return { isTouchPrimary }
}

const sharedState = createTouchPrimaryState()

export function useTouchPrimaryDevice() {
  return sharedState
}
