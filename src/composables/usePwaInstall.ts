import { computed, ref, type ComputedRef } from 'vue'
import { isIosDevice, isIosSafari } from '../utils/isIosDevice'
import { useStandalonePwa } from './useStandalonePwa'

export type PwaInstallMode = 'hidden' | 'native' | 'ios-guide' | 'ios-safari-warning'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function createPwaInstallState(): {
  installMode: ComputedRef<PwaInstallMode>
  promptNativeInstall: () => Promise<void>
} {
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const { isStandalonePwa } = useStandalonePwa()

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault()
      deferredPrompt.value = event as BeforeInstallPromptEvent
    })

    window.addEventListener('appinstalled', () => {
      deferredPrompt.value = null
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

  async function promptNativeInstall(): Promise<void> {
    if (!deferredPrompt.value) {
      return
    }

    await deferredPrompt.value.prompt()
    await deferredPrompt.value.userChoice
    deferredPrompt.value = null
  }

  return {
    installMode,
    promptNativeInstall,
  }
}

const sharedState = createPwaInstallState()

/** Platform-aware PWA install state: Chromium prompt, iOS Safari guide, or hidden when installed. */
export function usePwaInstall() {
  return sharedState
}
