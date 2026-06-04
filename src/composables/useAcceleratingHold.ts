import { onUnmounted } from 'vue'

const MIN_DELAY_MS = 35
const MAX_DELAY_MS = 220
const RAMP_MS = 1500

function getHoldDelay(heldMs: number): number {
  const ramp = Math.min(heldMs / RAMP_MS, 1)
  return Math.round(MAX_DELAY_MS - (MAX_DELAY_MS - MIN_DELAY_MS) * ramp)
}

/**
 * Repeats an action on hold; interval speeds up the longer the control is held.
 */
export function useAcceleratingHold(action: () => void) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let holdStart = 0

  function stopHold(): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    window.removeEventListener('mouseup', stopHold)
    window.removeEventListener('touchend', stopHold)
    window.removeEventListener('touchcancel', stopHold)
  }

  function scheduleNext(): void {
    timeoutId = setTimeout(() => {
      action()
      scheduleNext()
    }, getHoldDelay(Date.now() - holdStart))
  }

  function startHold(): void {
    stopHold()
    action()
    holdStart = Date.now()
    scheduleNext()

    window.addEventListener('mouseup', stopHold)
    window.addEventListener('touchend', stopHold)
    window.addEventListener('touchcancel', stopHold)
  }

  onUnmounted(stopHold)

  return { startHold, stopHold }
}
