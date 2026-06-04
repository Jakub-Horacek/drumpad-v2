import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DrumPadConfig } from '../types'
import {
  CONFIG_STORE_VERSION,
  METRONOME_BPM_DEFAULT,
  METRONOME_BPM_MAX,
  METRONOME_BPM_MIN,
} from '../types'

const DEFAULT_VOLUME = 0.7

function clampVolume(volume: number): number {
  return Math.max(0, Math.min(1, volume))
}

type LegacyConfig = DrumPadConfig & { volume?: number }

function resolveVolume(value: unknown, fallback: number): number {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return clampVolume(value)
  }
  return fallback
}

function legacyVolumeFallback(legacy: LegacyConfig): number {
  return resolveVolume(legacy.volume, DEFAULT_VOLUME)
}

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
      configVersion: CONFIG_STORE_VERSION,
      hihatClosed: true,
      useRimshot: false,
      overallVolume: DEFAULT_VOLUME,
      metronomeVolume: DEFAULT_VOLUME,
      drumpadVolume: DEFAULT_VOLUME,
      currentTheme: 'dark',
      currentView: 'drumpad',
      metronomeBpm: METRONOME_BPM_DEFAULT,
    })

    /**
     * Set the current theme.
     *
     * @param {string} theme - Theme name to set
     */
    function setTheme(theme: string): void {
      config.value.currentTheme = theme
    }

    function setOverallVolume(volume: number): void {
      config.value.overallVolume = resolveVolume(volume, DEFAULT_VOLUME)
    }

    function setMetronomeVolume(volume: number): void {
      config.value.metronomeVolume = resolveVolume(volume, DEFAULT_VOLUME)
    }

    function setDrumpadVolume(volume: number): void {
      config.value.drumpadVolume = resolveVolume(volume, DEFAULT_VOLUME)
    }

    /** Reset all volume sliders to their default levels (70%). */
    function resetVolumes(): void {
      config.value.overallVolume = DEFAULT_VOLUME
      config.value.metronomeVolume = DEFAULT_VOLUME
      config.value.drumpadVolume = DEFAULT_VOLUME
    }

    /**
     * Set the current view mode.
     *
     * @param {DrumPadConfig['currentView']} view - View mode to set
     */
    function setView(view: DrumPadConfig['currentView'] | 'guide'): void {
      config.value.currentView = view === 'guide' ? 'info' : view
    }

    function normalizeVolumes(): void {
      const legacy = config.value as LegacyConfig
      const fallback = legacyVolumeFallback(legacy)

      config.value.overallVolume = resolveVolume(config.value.overallVolume, fallback)
      config.value.metronomeVolume = resolveVolume(config.value.metronomeVolume, fallback)
      config.value.drumpadVolume = resolveVolume(config.value.drumpadVolume, fallback)

      if ('volume' in legacy) {
        delete legacy.volume
      }
    }

    function migratePersistedView(): void {
      normalizeVolumes()

      if ((config.value.currentView as string) === 'guide') {
        config.value.currentView = 'info'
      }
      const version = config.value.configVersion ?? 1
      if (version < CONFIG_STORE_VERSION) {
        if (version < 2) {
          config.value.hihatClosed = true
        }
        config.value.configVersion = CONFIG_STORE_VERSION
      } else if (typeof config.value.hihatClosed !== 'boolean') {
        config.value.hihatClosed = true
      }
      if (
        typeof config.value.metronomeBpm !== 'number' ||
        Number.isNaN(config.value.metronomeBpm)
      ) {
        config.value.metronomeBpm = METRONOME_BPM_DEFAULT
      }
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
     * Set metronome tempo in BPM.
     *
     * @param {number} bpm - Beats per minute
     */
    function setMetronomeBpm(bpm: number): void {
      const rounded = Math.round(bpm)
      config.value.metronomeBpm = Math.min(
        METRONOME_BPM_MAX,
        Math.max(METRONOME_BPM_MIN, rounded),
      )
    }

    const overallVolume = computed(() => config.value.overallVolume)
    const metronomeVolume = computed(() => config.value.metronomeVolume)
    const drumpadVolume = computed(() => config.value.drumpadVolume)

    migratePersistedView()

    return {
      // State
      config,
      overallVolume,
      metronomeVolume,
      drumpadVolume,
      // Actions
      setTheme,
      setOverallVolume,
      setMetronomeVolume,
      setDrumpadVolume,
      resetVolumes,
      setView,
      toggleHihat,
      toggleRimshot,
      setMetronomeBpm,
      migratePersistedView,
      normalizeVolumes,
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
      pick: ['config'],
    },
  },
)
