import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { audioService } from '../services/AudioService'
import { debugService } from '../services/DebugService'
import { metronomeService } from '../services/MetronomeService'
import { useConfigStore } from './configStore'
import type { RecordedEvent, ViewMode, TipItem } from '../types'
import { TIPS_POINTER, TIPS_TOUCH } from '../types'
import { useTouchPrimaryDevice } from '../composables/useTouchPrimaryDevice'

/**
 * Main Pinia store for drum pad functionality.
 * Manages audio playback, recording, keyboard handling, and UI state.
 * Integrates with AudioService and DebugService for core functionality.
 *
 * @returns {Object} Store object with state, computed properties, and actions
 */
export const useDrumpadStore = defineStore('drumpad', () => {
  // Use the config store for persistent settings
  const configStore = useConfigStore()
  const isRecording = ref(false)
  const isPlaying = ref(false)
  const recordedEvents = ref<RecordedEvent[]>([])
  const recordingStartTime = ref<number>(0)

  const activePads = ref<Set<string>>(new Set())
  const currentTipIndex = ref(0)

  const { isTouchPrimary } = useTouchPrimaryDevice()

  // Audio loading state
  const isAudioLoading = ref(true)
  const audioLoadingProgress = ref(0)
  const isAudioReady = ref(false)

  // Debug mode state
  const isDebugMode = ref(false)
  const isMetronomeRunning = ref(false)

  const metronomeBeatFlash = ref(false)
  const metronomeBeatNumber = ref(0)
  let metronomeBeatFlashTimer: ReturnType<typeof setTimeout> | null = null

  metronomeService.setBpm(configStore.config.metronomeBpm)

  function clearMetronomeBeatVisuals(): void {
    metronomeBeatNumber.value = 0
    metronomeBeatFlash.value = false
    if (metronomeBeatFlashTimer !== null) {
      clearTimeout(metronomeBeatFlashTimer)
      metronomeBeatFlashTimer = null
    }
  }

  function pulseMetronomeBeatVisual(): void {
    metronomeBeatNumber.value = (metronomeBeatNumber.value % 4) + 1
    metronomeBeatFlash.value = true

    if (metronomeBeatFlashTimer !== null) {
      clearTimeout(metronomeBeatFlashTimer)
    }
    metronomeBeatFlashTimer = setTimeout(() => {
      metronomeBeatFlash.value = false
      metronomeBeatFlashTimer = null
    }, 280)
  }

  metronomeService.onBeat(pulseMetronomeBeatVisual)

  // Computed
  const tips = computed((): TipItem[] => (isTouchPrimary.value ? TIPS_TOUCH : TIPS_POINTER))

  const currentTip = computed((): TipItem => {
    const list = tips.value
    return list[currentTipIndex.value % list.length]
  })

  watch(isTouchPrimary, () => {
    currentTipIndex.value = 0
  })

  // Generator for random variants
  const variantGenerator = createVariantGenerator()

  /**
   * Create a generator that yields random drum sound variants (0-2).
   *
   * @generator
   * @yields {number} Random variant number (0-2)
   */
  function* createVariantGenerator(): Generator<number, never, unknown> {
    while (true) {
      yield Math.floor(Math.random() * 3)
    }
  }

  // Actions
  /**
   * Initialize the audio service and set up loading progress tracking.
   * Also initializes the debug service for development tools.
   *
   * @async
   * @returns {Promise<void>} Promise that resolves when initialization is complete
   */
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
          syncVolumesToAudio()
          unsubscribe() // Clean up callback
        }
      })

      // Check if already loaded
      const loadingState = audioService.getLoadingState()
      if (!loadingState.isLoading) {
        isAudioLoading.value = false
        isAudioReady.value = true
        audioLoadingProgress.value = 100
        syncVolumesToAudio()
      }

      // Initialize debug service
      initializeDebugService()
      syncVolumesToAudio()
    } catch (error) {
      console.error('Failed to initialize audio:', error)
      isAudioLoading.value = false
      isAudioReady.value = false
    }
  }

  /**
   * Initialize the debug service and inject store functions for global access.
   * Sets up debug mode change listener and connects debug functions.
   */
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

  /**
   * Play a drum sound with the specified ID and optional variant.
   * Handles special cases for hi-hat and snare/rimshot modes.
   * Records the event if recording is active and provides visual feedback.
   *
   * @param {string} drumId - ID of the drum to play
   * @param {number} [forceVariant] - Optional specific variant to use (0-2)
   */
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
      soundType = configStore.config.hihatClosed !== false ? 'HIHAT' : 'HIHAT_O'
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

  /**
   * Toggle between closed and open hi-hat mode.
   */
  function toggleHihat(): void {
    configStore.toggleHihat()
  }

  /**
   * Toggle between snare and rimshot mode.
   */
  function toggleRimshot(): void {
    configStore.toggleRimshot()
  }

  /**
   * Start recording drum events.
   * Clears previous events and sets the start timestamp.
   */
  function startRecording(): void {
    recordedEvents.value = []
    recordingStartTime.value = Date.now()
    isRecording.value = true
  }

  /**
   * Shift event timestamps so the first hit is at 0 ms (removes leading silence).
   */
  function trimRecordingLeadingSilence(): void {
    if (recordedEvents.value.length === 0) return

    const firstTimestamp = Math.min(...recordedEvents.value.map((e) => e.timestamp))
    if (firstTimestamp === 0) return

    recordedEvents.value = recordedEvents.value.map((event) => ({
      ...event,
      timestamp: event.timestamp - firstTimestamp,
    }))
  }

  function stopRecording(): void {
    isRecording.value = false
    trimRecordingLeadingSilence()
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

    const events = recordedEvents.value
    const playbackOffset = Math.min(...events.map((e) => e.timestamp))

    isPlaying.value = true

    for (const event of events) {
      const delay = event.timestamp - playbackOffset
      setTimeout(() => {
        if (!isPlaying.value) return
        playDrum(event.drumId, event.variant)
      }, delay)
    }

    const lastEventTime = Math.max(...events.map((e) => e.timestamp)) - playbackOffset
    setTimeout(() => {
      isPlaying.value = false
    }, lastEventTime + 500)
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

  function syncVolumesToAudio(): void {
    configStore.normalizeVolumes()
    const { overallVolume, metronomeVolume, drumpadVolume } = configStore.config
    audioService.setVolumes(overallVolume, metronomeVolume, drumpadVolume)
  }

  function setOverallVolume(volume: number): void {
    configStore.setOverallVolume(volume)
    syncVolumesToAudio()
  }

  function setMetronomeVolume(volume: number): void {
    configStore.setMetronomeVolume(volume)
    syncVolumesToAudio()
  }

  function setDrumpadVolume(volume: number): void {
    configStore.setDrumpadVolume(volume)
    syncVolumesToAudio()
  }

  function resetVolumes(): void {
    configStore.resetVolumes()
    syncVolumesToAudio()
  }

  function setTheme(theme: string): void {
    configStore.setTheme(theme)
  }

  function setView(view: ViewMode): void {
    configStore.setView(view)
  }

  function nextTip(): void {
    currentTipIndex.value = (currentTipIndex.value + 1) % tips.value.length
  }

  function isPadActive(drumId: string): boolean {
    return activePads.value.has(drumId)
  }

  // Keyboard handling
  /**
   * Mapping of keyboard keys to drum IDs.
   * Supports both regular number keys and numpad keys.
   *
   * @type {Record<string, string>}
   */
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

  /**
   * Handle keyboard input for drum pad controls.
   * Maps number keys to drums and special keys to functions.
   *
   * @param {KeyboardEvent} event - The keyboard event to handle
   */
  function syncMetronomeRunning(): void {
    isMetronomeRunning.value = metronomeService.running
  }

  function setMetronomeBpm(bpm: number): void {
    configStore.setMetronomeBpm(bpm)
    metronomeService.setBpm(configStore.config.metronomeBpm)
  }

  function decreaseMetronomeBpm(): void {
    setMetronomeBpm(configStore.config.metronomeBpm - 1)
  }

  function increaseMetronomeBpm(): void {
    setMetronomeBpm(configStore.config.metronomeBpm + 1)
  }

  async function toggleMetronome(): Promise<void> {
    if (!isAudioReady.value) return
    await metronomeService.toggle()
    syncMetronomeRunning()
    if (!metronomeService.running) {
      clearMetronomeBeatVisuals()
    }
  }

  async function stopMetronome(): Promise<void> {
    metronomeService.stop()
    clearMetronomeBeatVisuals()
    syncMetronomeRunning()
  }

  function handleKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return
    }

    const drumId = keyMap[event.code] || keyMap[event.key]

    if (drumId) {
      event.preventDefault()
      playDrum(drumId)
      return
    }

    if (event.code === 'NumpadEnter') {
      event.preventDefault()
      clearRecording()
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
      case '0':
      case 'Numpad0':
        event.preventDefault()
        toggleRecording()
        break
      case '.':
      case 'NumpadDecimal':
        event.preventDefault()
        togglePlaying()
        break
      case '/':
      case 'NumpadDivide':
        event.preventDefault()
        decreaseMetronomeBpm()
        break
      case '*':
      case 'NumpadMultiply':
        event.preventDefault()
        increaseMetronomeBpm()
        break
      case ' ':
        event.preventDefault()
        void toggleMetronome()
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
    isAudioLoading,
    audioLoadingProgress,
    isAudioReady,
    isDebugMode,
    isMetronomeRunning,
    metronomeBeatFlash,
    metronomeBeatNumber,
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
    setOverallVolume,
    setMetronomeVolume,
    setDrumpadVolume,
    resetVolumes,
    setTheme,
    setView,
    nextTip,
    isPadActive,
    handleKeyDown,
    setMetronomeBpm,
    decreaseMetronomeBpm,
    increaseMetronomeBpm,
    toggleMetronome,
    stopMetronome,
    stopAllSounds,
    getActiveSoundCount,
    playAllSounds,
  }
})
