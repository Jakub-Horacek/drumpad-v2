<template>
  <div class="view settings-view">
    <div class="view__content">
      <h2 class="view__title">Settings</h2>

      <div class="settings-group">
        <h3>Audio Settings</h3>

        <div class="setting-item">
          <label class="setting-label">Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="volume"
            @input="handleVolumeChange"
            class="range-input"
          />
          <span class="setting-value">{{ Math.round(volume * 100) }}%</span>
        </div>
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
    volume: {
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
  emits: ['volume-change', 'theme-change', 'next-tip'],
  setup(_, { emit }) {
    const handleVolumeChange = (event: Event) => {
      const target = event.target as HTMLInputElement
      emit('volume-change', parseFloat(target.value))
    }

    const handleThemeChange = (themeId: string) => {
      emit('theme-change', themeId)
    }

    return {
      handleVolumeChange,
      handleThemeChange,
    }
  },
})
</script>

<style scoped>
.view {
  min-height: calc(100vh - 8rem);
  padding: 1rem;
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
  min-width: 4rem;
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
