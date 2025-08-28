import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { audioService } from '../services/AudioService'
import { debugService } from '../services/DebugService'
import { useConfigStore } from './configStore'
import type { RecordedEvent, ViewMode, TipItem } from '../types'
import { TIPS } from '../types'

export const useDrumpadStore = defineStore('drumpad', () => {
  // Use the config store for persistent settings
  const configStore = useConfigStore()

  const isRecording = ref(false)
  const isPlaying = ref(false)
  const recordedEvents = ref<RecordedEvent[]>([])
  const recordingStartTime = ref<number>(0)
  const activePads = ref<Set<string>>(new Set())
  const currentTipIndex = ref(0)
  const showTips = ref(false)

  // Audio loading state
  const isAudioLoading = ref(true)
  const audioLoadingProgress = ref(0)
  const isAudioReady = ref(false)

  // Debug mode state
  const isDebugMode = ref(false)

  // Computed
  const tips = computed((): TipItem[] => TIPS)
  const currentTip = computed((): TipItem => tips.value[currentTipIndex.value])

  // Generator for random variants
  const variantGenerator = createVariantGenerator()

  function* createVariantGenerator(): Generator<number, never, unknown> {
    while (true) {
      yield Math.floor(Math.random() * 3)
    }
  }

  // Actions
  async function initializeAudio(): Promise<void> {
    try {
      // Start preloading immediately
      await audioService.preload()

      // Set up loading progress tracking
      const unsubscribe = audioService.onLoadingProgress((progress) => {
        audioLoadingProgress.value = progress
        if (progress === 100) {
          isAudioLoading.value = false
          isAudioReady.value = true
          unsubscribe() // Clean up callback
        }
      })

      // Check if already loaded
      const loadingState = audioService.getLoadingState()
      if (!loadingState.isLoading) {
        isAudioLoading.value = false
        isAudioReady.value = true
        audioLoadingProgress.value = 100
      }

      // Initialize debug service
      initializeDebugService()
    } catch (error) {
      console.error('Failed to initialize audio:', error)
      isAudioLoading.value = false
      isAudioReady.value = false
    }
  }

  function initializeDebugService(): void {
    // Set up debug mode change listener
    debugService.onDebugModeChange((isDebug) => {
      isDebugMode.value = isDebug
    })

    // Inject debug functions
    debugService.setPlayAllSoundsFunction(playAllSounds)
    debugService.setStopAllSoundsFunction(stopAllSounds)
    debugService.setGetActiveSoundCountFunction(getActiveSoundCount)
  }

  function playDrum(drumId: string, forceVariant?: number): void {
    // Don't play if audio is still loading
    if (!isAudioReady.value) {
      console.warn('Audio not ready yet, please wait')
      return
    }

    let soundType = drumId.toUpperCase()
    const variant = forceVariant ?? variantGenerator.next().value

    // Handle special cases
    if (drumId === 'hihat') {
      soundType = configStore.config.hihatClosed ? 'HIHAT' : 'HIHAT_O'
    } else if (drumId === 'snare') {
      soundType = configStore.config.useRimshot ? 'RIMSHOT' : 'SNARE'
    }

    // Play the sound (returns source node for potential future use)
    const source = audioService.playSound(soundType, variant)

    if (source) {
      // Add visual feedback
      activePads.value.add(drumId)
      setTimeout(() => {
        activePads.value.delete(drumId)
      }, 150)

      // Record if recording is active
      if (isRecording.value) {
        recordedEvents.value.push({
          timestamp: Date.now() - recordingStartTime.value,
          drumId,
          variant,
        })
      }
    }
  }

  function toggleHihat(): void {
    configStore.toggleHihat()
  }

  function toggleRimshot(): void {
    configStore.toggleRimshot()
  }

  function startRecording(): void {
    recordedEvents.value = []
    recordingStartTime.value = Date.now()
    isRecording.value = true
  }

  function stopRecording(): void {
    isRecording.value = false
  }

  function toggleRecording(): void {
    if (isRecording.value) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  async function playRecording(): Promise<void> {
    if (recordedEvents.value.length === 0 || isPlaying.value) return

    isPlaying.value = true

    for (const event of recordedEvents.value) {
      setTimeout(() => {
        if (!isPlaying.value) return
        playDrum(event.drumId, event.variant)
      }, event.timestamp)
    }

    // Auto-stop after the longest event
    const longestEvent = Math.max(...recordedEvents.value.map((e) => e.timestamp))
    setTimeout(() => {
      isPlaying.value = false
    }, longestEvent + 500)
  }

  function stopPlaying(): void {
    isPlaying.value = false
  }

  function togglePlaying(): void {
    if (isPlaying.value) {
      stopPlaying()
    } else {
      playRecording()
    }
  }

  function clearRecording(): void {
    recordedEvents.value = []
    isPlaying.value = false
  }

  function setVolume(volume: number): void {
    configStore.setVolume(volume)
    audioService.setVolume(volume)
  }

  function setTheme(theme: string): void {
    configStore.setTheme(theme)
  }

  function clearAllSettings(): void {
    configStore.clearAllSettings()
  }

  function setView(view: ViewMode): void {
    configStore.setView(view)
  }

  function nextTip(): void {
    currentTipIndex.value = (currentTipIndex.value + 1) % tips.value.length
  }

  function toggleTips(): void {
    showTips.value = !showTips.value
  }

  function isPadActive(drumId: string): boolean {
    return activePads.value.has(drumId)
  }

  // Keyboard handling
  const keyMap: Record<string, string> = {
    '1': 'hihat',
    '2': 'snare',
    '3': 'kick',
    '4': 'tom1',
    '5': 'tom2',
    '6': 'floor',
    '7': 'crash',
    '8': 'splash',
    '9': 'ride',
    Numpad1: 'hihat',
    Numpad2: 'snare',
    Numpad3: 'kick',
    Numpad4: 'tom1',
    Numpad5: 'tom2',
    Numpad6: 'floor',
    Numpad7: 'crash',
    Numpad8: 'splash',
    Numpad9: 'ride',
  }

  function handleKeyDown(event: KeyboardEvent): void {
    const drumId = keyMap[event.code] || keyMap[event.key]

    if (drumId) {
      event.preventDefault()
      playDrum(drumId)
      return
    }

    // Special keys
    switch (event.key) {
      case '-':
      case 'NumpadSubtract':
        event.preventDefault()
        toggleHihat()
        break
      case '+':
      case 'NumpadAdd':
        event.preventDefault()
        toggleRimshot()
        break
      case ' ':
        event.preventDefault()
        if (event.shiftKey) {
          toggleRecording()
        } else {
          togglePlaying()
        }
        break
    }
  }

  // Multi-sound management functions
  function stopAllSounds(): void {
    audioService.stopAllSounds()
  }

  function getActiveSoundCount(): number {
    return audioService.getActiveSoundCount()
  }

  function canPlaySimultaneousSounds(count: number): boolean {
    return audioService.canPlaySimultaneousSounds(count)
  }

  // Debug function to play all sounds
  function playAllSounds(): void {
    if (!isAudioReady.value) {
      console.warn('Audio not ready yet, please wait')
      return
    }

    const allDrums = ['hihat', 'snare', 'kick', 'tom1', 'tom2', 'floor', 'crash', 'splash', 'ride']
    allDrums.forEach((drum) => playDrum(drum))
  }

  return {
    // State
    config: configStore.config,
    isRecording,
    isPlaying,
    recordedEvents,
    showTips,
    isAudioLoading,
    audioLoadingProgress,
    isAudioReady,
    isDebugMode,

    // Computed
    currentTip,

    // Actions
    initializeAudio,
    playDrum,
    toggleHihat,
    toggleRimshot,
    toggleRecording,
    togglePlaying,
    clearRecording,
    setVolume,
    setTheme,
    clearAllSettings,
    setView,
    nextTip,
    toggleTips,
    isPadActive,
    handleKeyDown,
    stopAllSounds,
    getActiveSoundCount,
    canPlaySimultaneousSounds,
    playAllSounds,
  }
})
