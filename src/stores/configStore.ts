import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DrumPadConfig } from '../types'

/**
 * Pinia store for managing drum pad configuration settings.
 * Handles theme, volume, view mode, and drum-specific settings with persistence.
 *
 * @returns {Object} Store object with state and actions
 */
export const useConfigStore = defineStore(
  'config',
  () => {
    /**
     * Configuration state containing all drum pad settings.
     *
     * @type {import('vue').Ref<DrumPadConfig>}
     */
    const config = ref<DrumPadConfig>({
      hihatClosed: true,
      useRimshot: false,
      volume: 0.7,
      currentTheme: 'dark',
      currentView: 'drumpad',
    })

    /**
     * Set the current theme.
     *
     * @param {string} theme - Theme name to set
     */
    function setTheme(theme: string): void {
      config.value.currentTheme = theme
    }

    /**
     * Set the master volume level.
     *
     * @param {number} volume - Volume level (0-1)
     */
    function setVolume(volume: number): void {
      config.value.volume = volume
    }

    /**
     * Set the current view mode.
     *
     * @param {DrumPadConfig['currentView']} view - View mode to set
     */
    function setView(view: DrumPadConfig['currentView']): void {
      config.value.currentView = view
    }

    /**
     * Toggle between closed and open hi-hat mode.
     */
    function toggleHihat(): void {
      config.value.hihatClosed = !config.value.hihatClosed
    }

    /**
     * Toggle between snare and rimshot mode.
     */
    function toggleRimshot(): void {
      config.value.useRimshot = !config.value.useRimshot
    }

    /**
     * Reset all settings to their default values.
     */
    function clearAllSettings(): void {
      config.value = {
        hihatClosed: true,
        useRimshot: false,
        volume: 0.7,
        currentTheme: 'dark',
        currentView: 'drumpad',
      }
    }

    return {
      // State
      config,
      // Actions
      setTheme,
      setVolume,
      setView,
      toggleHihat,
      toggleRimshot,
      clearAllSettings,
    }
  },
  {
    /**
     * Pinia persistence configuration.
     * Automatically saves and restores state from localStorage.
     */
    persist: {
      key: 'drumpad-config',
      storage: localStorage,
    },
  },
)
