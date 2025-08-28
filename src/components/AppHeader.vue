<template>
  <header class="app-header">
    <div class="app-header__content">
      <h1 class="app-title">
        <span class="app-title__main">Drumpad</span>
        <span class="app-title__pro">2.0</span>
      </h1>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav">
        <button
          v-for="view in views"
          :key="view.id"
          :class="['nav-btn', { 'nav-btn--active': currentView === view.id }]"
          @click="$emit('view-change', view.id)"
        >
          <component :is="view.icon" class="nav-btn__icon" />
          <span class="nav-btn__label">{{ view.label }}</span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
import type { ViewMode } from '../types'

// Icon components
const GridIcon = defineComponent({
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', {
        d: 'M3 11h8V3H3v8zm2-6h4v4H5V5zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM18 13h-2v2h2v-2zM18 17h-2v2h2v-2zM16 15h2v2h-2v-2z',
      }),
    ])
  },
})

const BookIcon = defineComponent({
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', {
        d: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
      }),
    ])
  },
})

const SettingsIcon = defineComponent({
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', {
        d: 'M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z',
      }),
    ])
  },
})

export default defineComponent({
  name: 'AppHeader',
  components: {
    GridIcon,
    BookIcon,
    SettingsIcon,
  },
  props: {
    currentView: {
      type: String as () => ViewMode,
      required: true,
    },
  },
  emits: ['view-change'],
  setup() {
    const views = [
      { id: 'guide' as ViewMode, label: 'Guide', icon: 'BookIcon' },
      { id: 'drumpad' as ViewMode, label: 'Drumpad', icon: 'GridIcon' },
      { id: 'settings' as ViewMode, label: 'Settings', icon: 'SettingsIcon' },
    ]

    return {
      views,
    }
  },
})
</script>

<style scoped>
/* Header */
.app-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0 1rem;
}

.app-header__content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-family: var(--font-primary);
}

.app-title__main {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
}

.app-title__pro {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-color);
  background: var(--accent-color-light);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.desktop-nav {
  display: none;
  gap: 0.5rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.nav-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.nav-btn--active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.nav-btn__icon {
  width: 1rem;
  height: 1rem;
}

/* Desktop styles */
@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }
}
</style>
