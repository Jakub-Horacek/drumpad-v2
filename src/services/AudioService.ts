class AudioService {
  private audioContext: AudioContext | null = null
  private buffers: Map<string, AudioBuffer[]> = new Map()
  private masterVolume: number = 0.7
  private isInitialized: boolean = false
  private isLoading: boolean = false
  private loadingProgress: number = 0
  private totalSounds: number = 0
  private loadedSounds: number = 0
  private loadingCallbacks: Array<(progress: number) => void> = []
  private activeSources: Set<AudioBufferSourceNode> = new Set()
  private masterGainNode: GainNode | null = null

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
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime)
      this.masterGainNode.connect(this.audioContext.destination)

      await this.preloadSounds()
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
    }
  }

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

  private updateLoadingProgress(): void {
    this.loadedSounds++
    this.loadingProgress = Math.round((this.loadedSounds / this.totalSounds) * 100)
    this.notifyLoadingCallbacks(this.loadingProgress)
  }

  private notifyLoadingCallbacks(progress: number): void {
    this.loadingCallbacks.forEach((callback) => callback(progress))
  }

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
      gainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime) // Individual volume at 100%

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

  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    if (this.masterGainNode && this.audioContext) {
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime)
    }
  }

  getVolume(): number {
    return this.masterVolume
  }

  async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  // Loading state management
  getLoadingState(): { isLoading: boolean; progress: number } {
    return {
      isLoading: this.isLoading,
      progress: this.loadingProgress,
    }
  }

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

  isReady(): boolean {
    return this.isInitialized && !this.isLoading
  }

  // Preload sounds immediately when service is created
  async preload(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }
  }

  // Stop all currently playing sounds
  stopAllSounds(): void {
    this.activeSources.forEach((source) => {
      try {
        source.stop()
      } catch (error) {
        // Source might already be stopped
      }
    })
    this.activeSources.clear()
  }

  // Get count of currently playing sounds
  getActiveSoundCount(): number {
    return this.activeSources.size
  }

  // Check if a specific number of sounds can play simultaneously
  canPlaySimultaneousSounds(count: number): boolean {
    // Most browsers can handle 32+ simultaneous sounds easily
    // We'll set a reasonable limit of 16 for drum pads
    return count <= 16
  }
}

export const audioService = new AudioService()

// Start preloading immediately when the service is created
audioService.preload().catch((error) => {
  console.error('Failed to preload audio:', error)
})
