<template>
  <div class="view drumpad-view">
    <DrumPad />

    <!-- Recording Controls -->
    <div class="controls">
      <button
        :class="['control-btn', 'control-btn--record', { 'control-btn--active': isRecording }]"
        :disabled="!isAudioReady"
        @click="$emit('toggle-recording')"
      >
        <RecordIcon class="control-btn__icon" />
        {{ isRecording ? 'Stop Recording' : 'Record' }}
      </button>

      <button
        :class="['control-btn', 'control-btn--play']"
        :disabled="recordedEvents.length === 0 || !isAudioReady"
        @click="$emit('toggle-playing')"
      >
        <component :is="isPlaying ? PauseIcon : PlayIcon" class="control-btn__icon" />
        {{ isPlaying ? 'Stop' : 'Play' }}
      </button>

      <button
        class="control-btn control-btn--clear"
        :disabled="recordedEvents.length === 0 || !isAudioReady"
        @click="$emit('clear-recording')"
      >
        <TrashIcon class="control-btn__icon" />
        Clear
      </button>

      <!-- Debug buttons - only visible in debug mode -->
      <template v-if="isDebugMode">
        <button
          class="control-btn control-btn--stop"
          :disabled="!isAudioReady"
          @click="$emit('stop-all-sounds')"
        >
          <StopIcon class="control-btn__icon" />
          Stop All
        </button>

        <button
          class="control-btn control-btn--debug"
          :disabled="!isAudioReady"
          @click="$emit('play-all-sounds')"
        >
          <PlayAllIcon class="control-btn__icon" />
          Play All
        </button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue'
import DrumPad from './DrumPad.vue'

// Icon components
/** Play icon component */
const PlayIcon = defineComponent({
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M8 5v14l11-7z' }),
    ])
  },
})

/** Pause icon component */
const PauseIcon = defineComponent({
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z' }),
    ])
  },
})

/** Record icon component */
const RecordIcon = defineComponent({
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('circle', { cx: '12', cy: '12', r: '8' }),
    ])
  },
})

/** Trash/delete icon component */
const TrashIcon = defineComponent({
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', {
        d: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
      }),
    ])
  },
})

/** Stop icon component */
const StopIcon = defineComponent({
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M6 6h12v12H6z' }),
    ])
  },
})

/** Play all sounds icon component */
const PlayAllIcon = defineComponent({
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M8 5v14l11-7z' }),
      h('path', { d: 'M2 5v14l11-7z', opacity: '0.5' }),
    ])
  },
})

/**
 * Main drum pad view component.
 * Contains the drum pad grid and recording/playback controls.
 * Includes debug controls that are only visible in debug mode.
 */
export default defineComponent({
  name: 'DrumpadView',
  components: {
    DrumPad,
    RecordIcon,
    PlayIcon,
    PauseIcon,
    TrashIcon,
    StopIcon,
    PlayAllIcon,
  },
  props: {
    /** Whether recording is currently active */
    isRecording: {
      type: Boolean,
      required: true,
    },
    /** Whether playback is currently active */
    isPlaying: {
      type: Boolean,
      required: true,
    },
    /** Array of recorded drum events */
    recordedEvents: {
      type: Array,
      required: true,
    },
    /** Whether audio is ready for playback */
    isAudioReady: {
      type: Boolean,
      required: true,
    },
    /** Whether debug mode is enabled */
    isDebugMode: {
      type: Boolean,
      required: true,
    },
  },
  emits: [
    'toggle-recording',
    'toggle-playing',
    'clear-recording',
    'stop-all-sounds',
    'play-all-sounds',
  ],
  setup() {
    return {
      PlayIcon,
      PauseIcon,
      RecordIcon,
      TrashIcon,
      StopIcon,
      PlayAllIcon,
    }
  },
})
</script>

<style scoped>
.view {
  min-height: calc(100vh - 8rem);
  padding: 1rem;
}

/* Controls */
.controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  flex-wrap: wrap;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.control-btn:hover:not(:disabled) {
  background: var(--bg-tertiary);
  transform: translateY(-1px);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn--record.control-btn--active {
  background: var(--danger-color);
  border-color: var(--danger-color);
  color: white;
}

.control-btn--stop {
  background: var(--warning-color, #f59e0b);
  border-color: var(--warning-color, #f59e0b);
  color: white;
}

.control-btn--stop:hover:not(:disabled) {
  background: var(--warning-color-dark, #d97706);
  border-color: var(--warning-color-dark, #d97706);
}

.control-btn--debug {
  background: var(--accent-color, #3b82f6);
  border-color: var(--accent-color, #3b82f6);
  color: white;
}

.control-btn--debug:hover:not(:disabled) {
  background: var(--accent-color-dark, #2563eb);
  border-color: var(--accent-color-dark, #2563eb);
}

.control-btn__icon {
  width: 1rem;
  height: 1rem;
}

/* Desktop styles */
@media (min-width: 768px) {
  .view {
    min-height: calc(100vh - 5rem);
  }
}
</style>
