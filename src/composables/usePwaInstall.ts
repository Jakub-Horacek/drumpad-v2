import { computed, ref, type ComputedRef, type Ref } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function createPwaInstallState(): {
  canInstall: ComputedRef<boolean>
  canShare: Ref<boolean>
  canPromptInstall: ComputedRef<boolean>
  installActionLabel: ComputedRef<string>
  promptInstallOrShare: () => Promise<void>
} {
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const canShare = ref(false)

  if (typeof window !== 'undefined') {
    canShare.value = typeof navigator.share === 'function'

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault()
      deferredPrompt.value = event as BeforeInstallPromptEvent
    })

    window.addEventListener('appinstalled', () => {
      deferredPrompt.value = null
    })
  }

  const canInstall = computed(() => deferredPrompt.value !== null)
  const canPromptInstall = computed(() => canInstall.value || canShare.value)
  const installActionLabel = computed(() =>
    canInstall.value ? 'Install app' : 'Add to Home Screen',
  )

  async function promptInstallOrShare(): Promise<void> {
    if (deferredPrompt.value) {
      await deferredPrompt.value.prompt()
      await deferredPrompt.value.userChoice
      deferredPrompt.value = null
      return
    }

    if (!canShare.value) {
      return
    }

    try {
      await navigator.share({
        title: 'Drumpad',
        text: 'Add Drumpad to your home screen for the full app experience.',
        url: window.location.href,
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
      throw error
    }
  }

  return {
    canInstall,
    canShare,
    canPromptInstall,
    installActionLabel,
    promptInstallOrShare,
  }
}

const sharedState = createPwaInstallState()

/** Native install prompt (Chrome) or Web Share sheet (Safari → Add to Home Screen). */
export function usePwaInstall() {
  return sharedState
}
