class DebugService {
  private isDebugMode: boolean = false
  private debugCallbacks: Array<(isDebug: boolean) => void> = []

  constructor() {
    // Expose debug methods to global window object for DevTools access
    this.exposeToGlobal()
  }

  private exposeToGlobal(): void {
    // Only expose in development or when DevTools is open
    if (typeof window !== 'undefined') {
      ;(window as any).__DRUMPAD_DEBUG__ = {
        enableDebugMode: () => this.enableDebugMode(),
        disableDebugMode: () => this.disableDebugMode(),
        toggleDebugMode: () => this.toggleDebugMode(),
        isDebugMode: () => this.isDebugMode,
        playAllSounds: () => this.playAllSounds(),
        stopAllSounds: () => this.stopAllSounds(),
        getActiveSoundCount: () => this.getActiveSoundCount(),
        help: () => this.showHelp(),
      }
    }
  }

  private showHelp(): void {
    console.log(`
🎵 Drumpad Debug Mode Help
========================

Available commands:
- __DRUMPAD_DEBUG__.enableDebugMode()  - Enable debug mode
- __DRUMPAD_DEBUG__.disableDebugMode() - Disable debug mode  
- __DRUMPAD_DEBUG__.toggleDebugMode()  - Toggle debug mode
- __DRUMPAD_DEBUG__.isDebugMode()      - Check if debug mode is active
- __DRUMPAD_DEBUG__.playAllSounds()    - Play all drums simultaneously
- __DRUMPAD_DEBUG__.stopAllSounds()    - Stop all playing sounds
- __DRUMPAD_DEBUG__.getActiveSoundCount() - Get count of active sounds
- __DRUMPAD_DEBUG__.help()             - Show this help

Example usage:
__DRUMPAD_DEBUG__.enableDebugMode()
__DRUMPAD_DEBUG__.playAllSounds()
    `)
  }

  enableDebugMode(): void {
    if (!this.isDebugMode) {
      this.isDebugMode = true
      this.notifyCallbacks()
      console.log('🎵 Debug mode enabled! Debug buttons are now visible.')
    }
  }

  disableDebugMode(): void {
    if (this.isDebugMode) {
      this.isDebugMode = false
      this.notifyCallbacks()
      console.log('🎵 Debug mode disabled.')
    }
  }

  toggleDebugMode(): void {
    if (this.isDebugMode) {
      this.disableDebugMode()
    } else {
      this.enableDebugMode()
    }
  }

  getDebugMode(): boolean {
    return this.isDebugMode
  }

  onDebugModeChange(callback: (isDebug: boolean) => void): () => void {
    this.debugCallbacks.push(callback)
    // Return unsubscribe function
    return () => {
      const index = this.debugCallbacks.indexOf(callback)
      if (index > -1) {
        this.debugCallbacks.splice(index, 1)
      }
    }
  }

  private notifyCallbacks(): void {
    this.debugCallbacks.forEach((callback) => callback(this.isDebugMode))
  }

  // Debug functions that will be called from the UI
  private playAllSounds(): void {
    // This will be implemented by connecting to the drumpad store
    console.log('🎵 Playing all sounds...')
    // The actual implementation will be injected by the store
  }

  private stopAllSounds(): void {
    console.log('🎵 Stopping all sounds...')
    // The actual implementation will be injected by the store
  }

  private getActiveSoundCount(): number {
    console.log('🎵 Getting active sound count...')
    return 0 // The actual implementation will be injected by the store
  }

  // Methods to inject actual implementations from the store
  setPlayAllSoundsFunction(fn: () => void): void {
    if (typeof window !== 'undefined') {
      ;(window as any).__DRUMPAD_DEBUG__.playAllSounds = fn
    }
  }

  setStopAllSoundsFunction(fn: () => void): void {
    if (typeof window !== 'undefined') {
      ;(window as any).__DRUMPAD_DEBUG__.stopAllSounds = fn
    }
  }

  setGetActiveSoundCountFunction(fn: () => number): void {
    if (typeof window !== 'undefined') {
      ;(window as any).__DRUMPAD_DEBUG__.getActiveSoundCount = fn
    }
  }
}

export const debugService = new DebugService()
