<template>
  <div class="drumpad-view">
    <div class="drumpad-view__center">
      <p class="drumpad-view__hint">
        {{
          isTouchPrimary
            ? 'Tap the pads to play drums'
            : 'Click with your mouse, or play with your numpad'
        }}
      </p>
      <DrumPad />
    </div>

    <div v-if="isDebugMode" class="controls">
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DrumPad from './DrumPad.vue'
import { PlayAllIcon, StopIcon } from './ControlIcons'
import { useTouchPrimaryDevice } from '../composables/useTouchPrimaryDevice'

export default defineComponent({
  name: 'DrumpadView',
  components: {
    DrumPad,
    StopIcon,
    PlayAllIcon,
  },
  setup() {
    const { isTouchPrimary } = useTouchPrimaryDevice()
    return { isTouchPrimary }
  },
  props: {
    isAudioReady: {
      type: Boolean,
      required: true,
    },
    isDebugMode: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['stop-all-sounds', 'play-all-sounds'],
})
</script>

<style scoped>
.drumpad-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
}

.drumpad-view__center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  width: 100%;
}

.drumpad-view__hint {
  margin: 0;
  max-width: 500px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.4;
}

@media (min-width: 768px) {
  .drumpad-view__hint {
    max-width: 600px;
    font-size: 0.95rem;
  }
}

@media (min-width: 1024px) {
  .drumpad-view__hint {
    max-width: 720px;
    font-size: 1rem;
  }
}

/* Mobile resolution or touch-primary: fill available screen for the drumpad */
@media (max-width: 767px), (hover: none) and (pointer: coarse) {
  .drumpad-view {
    overflow: hidden;
  }

  .drumpad-view__center {
    justify-content: flex-start;
    padding: 0.5rem 0.75rem;
    padding-left: max(0.75rem, env(safe-area-inset-left, 0px));
    padding-right: max(0.75rem, env(safe-area-inset-right, 0px));
    gap: 0.5rem;
    min-height: 0;
  }

  .drumpad-view__hint {
    max-width: none;
    flex-shrink: 0;
    font-size: 0.8rem;
  }
}

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

</style>
