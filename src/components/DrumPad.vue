<template>
  <div class="drumpad">
    <!-- Drum Toggle Controls -->
    <div class="drumpad__controls">
      <button
        :class="['drum-toggle', { 'drum-toggle--active': store.config.hihatClosed }]"
        :disabled="!store.isAudioReady"
        @click="store.toggleHihat()"
      >
        Hi-Hat: {{ store.config.hihatClosed ? 'Closed' : 'Open' }}
      </button>

      <button
        :class="['drum-toggle', { 'drum-toggle--active': store.config.useRimshot }]"
        :disabled="!store.isAudioReady"
        @click="store.toggleRimshot()"
      >
        Snare: {{ store.config.useRimshot ? 'Rimshot' : 'Normal' }}
      </button>
    </div>

    <div class="drumpad__grid">
      <PadTile
        v-for="drum in sortedDrums"
        :key="drum.id"
        :drum="drum"
        :is-active="store.isPadActive(drum.id)"
        :disabled="!store.isAudioReady"
        @play="store.playDrum"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useDrumpadStore } from '../stores/drumpadStore'
import { DRUM_SAMPLES } from '../types'
import PadTile from './PadTile.vue'

/**
 * Drum pad component that displays the main drum grid.
 * Includes toggle controls for hi-hat and snare modes.
 * Renders drum pads in a grid layout based on their position.
 */
export default defineComponent({
  name: 'DrumPad',
  components: {
    PadTile,
  },
  setup() {
    const store = useDrumpadStore()

    /**
     * Computed property that returns drums sorted by their position.
     * Creates a copy of DRUM_SAMPLES and sorts them for proper grid layout.
     *
     * @returns {DrumSample[]} Array of drums sorted by position
     */
    const sortedDrums = computed(() => {
      return [...DRUM_SAMPLES].sort((a, b) => a.position - b.position)
    })

    return {
      store,
      sortedDrums,
    }
  },
})
</script>

<style scoped>
.drumpad {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.drumpad__controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0 20px;
}

.drum-toggle {
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.drum-toggle:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.drum-toggle--active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.drum-toggle--active:hover {
  background: var(--accent-color-dark);
  border-color: var(--accent-color-dark);
}

.drum-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.drum-toggle:disabled:hover {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-color: var(--border-color);
  transform: none;
}

.drumpad__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 20px;
}

@media (min-width: 768px) {
  .drumpad {
    max-width: 600px;
  }

  .drumpad__controls {
    padding: 0 24px;
  }

  .drumpad__grid {
    gap: 16px;
    padding: 24px;
  }
}

@media (min-width: 1024px) {
  .drumpad {
    max-width: 720px;
  }

  .drumpad__controls {
    padding: 0 32px;
  }

  .drumpad__grid {
    gap: 20px;
    padding: 32px;
  }
}
</style>
