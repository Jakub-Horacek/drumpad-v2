import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DrumPadConfig } from '../types'

export const useConfigStore = defineStore(
  'config',
  () => {
    // State
    const config = ref<DrumPadConfig>({
      hihatClosed: true,
      useRimshot: false,
      volume: 0.7,
      currentTheme: 'dark',
      currentView: 'drumpad',
    })

    // Actions
    function setTheme(theme: string): void {
      config.value.currentTheme = theme
    }

    function setVolume(volume: number): void {
      config.value.volume = volume
    }

    function setView(view: DrumPadConfig['currentView']): void {
      config.value.currentView = view
    }

    function toggleHihat(): void {
      config.value.hihatClosed = !config.value.hihatClosed
    }

    function toggleRimshot(): void {
      config.value.useRimshot = !config.value.useRimshot
    }

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
    // Pinia persistence configuration
    persist: {
      key: 'drumpad-config',
      storage: localStorage,
    },
  },
)
