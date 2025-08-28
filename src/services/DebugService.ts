/**
 * Debug service for managing debug mode and providing developer tools.
 * Exposes debug functions to the global window object for DevTools access.
 *
 * @class DebugService
 */

interface DrumpadDebugInterface {
  enableDebugMode: () => void
  disableDebugMode: () => void
  toggleDebugMode: () => void
  isDebugMode: () => boolean
  playAllSounds: () => void
  stopAllSounds: () => void
  getActiveSoundCount: () => number
  help: () => void
}

declare global {
  interface Window {
    __DRUMPAD_DEBUG__: DrumpadDebugInterface
  }
}
class DebugService {
  /** @private Whether debug mode is currently enabled */
  private isDebugMode: boolean = false

  /** @private Callbacks for debug mode state changes */
  private debugCallbacks: Array<(isDebug: boolean) => void> = []

  /**
   * Initialize the debug service and expose methods to global scope.
   */
  constructor() {
    // Expose debug methods to global window object for DevTools access
    this.exposeToGlobal()
  }

  /**
   * Expose debug methods to the global window object for DevTools access.
   *
   * @private
   */
  private exposeToGlobal(): void {
    // Only expose in development or when DevTools is open
    if (typeof window !== 'undefined') {
      window.__DRUMPAD_DEBUG__ = {
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

  /**
   * Display help information for debug commands in the console.
   *
   * @private
   */
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

  /**
   * Enable debug mode and notify all registered callbacks.
   */
  enableDebugMode(): void {
    if (!this.isDebugMode) {
      this.isDebugMode = true
      this.notifyCallbacks()
      console.log('🎵 Debug mode enabled! Debug buttons are now visible.')
    }
  }

  /**
   * Disable debug mode and notify all registered callbacks.
   */
  disableDebugMode(): void {
    if (this.isDebugMode) {
      this.isDebugMode = false
      this.notifyCallbacks()
      console.log('🎵 Debug mode disabled.')
    }
  }

  /**
   * Toggle debug mode between enabled and disabled states.
   */
  toggleDebugMode(): void {
    if (this.isDebugMode) {
      this.disableDebugMode()
    } else {
      this.enableDebugMode()
    }
  }

  /**
   * Get the current debug mode state.
   *
   * @returns {boolean} True if debug mode is enabled
   */
  getDebugMode(): boolean {
    return this.isDebugMode
  }

  /**
   * Subscribe to debug mode state changes.
   *
   * @param {function(boolean): void} callback - Function to call when debug mode changes
   * @returns {function(): void} Unsubscribe function
   */
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

  /**
   * Notify all registered debug mode change callbacks.
   *
   * @private
   */
  private notifyCallbacks(): void {
    this.debugCallbacks.forEach((callback) => callback(this.isDebugMode))
  }

  /**
   * Debug function to play all sounds (placeholder implementation).
   * The actual implementation will be injected by the store.
   *
   * @private
   */
  private playAllSounds(): void {
    // This will be implemented by connecting to the drumpad store
    console.log('🎵 Playing all sounds...')
    // The actual implementation will be injected by the store
  }

  /**
   * Debug function to stop all sounds (placeholder implementation).
   * The actual implementation will be injected by the store.
   *
   * @private
   */
  private stopAllSounds(): void {
    console.log('🎵 Stopping all sounds...')
    // The actual implementation will be injected by the store
  }

  /**
   * Debug function to get active sound count (placeholder implementation).
   * The actual implementation will be injected by the store.
   *
   * @private
   * @returns {number} Placeholder return value of 0
   */
  private getActiveSoundCount(): number {
    console.log('🎵 Getting active sound count...')
    return 0 // The actual implementation will be injected by the store
  }

  /**
   * Inject the actual playAllSounds implementation from the store.
   *
   * @param {function(): void} fn - Function to play all sounds
   */
  setPlayAllSoundsFunction(fn: () => void): void {
    if (typeof window !== 'undefined') {
      window.__DRUMPAD_DEBUG__.playAllSounds = fn
    }
  }

  /**
   * Inject the actual stopAllSounds implementation from the store.
   *
   * @param {function(): void} fn - Function to stop all sounds
   */
  setStopAllSoundsFunction(fn: () => void): void {
    if (typeof window !== 'undefined') {
      window.__DRUMPAD_DEBUG__.stopAllSounds = fn
    }
  }

  /**
   * Inject the actual getActiveSoundCount implementation from the store.
   *
   * @param {function(): number} fn - Function to get active sound count
   */
  setGetActiveSoundCountFunction(fn: () => number): void {
    if (typeof window !== 'undefined') {
      window.__DRUMPAD_DEBUG__.getActiveSoundCount = fn
    }
  }
}

/**
 * Singleton instance of the DebugService.
 *
 * @type {DebugService}
 */
export const debugService = new DebugService()
