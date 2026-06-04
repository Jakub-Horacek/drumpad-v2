/**
 * Audio service for managing drum pad sound playback and audio context.
 * Handles audio initialization, sound preloading, volume control, and playback.
 *
 * @class AudioService
 */
class AudioService {
  private audioContext: AudioContext | null = null
  private buffers: Map<string, AudioBuffer[]> = new Map()
  private overallVolume: number = 0.7
  private metronomeVolume: number = 0.7
  private drumpadVolume: number = 0.7
  private isInitialized: boolean = false
  private isLoading: boolean = false
  private loadingProgress: number = 0
  private totalSounds: number = 0
  private loadedSounds: number = 0
  private loadingCallbacks: Array<(progress: number) => void> = []
  private activeSources: Set<AudioBufferSourceNode> = new Set()
  private masterGainNode: GainNode | null = null

  /**
   * Initialize the audio context and preload all drum sounds.
   * Creates an optimized AudioContext with low latency settings.
   *
   * @async
   * @returns {Promise<void>} Promise that resolves when initialization is complete
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Create optimized AudioContext with low latency
      this.audioContext = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(
        {
          latencyHint: 'interactive',
          sampleRate: 44100,
        },
      )

      // Create master gain node for better volume control
      this.masterGainNode = this.audioContext.createGain()
      this.masterGainNode.gain.setValueAtTime(this.overallVolume, this.audioContext.currentTime)
      this.masterGainNode.connect(this.audioContext.destination)

      await this.preloadSounds()
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
    }
  }

  /**
   * Preload all drum sound variants in parallel for optimal performance.
   * Loads 3 variants of each drum type (11 types total = 33 sounds).
   *
   * @private
   * @async
   * @returns {Promise<void>} Promise that resolves when all sounds are loaded
   */
  private async preloadSounds(): Promise<void> {
    this.isLoading = true
    this.loadingProgress = 0
    this.loadedSounds = 0

    const drumTypes = [
      'HIHAT',
      'HIHAT_O',
      'SNARE',
      'RIMSHOT',
      'KICK',
      'TOM1',
      'TOM2',
      'FLOOR',
      'CRASH',
      'SPLASH',
      'RIDE',
    ]

    // Calculate total sounds for progress tracking
    this.totalSounds = drumTypes.length * 3

    // Create all promises for parallel loading
    const allPromises: Promise<void>[] = []

    for (const drumType of drumTypes) {
      const buffers: AudioBuffer[] = []
      this.buffers.set(drumType, buffers)

      for (let i = 1; i <= 3; i++) {
        const promise = this.loadSound(`/sounds/${drumType}_${i}.mp3`)
          .then((buffer) => {
            buffers[i - 1] = buffer
            this.updateLoadingProgress()
          })
          .catch((error) => {
            console.warn(`Failed to load ${drumType}_${i}.mp3:`, error)
            this.updateLoadingProgress()
          })
        allPromises.push(promise)
      }
    }

    // Load all sounds in parallel for maximum speed
    await Promise.all(allPromises)
    this.isLoading = false
    this.loadingProgress = 100
    this.notifyLoadingCallbacks(100)
  }

  /**
   * Update loading progress and notify all registered callbacks.
   *
   * @private
   */
  private updateLoadingProgress(): void {
    this.loadedSounds++
    this.loadingProgress = Math.round((this.loadedSounds / this.totalSounds) * 100)
    this.notifyLoadingCallbacks(this.loadingProgress)
  }

  /**
   * Notify all registered loading progress callbacks.
   *
   * @private
   * @param {number} progress - Current loading progress (0-100)
   */
  private notifyLoadingCallbacks(progress: number): void {
    this.loadingCallbacks.forEach((callback) => callback(progress))
  }

