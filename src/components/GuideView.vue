<template>
  <div class="view guide-view">
    <div class="view__content">
      <h2 class="view__title">How to Play</h2>
      <div class="guide-grid">
        <div v-for="drum in sortedDrums" :key="drum.id" class="guide-item">
          <div class="guide-item__key">{{ drum.keyCode }}</div>
          <div class="guide-item__name">{{ drum.name }}</div>
        </div>
      </div>

      <div class="guide-tips">
        <h3>Pro Tips</h3>
        <ul>
          <li>Use <kbd>-</kbd> to toggle Hi-Hat open/closed</li>
          <li>Use <kbd>+</kbd> to toggle Snare/Rimshot</li>
          <li>Press <kbd>Space</kbd> to play/pause recordings</li>
          <li>Press <kbd>Shift + Space</kbd> to start/stop recording</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { DRUM_SAMPLES } from '../types'

export default defineComponent({
  name: 'GuideView',
  setup() {
    const sortedDrums = computed(() => {
      return [...DRUM_SAMPLES].sort((a, b) => a.position - b.position)
    })

    return {
      sortedDrums,
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

/* Guide View */
.guide-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.guide-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
}

.guide-item__key {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
}

.guide-item__name {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.guide-tips {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.guide-tips h3 {
  margin-bottom: 1rem;
  color: var(--accent-color);
}

.guide-tips ul {
  list-style: none;
  padding: 0;
}

.guide-tips li {
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.guide-tips li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent-color);
}

kbd {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Desktop styles */
@media (min-width: 768px) {
  .view {
    min-height: calc(100vh - 5rem);
  }
}
</style>
