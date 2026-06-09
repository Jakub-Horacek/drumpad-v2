<template>
  <Teleport to="body" :disabled="!teleportToBody">
    <nav class="mobile-nav">
      <button
        v-for="view in views"
        :key="view.id"
        :class="['mobile-nav__btn', { 'mobile-nav__btn--active': currentView === view.id }]"
        @click="$emit('view-change', view.id)"
      >
        <component :is="view.icon" class="mobile-nav__icon" />
        <span class="mobile-nav__label">{{ view.label }}</span>
      </button>
    </nav>
  </Teleport>
</template>

<script lang="ts">
import { computed, defineComponent, h, onMounted } from 'vue'
import { useTouchPrimaryDevice } from '../composables/useTouchPrimaryDevice'
import { syncPwaLayout } from '../utils/pwaLayout'
import { isStandalonePwa } from '../utils/isStandalonePwa'
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

const InfoIcon = defineComponent({
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', {
        d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
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
  name: 'AppNavigation',
  components: {
    GridIcon,
    InfoIcon,
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
    const { isTouchPrimary } = useTouchPrimaryDevice()
    const teleportToBody = computed(() => isStandalonePwa() && isTouchPrimary.value)

    const views = [
      { id: 'info' as ViewMode, label: 'Info', icon: 'InfoIcon' },
      { id: 'drumpad' as ViewMode, label: 'Drumpad', icon: 'GridIcon' },
      { id: 'settings' as ViewMode, label: 'Settings', icon: 'SettingsIcon' },
    ]

    onMounted(() => {
      if (!teleportToBody.value) {
        return
      }
      syncPwaLayout()
      requestAnimationFrame(syncPwaLayout)
    })

    return {
      views,
      teleportToBody,
    }
  },
})
</script>

<style scoped>
/* Mobile Navigation */
.mobile-nav {
  display: flex;
  flex-shrink: 0;
  width: 100%;
  z-index: 100;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding-top: 0.75rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  gap: 0.25rem;
  box-sizing: border-box;
}

.mobile-nav__btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: transparent;
  color: var(--text-secondary);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-nav__btn--active {
  background: var(--accent-color-light);
  color: var(--accent-color);
}

.mobile-nav__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.mobile-nav__label {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Desktop styles */
@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}
</style>