  /**
   * Load a single sound file and decode it to an AudioBuffer.
   * Uses cache-first strategy for optimal performance.
   *
   * @private
   * @async
   * @param {string} url - URL of the sound file to load
   * @returns {Promise<AudioBuffer>} Promise that resolves to the decoded audio buffer
   * @throws {Error} When the sound file cannot be loaded or decoded
   */
  private async loadSound(url: string): Promise<AudioBuffer> {
    try {
      // Use cache-first strategy with fetch
      const response = await fetch(url, {
        cache: 'force-cache',
        headers: {
          'Cache-Control': 'max-age=31536000', // 1 year cache
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      return this.audioContext!.decodeAudioData(arrayBuffer)
    } catch (error) {
      console.error(`Error loading sound ${url}:`, error)
      throw error
    }
  }

  /**
   * Play a drum sound with the specified type and variant.
   * Creates an AudioBufferSourceNode and connects it through the master gain node.
   *
   * @param {string} drumType - Type of drum sound to play (e.g., 'HIHAT', 'SNARE')
   * @param {number} [variant=0] - Sound variant index (0-2)
   * @returns {AudioBufferSourceNode | null} The created source node or null if failed
   */
  playSound(drumType: string, variant: number = 0): AudioBufferSourceNode | null {
    if (!this.isInitialized || !this.audioContext || !this.masterGainNode) {
      console.warn('Audio service not initialized')
      return null
    }

    if (this.isLoading) {
      console.warn('Audio still loading, please wait')
      return null
    }

    const buffers = this.buffers.get(drumType)
    if (!buffers || !buffers[variant]) {
      console.warn(`Sound not found: ${drumType}_${variant + 1}`)
      return null
    }

    try {
      // Resume audio context if suspended (mobile browsers)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }

      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()

      source.buffer = buffers[variant]
      // Use immediate value for zero latency
      gainNode.gain.setValueAtTime(this.drumpadVolume, this.audioContext.currentTime)

      // Connect through master gain node for better control
      source.connect(gainNode)
      gainNode.connect(this.masterGainNode)

      // Track active sources for cleanup
      this.activeSources.add(source)

      // Clean up when sound ends
      source.onended = () => {
        this.activeSources.delete(source)
        source.disconnect()
        gainNode.disconnect()
      }

      // Start immediately for zero delay
      source.start(0)

      return source
    } catch (error) {
      console.error('Error playing sound:', error)
      return null
    }
  }

  /**
   * Set overall, metronome, and drum pad volume levels.
   *
   * @param {number} overall - Master output volume (0-1)
   * @param {number} metronome - Metronome click volume (0-1)
   * @param {number} drumpad - Drum sample volume (0-1)
   */
  setVolumes(overall: number, metronome: number, drumpad: number): void {
    this.overallVolume = clampVolume(overall)
    this.metronomeVolume = clampVolume(metronome)
    this.drumpadVolume = clampVolume(drumpad)
    if (this.masterGainNode && this.audioContext) {
      this.masterGainNode.gain.setValueAtTime(this.overallVolume, this.audioContext.currentTime)
    }
  }

  /**
   * Resume the audio context if the browser suspended it.
   *
   * @async
   * @returns {Promise<void>}
   */
  async resumeContext(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  /**
   * Get the shared audio context used for playback.
   *
   * @returns {AudioContext | null}
   */
  getAudioContext(): AudioContext | null {
    return this.audioContext
  }

  /**
   * Schedule a short metronome click at the given audio context time.
   *
   * @param {number} time - AudioContext time in seconds
   * @param {boolean} [accent=false] - Downbeat (1/4) uses a higher pitch
   */
  playMetronomeClick(time: number, accent = false): void {
    if (!this.audioContext || !this.masterGainNode) return

    const ctx = this.audioContext
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(accent ? 1100 : 880, time)
    gain.gain.setValueAtTime(0.2 * this.metronomeVolume, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04)

    osc.connect(gain)
    gain.connect(this.masterGainNode)
    osc.start(time)
    osc.stop(time + 0.04)
  }

  /**
   * Get the current loading state and progress.
   *
   * @returns {{isLoading: boolean, progress: number}} Loading state object
   */
  getLoadingState(): { isLoading: boolean; progress: number } {
    return {
      isLoading: this.isLoading,
      progress: this.loadingProgress,
    }
  }

  /**
   * Subscribe to loading progress updates.
   *
   * @param {function(number): void} callback - Function to call with progress updates
   * @returns {function(): void} Unsubscribe function
   */
  onLoadingProgress(callback: (progress: number) => void): () => void {
    this.loadingCallbacks.push(callback)
    // Return unsubscribe function
    return () => {
      const index = this.loadingCallbacks.indexOf(callback)
      if (index > -1) {
        this.loadingCallbacks.splice(index, 1)
      }
    }
  }

  /**
   * Check if the audio service is ready for playback.
   *
   * @returns {boolean} True if initialized and not loading
   */
  isReady(): boolean {
    return this.isInitialized && !this.isLoading
  }

  /**
   * Preload sounds immediately when service is created.
   *
   * @async
   * @returns {Promise<void>} Promise that resolves when preloading is complete
   */
  async preload(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }
  }

  /**
   * Stop all currently playing sounds and clear the active sources set.
   */
  stopAllSounds(): void {
    this.activeSources.forEach((source) => {
      try {
        source.stop()
      } catch {
        // Source might already be stopped
      }
    })
    this.activeSources.clear()
  }

  /**
   * Get the count of currently playing sounds.
   *
   * @returns {number} Number of active audio sources
   */
  getActiveSoundCount(): number {
    return this.activeSources.size
  }
}

/**
 * Singleton instance of the AudioService.
 *
 * @type {AudioService}
 */
function clampVolume(volume: number): number {
  return Math.max(0, Math.min(1, volume))
}

export const audioService = new AudioService()

// Start preloading immediately when the service is created
audioService.preload().catch((error) => {
  console.error('Failed to preload audio:', error)
})
