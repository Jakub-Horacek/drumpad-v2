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
      <!-- Guide View -->
      <GuideView v-if="store.config.currentView === 'guide'" />

      <!-- Drumpad View -->
      <DrumpadView
        v-if="store.config.currentView === 'drumpad'"
        :is-recording="store.isRecording"
        :is-playing="store.isPlaying"
        :recorded-events="store.recordedEvents"
        :is-audio-ready="store.isAudioReady"
        :is-debug-mode="store.isDebugMode"
        @toggle-recording="store.toggleRecording"
        @toggle-playing="store.togglePlaying"
        @clear-recording="store.clearRecording"
        @stop-all-sounds="store.stopAllSounds"
        @play-all-sounds="store.playAllSounds"
      />

      <!-- Settings View -->
      <SettingsView
        v-if="store.config.currentView === 'settings'"
        :volume="store.config.volume"
        :current-theme="store.config.currentTheme"
        :current-tip="store.currentTip"
        @volume-change="store.setVolume"
        @theme-change="store.setTheme"
        @next-tip="store.nextTip"
      />
    </main>

    <!-- Mobile Navigation -->
    <AppNavigation :current-view="store.config.currentView" @view-change="store.setView" />

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useDrumpadStore } from './stores/drumpadStore'
import AppHeader from './components/AppHeader.vue'
import GuideView from './components/GuideView.vue'
import DrumpadView from './components/DrumpadView.vue'
import SettingsView from './components/SettingsView.vue'
import AppNavigation from './components/AppNavigation.vue'
import AppFooter from './components/AppFooter.vue'
import AudioLoadingOverlay from './components/AudioLoadingOverlay.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppHeader,
    GuideView,
    DrumpadView,
    SettingsView,
    AppNavigation,
    AppFooter,
    AudioLoadingOverlay,
  },
  setup() {
    const store = useDrumpadStore()

    const handleKeyDown = (event: KeyboardEvent) => {
      store.handleKeyDown(event)
    }

    onMounted(async () => {
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
    }
  },
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Main Content */
.app-main {
  flex: 1;
  overflow-y: auto;
  transition: opacity 0.3s ease;
}

.app-main--loading {
  opacity: 0.3;
  pointer-events: none;
}
</style>
