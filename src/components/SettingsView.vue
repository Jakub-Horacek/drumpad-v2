<template>
  <div class="view settings-view">
    <div class="view__content">
      <h2 class="view__title">Settings</h2>

      <div class="settings-group">
        <h3>Audio Settings</h3>

        <div class="setting-item">
          <label class="setting-label" for="overall-volume">Overall</label>
          <input
            id="overall-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="overallVolume"
            class="range-input"
            @input="onOverallVolume"
          />
          <span class="setting-value">{{ percent(overallVolume) }}%</span>
        </div>

        <div class="setting-item">
          <label class="setting-label" for="metronome-volume">Metronome</label>
          <input
            id="metronome-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="metronomeVolume"
            class="range-input"
            @input="onMetronomeVolume"
          />
          <span class="setting-value">{{ percent(metronomeVolume) }}%</span>
        </div>

        <div class="setting-item">
          <label class="setting-label" for="drumpad-volume">Drumpad</label>
          <input
            id="drumpad-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="drumpadVolume"
            class="range-input"
            @input="onDrumpadVolume"
          />
          <span class="setting-value">{{ percent(drumpadVolume) }}%</span>
        </div>

        <button type="button" class="volume-reset-btn" @click="$emit('reset-volumes')">
          Reset volume to defaults
        </button>
      </div>

      <div class="settings-group">
        <h3>Appearance</h3>
        <ThemeSelector :current-theme="currentTheme" @theme-change="handleThemeChange" />
      </div>

      <div class="settings-group">
        <h3>Tips</h3>
        <div class="tip-display">
          <p class="tip-text">{{ currentTip.text }}</p>
          <button class="tip-btn" @click="$emit('next-tip')">Next Tip</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ThemeSelector from './ThemeSelector.vue'

export default defineComponent({
  name: 'SettingsView',
  components: {
    ThemeSelector,
  },
  props: {
    overallVolume: {
      type: Number,
      required: true,
    },
    metronomeVolume: {
      type: Number,
      required: true,
    },
    drumpadVolume: {
      type: Number,
      required: true,
    },
    currentTheme: {
      type: String,
      required: true,
    },
    currentTip: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'overall-volume-change',
    'metronome-volume-change',
    'drumpad-volume-change',
    'reset-volumes',
    'theme-change',
    'next-tip',
  ],
  setup(_, { emit }) {
    const percent = (value: number) => {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        return 70
      }
      return Math.round(value * 100)
    }

    const parseVolume = (event: Event) => parseFloat((event.target as HTMLInputElement).value)

    const onOverallVolume = (event: Event) => {
      emit('overall-volume-change', parseVolume(event))
    }

    const onMetronomeVolume = (event: Event) => {
      emit('metronome-volume-change', parseVolume(event))
    }

    const onDrumpadVolume = (event: Event) => {
      emit('drumpad-volume-change', parseVolume(event))
    }

    const handleThemeChange = (themeId: string) => {
      emit('theme-change', themeId)
    }

    return {
      percent,
      onOverallVolume,
      onMetronomeVolume,
      onDrumpadVolume,
      handleThemeChange,
    }
  },
})
</script>

<style scoped>
.view {
  min-height: calc(100vh - 8rem);
  padding: 1rem;
  box-sizing: border-box;
}

.view__content {
  max-width: 800px;
  margin: 0 auto;
}

.view__title {
  text-align: center;
  margin-bottom: 2rem;
  font-family: var(--font-primary);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* Settings View */
.settings-group {
  margin-bottom: 2rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.settings-group h3 {
  margin-bottom: 1rem;
  color: var(--accent-color);
  font-size: 1.125rem;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-label {
  min-width: 5.5rem;
  font-weight: 500;
}

.range-input {
  flex: 1;
  height: 0.5rem;
  background: var(--bg-tertiary);
  border-radius: 0.25rem;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 1rem;
  height: 1rem;
  background: var(--accent-color);
  border-radius: 50%;
  cursor: pointer;
}

.setting-value {
  min-width: 3rem;
  text-align: right;
  font-weight: 600;
  color: var(--accent-color);
}

.volume-reset-btn {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.volume-reset-btn:hover {
  background: var(--bg-quaternary, var(--bg-tertiary));
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.tip-display {
  background: var(--bg-tertiary);
  border-radius: 0.5rem;
  padding: 1rem;
}

.tip-text {
  margin-bottom: 0.75rem;
  font-style: italic;
}

.tip-btn {
  padding: 0.375rem 0.75rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
}

/* Desktop styles */
@media (min-width: 768px) {
  .view {
    min-height: calc(100vh - 5rem);
  }
}
</style>
