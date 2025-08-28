<template>
  <div class="theme-selector">
    <label class="theme-selector__label">{{ label }}</label>
    <div class="theme-selector__options">
      <button
        v-for="theme in themes"
        :key="theme.id"
        :class="['theme-option', { 'theme-option--active': theme.id === currentTheme }]"
        @click="selectTheme(theme.id)"
        :title="theme.description"
      >
        <div class="theme-option__preview" :class="`theme-option__preview--${theme.id}`">
          <div class="theme-option__preview-bg"></div>
          <div class="theme-option__preview-accent"></div>
        </div>
        <span class="theme-option__name">{{ theme.name }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { THEMES } from '../themes'

export default defineComponent({
  name: 'ThemeSelector',
  props: {
    currentTheme: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: 'Theme',
    },
  },
  emits: ['theme-change'],
  setup(_, { emit }) {
    const themes = THEMES

    const selectTheme = (themeId: string) => {
      emit('theme-change', themeId)
    }

    return {
      themes,
      selectTheme,
    }
  },
})
</script>

<style scoped>
.theme-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.theme-selector__label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.theme-selector__options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 80px;
}

.theme-option:hover {
  border-color: var(--border-color-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.theme-option--active {
  border-color: var(--accent-color);
  background: var(--accent-color-light);
  box-shadow: 0 0 0 1px var(--accent-color);
}

.theme-option__preview {
  position: relative;
  width: 32px;
  height: 20px;
  border-radius: 0.25rem;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.theme-option__preview-bg {
  width: 100%;
  height: 100%;
  transition: background-color 0.2s ease;
}

.theme-option__preview-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  transition: background-color 0.2s ease;
}

/* Theme preview colors */
.theme-option__preview--dark .theme-option__preview-bg {
  background: #0f0f23;
}

.theme-option__preview--dark .theme-option__preview-accent {
  background: #3b82f6;
}

.theme-option__preview--og .theme-option__preview-bg {
  background: #282828;
}

.theme-option__preview--og .theme-option__preview-accent {
  background: #f5a623;
}

.theme-option__preview--light .theme-option__preview-bg {
  background: #ffffff;
}

.theme-option__preview--light .theme-option__preview-accent {
  background: #3b82f6;
}

.theme-option__preview--cyber .theme-option__preview-bg {
  background: #000000;
}

.theme-option__preview--cyber .theme-option__preview-accent {
  background: #ff0080;
}

.theme-option__name {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-primary);
  text-align: center;
}

.theme-option--active .theme-option__name {
  color: var(--accent-color);
  font-weight: 600;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .theme-selector__options {
    grid-template-columns: repeat(4, 1fr);
  }

  .theme-option {
    min-height: 90px;
  }

  .theme-option__preview {
    width: 36px;
    height: 24px;
  }
}
</style>
