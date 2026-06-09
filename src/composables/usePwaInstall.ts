import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { isIosDevice, isIosSafari } from '../utils/isIosDevice'
import { useStandalonePwa } from './useStandalonePwa'
import { useTouchPrimaryDevice } from './useTouchPrimaryDevice'

const DISMISS_STORAGE_KEY = 'drumpad-pwa-install-dismissed'
const VISIT_STORAGE_KEY = 'drumpad-pwa-visit-count'
const MIN_VISITS_FOR_BANNER = 2

export type PwaInstallMode = 'hidden' | 'native' | 'ios-guide' | 'ios-safari-warning'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeDismissed(): void {
  try {
    localStorage.setItem(DISMISS_STORAGE_KEY, '1')
  } catch {
    // ignore quota / private mode
  }
}

function readVisitCount(): number {
  try {
    const raw = localStorage.getItem(VISIT_STORAGE_KEY)
    const parsed = raw ? Number.parseInt(raw, 10) : 0
    return Number.isFinite(parsed) ? parsed : 0
  } catch {
    return 0
  }
}

function writeVisitCount(count: number): void {
  try {
    localStorage.setItem(VISIT_STORAGE_KEY, String(count))
  } catch {
    // ignore
  }
}

function createPwaInstallState(): {
  installMode: ComputedRef<PwaInstallMode>
  canShowBanner: ComputedRef<boolean>
  isPromoDismissed: Ref<boolean>
  showIosGuide: Ref<boolean>
  visitCount: Ref<number>
  recordVisit: () => void
  dismissPromo: () => void
  toggleIosGuide: () => void
  promptNativeInstall: () => Promise<void>
} {
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const isPromoDismissed = ref(readDismissed())
  const showIosGuide = ref(false)
  const visitCount = ref(readVisitCount())

  const { isStandalonePwa } = useStandalonePwa()
  const { isTouchPrimary } = useTouchPrimaryDevice()

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault()
      deferredPrompt.value = event as BeforeInstallPromptEvent
    })

    window.addEventListener('appinstalled', () => {
      deferredPrompt.value = null
      isPromoDismissed.value = true
      writeDismissed()
    })
  }

  const canNativeInstall = computed(() => deferredPrompt.value !== null)

  const installMode = computed<PwaInstallMode>(() => {
    if (isStandalonePwa.value) {
      return 'hidden'
    }
    if (canNativeInstall.value) {
      return 'native'
    }
    if (isIosSafari()) {
      return 'ios-guide'
    }
    if (isIosDevice()) {
      return 'ios-safari-warning'
    }
    return 'hidden'
  })

  const canShowBanner = computed(() => {
    if (installMode.value === 'hidden' || isPromoDismissed.value) {
      return false
    }
    if (visitCount.value < MIN_VISITS_FOR_BANNER) {
      return false
    }
    if (isTouchPrimary.value) {
      return true
    }
    return installMode.value === 'native'
  })

  function recordVisit(): void {
    const next = visitCount.value + 1
    visitCount.value = next
    writeVisitCount(next)
  }

  function dismissPromo(): void {
    isPromoDismissed.value = true
    writeDismissed()
  }

  function toggleIosGuide(): void {
    showIosGuide.value = !showIosGuide.value
  }

  async function promptNativeInstall(): Promise<void> {
    if (!deferredPrompt.value) {
      return
    }

    await deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    deferredPrompt.value = null

    if (outcome === 'dismissed') {
      dismissPromo()
    }
  }

  return {
    installMode,
    canShowBanner,
    isPromoDismissed,
    showIosGuide,
    visitCount,
    recordVisit,
    dismissPromo,
    toggleIosGuide,
    promptNativeInstall,
  }
}

const sharedState = createPwaInstallState()

/** Platform-aware PWA install state: Chromium prompt, iOS Safari guide, or hidden when installed. */
export function usePwaInstall() {
  return sharedState
}
