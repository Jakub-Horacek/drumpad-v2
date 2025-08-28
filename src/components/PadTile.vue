<template>
  <button
    :class="[
      'pad-tile',
      `pad-tile--${drum.id}`,
      { 'pad-tile--active': isActive, 'pad-tile--disabled': disabled },
    ]"
    :disabled="disabled"
    @click="handleClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <div class="pad-tile__content">
      <div class="pad-tile__key">{{ drum.keyCode }}</div>
      <div class="pad-tile__name">{{ drum.name }}</div>
    </div>
    <div v-if="isActive" class="pad-tile__ripple"></div>
  </button>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { DrumSample } from '../types'

/**
 * Individual drum pad tile component.
 * Displays a single drum with its key code and name.
 * Handles click and touch events to trigger drum sounds.
 */
export default defineComponent({
  name: 'PadTile',
  props: {
    /** Drum sample data containing ID, name, key code, etc. */
    drum: {
      type: Object as PropType<DrumSample>,
      required: true,
    },
    /** Whether the pad is currently active (playing) */
    isActive: {
      type: Boolean,
      default: false,
    },
    /** Whether the pad is disabled (e.g., during audio loading) */
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['play'],
  setup(props, { emit }) {
    /** @type {number | null} Timeout ID for touch event handling */
    const touchTimeout: number | null = null

    /**
     * Handle click events on the drum pad.
     * Emits a 'play' event with the drum ID if not disabled.
     */
    const handleClick = () => {
      if (!props.disabled) {
        emit('play', props.drum.id)
      }
    }

    /**
     * Handle touch start events for mobile devices.
     * Prevents default behavior and triggers drum sound if not disabled.
     *
     * @param {TouchEvent} event - The touch start event
     */
    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault()
      if (!props.disabled) {
        emit('play', props.drum.id)
      }
    }

    /**
     * Handle touch end events for mobile devices.
     * Cleans up any pending timeouts.
     *
     * @param {TouchEvent} event - The touch end event
     */
    const handleTouchEnd = (event: TouchEvent) => {
      event.preventDefault()
      if (touchTimeout) {
        clearTimeout(touchTimeout)
      }
    }

    return {
      handleClick,
      handleTouchStart,
      handleTouchEnd,
    }
  },
})
</script>

<style scoped>
.pad-tile {
  position: relative;
  background: var(--pad-bg);
  border: 2px solid var(--pad-border);
  border-radius: 12px;
  color: var(--pad-text);
  font-family: var(--font-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pad-tile:hover {
  background: var(--pad-bg-hover);
  border-color: var(--pad-border-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.pad-tile:active,
.pad-tile--active {
  background: var(--pad-bg-active);
  border-color: var(--pad-border-active);
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.pad-tile--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.pad-tile--disabled:hover {
  background: var(--pad-bg);
  border-color: var(--pad-border);
  transform: none;
  box-shadow: none;
}

.pad-tile__content {
  text-align: center;
  z-index: 2;
  position: relative;
}

.pad-tile__key {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 4px;
  color: var(--accent-color-dark);
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
}

.pad-tile__name {
  font-size: 0.75rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pad-tile__ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background: var(--accent-color);
  border-radius: 50%;
  opacity: 0.3;
  transform: translate(-50%, -50%);
  animation: ripple 0.3s ease-out;
}

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0.5;
  }
  100% {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}

/* Responsive sizing */
@media (min-width: 768px) {
  .pad-tile {
    min-height: 100px;
  }

  .pad-tile__key {
    font-size: 2.2rem;
  }

  .pad-tile__name {
    font-size: 0.85rem;
  }
}

@media (min-width: 1024px) {
  .pad-tile {
    min-height: 120px;
  }

  .pad-tile__key {
    font-size: 2.5rem;
  }

  .pad-tile__name {
    font-size: 0.9rem;
  }
}
</style>
