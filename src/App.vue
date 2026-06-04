<template>
  <div id="app" :class="`theme-${store.config.currentTheme}`">
    <!-- Audio Loading Overlay -->
    <AudioLoadingOverlay
      :is-loading="store.isAudioLoading"
      :progress="store.audioLoadingProgress"
    />

    <!-- Header -->
    <AppHeader :current-view="store.config.currentView" @view-change="store.setView" />

    <!-- Main Content -->
    <main class="app-main" :class="{ 'app-main--loading': store.isAudioLoading }">
      <!-- Info View -->
      <InfoView v-if="store.config.currentView === 'info'" />

      <!-- Drumpad View -->
      <DrumpadView
        v-if="store.config.currentView === 'drumpad'"
        :is-audio-ready="store.isAudioReady"
        :is-debug-mode="store.isDebugMode"
        @stop-all-sounds="store.stopAllSounds"
        @play-all-sounds="store.playAllSounds"
      />

      <!-- Settings View -->
      <SettingsView
        v-if="store.config.currentView === 'settings'"
        :overall-volume="configStore.overallVolume"
        :metronome-volume="configStore.metronomeVolume"
        :drumpad-volume="configStore.drumpadVolume"
        :current-theme="store.config.currentTheme"
        :current-tip="store.currentTip"
        @overall-volume-change="store.setOverallVolume"
        @metronome-volume-change="store.setMetronomeVolume"
        @drumpad-volume-change="store.setDrumpadVolume"
        @reset-volumes="store.resetVolumes"
        @theme-change="store.setTheme"
        @next-tip="store.nextTip"
      />
    </main>

    <!-- Mobile Navigation -->
    <AppNavigation :current-view="store.config.currentView" @view-change="store.setView" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, watch } from 'vue'
import { applyDocumentTheme } from './themes'
import { useConfigStore } from './stores/configStore'
import { useDrumpadStore } from './stores/drumpadStore'
import AppHeader from './components/AppHeader.vue'
import InfoView from './components/InfoView.vue'
import DrumpadView from './components/DrumpadView.vue'
import SettingsView from './components/SettingsView.vue'
import AppNavigation from './components/AppNavigation.vue'
import AudioLoadingOverlay from './components/AudioLoadingOverlay.vue'

/**
 * Main application component.
 * Manages the overall layout, audio initialization, and keyboard event handling.
 * Provides the main container for all views and components.
 */
export default defineComponent({
  name: 'App',
  components: {
    AppHeader,
    InfoView,
    DrumpadView,
    SettingsView,
    AppNavigation,
    AudioLoadingOverlay,
  },
  setup() {
    const store = useDrumpadStore()
    const configStore = useConfigStore()

    watch(
      () => store.config.currentTheme,
      (theme) => applyDocumentTheme(theme),
      { immediate: true },
    )

    /**
     * Handle keyboard events and pass them to the store.
     *
     * @param {KeyboardEvent} event - The keyboard event to handle
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      store.handleKeyDown(event)
    }

    onMounted(async () => {
      configStore.normalizeVolumes()
      await store.initializeAudio()
      window.addEventListener('keydown', handleKeyDown)

      // Resume audio context on first user interaction
      const resumeAudio = () => {
        store.initializeAudio()
        document.removeEventListener('click', resumeAudio)
        document.removeEventListener('touchstart', resumeAudio)
      }
      document.addEventListener('click', resumeAudio)
      document.addEventListener('touchstart', resumeAudio)
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown)
    })

    return {
      store,
      configStore,
    }
  },
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
}

@media (max-width: 767px) {
  #app {
    height: 100dvh;
    max-height: 100dvh;
    overflow: hidden;
  }
}

/* Main Content */
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  transition: opacity 0.3s ease;
}

.app-main--loading {
  opacity: 0.3;
  pointer-events: none;
}
</style>
