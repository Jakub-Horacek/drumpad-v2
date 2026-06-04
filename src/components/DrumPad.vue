<template>
  <div class="drumpad">
    <div
      class="metro-beat-bar"
      :class="{
        'metro-beat-bar--running': isMetronomeRunning,
        'metro-beat-bar--flash': metronomeBeatFlash,
      }"
      aria-hidden="true"
    >
      <div
        v-if="isMetronomeRunning && metronomeBeatNumber > 0"
        :key="metronomeBeatNumber"
        class="metro-beat-bar__strike"
      />
      <span
        v-for="beat in 4"
        :key="beat"
        class="metro-beat-bar__dot"
        :class="{ 'metro-beat-bar__dot--on': metronomeBeatNumber === beat }"
      />
    </div>

    <div class="drumpad__grid">
      <div class="drumpad__metro-row">
        <button
          type="button"
          class="drum-toggle drum-toggle--metro drum-toggle--horizontal drum-toggle--metro-minus"
          :disabled="!store.isAudioReady"
          aria-label="Decrease BPM"
          @mousedown.prevent="bpmDecreaseHold.startHold"
          @mouseup="bpmDecreaseHold.stopHold"
          @mouseleave="bpmDecreaseHold.stopHold"
          @touchstart.prevent="bpmDecreaseHold.startHold"
          @touchend.prevent="bpmDecreaseHold.stopHold"
          @touchcancel="bpmDecreaseHold.stopHold"
        >
          <span class="drum-toggle__symbol">/</span>
          <span class="drum-toggle__text">
            <span class="drum-toggle__label">BPM</span>
            <span class="drum-toggle__state">−</span>
          </span>
        </button>

        <div
          class="drum-toggle drum-toggle--metro drum-toggle--horizontal drum-toggle--metro-bpm"
          :class="{
            'drum-toggle--active': isMetronomeRunning,
            'drum-toggle--beat-flash': metronomeBeatFlash,
          }"
        >
          <input
            type="number"
            class="drum-toggle__bpm-input"
            :min="METRONOME_BPM_MIN"
            :max="METRONOME_BPM_MAX"
            :value="store.config.metronomeBpm"
            :disabled="!store.isAudioReady"
            aria-label="Beats per minute"
            @change="onBpmCommit"
          />
          <span class="drum-toggle__text">
            <span class="drum-toggle__label">Tempo</span>
            <span class="drum-toggle__state">{{ isMetronomeRunning ? 'On' : 'Off' }}</span>
          </span>
        </div>

        <button
          type="button"
          class="drum-toggle drum-toggle--metro drum-toggle--horizontal drum-toggle--metro-plus"
          :disabled="!store.isAudioReady"
          aria-label="Increase BPM"
          @mousedown.prevent="bpmIncreaseHold.startHold"
          @mouseup="bpmIncreaseHold.stopHold"
          @mouseleave="bpmIncreaseHold.stopHold"
          @touchstart.prevent="bpmIncreaseHold.startHold"
          @touchend.prevent="bpmIncreaseHold.stopHold"
          @touchcancel="bpmIncreaseHold.stopHold"
        >
          <span class="drum-toggle__symbol">*</span>
          <span class="drum-toggle__text">
            <span class="drum-toggle__label">BPM</span>
            <span class="drum-toggle__state">+</span>
          </span>
        </button>
      </div>

      <button
        type="button"
        class="drum-toggle drum-toggle--minus"
        :class="{ 'drum-toggle--active': store.config.hihatClosed === false }"
        :disabled="!store.isAudioReady"
        aria-label="Toggle hi-hat open or closed"
        @click="store.toggleHihat()"
      >
        <span class="drum-toggle__symbol">−</span>
        <span class="drum-toggle__text">
          <span class="drum-toggle__label">Hi-Hat</span>
          <span class="drum-toggle__state">{{
            store.config.hihatClosed !== false ? 'Closed' : 'Open'
          }}</span>
        </span>
      </button>

      <button
        type="button"
        class="drum-toggle drum-toggle--plus"
        :class="{ 'drum-toggle--active': store.config.useRimshot }"
        :disabled="!store.isAudioReady"
        aria-label="Toggle snare or rimshot"
        @click="store.toggleRimshot()"
      >
        <span class="drum-toggle__symbol">+</span>
        <span class="drum-toggle__text">
          <span class="drum-toggle__label">Snare</span>
          <span class="drum-toggle__state">{{
            store.config.useRimshot ? 'Rimshot' : 'Normal'
          }}</span>
        </span>
      </button>

      <button
        type="button"
        class="drum-toggle drum-toggle--horizontal drum-toggle--zero drum-toggle--record"
        :class="{ 'drum-toggle--active': store.isRecording }"
        :disabled="!store.isAudioReady"
        aria-label="Start or stop recording"
        @click="store.toggleRecording()"
      >
        <span class="drum-toggle__symbol">0</span>
        <span class="drum-toggle__text">
          <span class="drum-toggle__label">Record</span>
          <span class="drum-toggle__state">{{ store.isRecording ? 'Stop' : 'Start' }}</span>
        </span>
      </button>

      <button
        type="button"
        class="drum-toggle drum-toggle--enter drum-toggle--clear"
        :disabled="!store.isAudioReady || store.recordedEvents.length === 0"
        aria-label="Clear recording"
        @click="store.clearRecording()"
      >
        <span class="drum-toggle__symbol">↵</span>
        <span class="drum-toggle__text">
          <span class="drum-toggle__label">Clear</span>
          <span class="drum-toggle__state">Enter</span>
        </span>
      </button>

      <button
        type="button"
        class="drum-toggle drum-toggle--horizontal drum-toggle--decimal drum-toggle--play"
        :class="{ 'drum-toggle--active': store.isPlaying }"
        :disabled="!store.isAudioReady || store.recordedEvents.length === 0"
        aria-label="Play or stop recording"
        @click="store.togglePlaying()"
      >
        <span class="drum-toggle__symbol">.</span>
        <span class="drum-toggle__text">
          <span class="drum-toggle__label">Play</span>
          <span class="drum-toggle__state">{{ store.isPlaying ? 'Stop' : 'Start' }}</span>
        </span>
      </button>

      <PadTile
        v-for="drum in sortedDrums"
        :key="drum.id"
        :drum="drum"
        :is-active="store.isPadActive(drum.id)"
        :disabled="!store.isAudioReady"
        :style="padGridStyle(drum.position)"
        @play="store.playDrum"
      />
    </div>

    <button
      type="button"
      class="drum-toggle drum-toggle--metro drum-toggle--horizontal drum-toggle--metro-space"
      :class="{
        'drum-toggle--active': isMetronomeRunning,
        'drum-toggle--beat-flash': metronomeBeatFlash,
      }"
      :disabled="!store.isAudioReady"
      aria-label="Start or stop metronome (Space)"
      @click="store.toggleMetronome()"
    >
      <span class="drum-toggle__symbol drum-toggle__metro-icon" aria-hidden="true">
        <svg
          v-if="isMetronomeRunning"
          class="drum-toggle__metro-icon-svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M6 6h12v12H6z" />
        </svg>
        <svg v-else class="drum-toggle__metro-icon-svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span class="drum-toggle__spacebar">Space</span>
      <span class="drum-toggle__text">
        <span class="drum-toggle__label">Metronome</span>
        <span class="drum-toggle__state">{{
          isMetronomeRunning ? 'Stop' : 'Start'
        }}</span>
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDrumpadStore } from '../stores/drumpadStore'
import { DRUM_SAMPLES, METRONOME_BPM_MAX, METRONOME_BPM_MIN } from '../types'
import PadTile from './PadTile.vue'
import { useAcceleratingHold } from '../composables/useAcceleratingHold'

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
    const { isMetronomeRunning, metronomeBeatFlash, metronomeBeatNumber } = storeToRefs(store)

    const bpmDecreaseHold = useAcceleratingHold(() => store.decreaseMetronomeBpm())
    const bpmIncreaseHold = useAcceleratingHold(() => store.increaseMetronomeBpm())

    /**
     * Computed property that returns drums sorted by their position.
     * Creates a copy of DRUM_SAMPLES and sorts them for proper grid layout.
     *
     * @returns {DrumSample[]} Array of drums sorted by position
     */
    const sortedDrums = computed(() => {
      return [...DRUM_SAMPLES].sort((a, b) => a.position - b.position)
    })

    onUnmounted(() => {
      void store.stopMetronome()
    })

    /** Numpad layout: row 1 metronome, pads 7–9 on row 2 */
    function padGridStyle(position: number): { gridRow: string; gridColumn: string } {
      const row = Math.floor((position - 1) / 3) + 2
      const col = ((position - 1) % 3) + 1
      return { gridRow: String(row), gridColumn: String(col) }
    }

    const onBpmCommit = (event: Event) => {
      const value = Number((event.target as HTMLInputElement).value)
      if (!Number.isNaN(value)) {
        store.setMetronomeBpm(value)
      } else {
        ;(event.target as HTMLInputElement).value = String(store.config.metronomeBpm)
      }
    }

    return {
      store,
      isMetronomeRunning,
      metronomeBeatFlash,
      metronomeBeatNumber,
      sortedDrums,
      padGridStyle,
      onBpmCommit,
      bpmDecreaseHold,
      bpmIncreaseHold,
      METRONOME_BPM_MIN,
      METRONOME_BPM_MAX,
    }
  },
})
</script>

<style scoped>
.drumpad {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  box-sizing: border-box;
}

.drum-toggle {
  min-height: 80px;
  padding: 0.35rem 0.25rem;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  text-align: center;
}

.drum-toggle__symbol {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
  color: var(--accent-color-dark);
}

.drum-toggle--active .drum-toggle__symbol {
  color: white;
}

.drum-toggle__label {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1.1;
}

.drum-toggle__state {
  font-size: 0.55rem;
  font-weight: 500;
  opacity: 0.85;
  line-height: 1.1;
}

.drum-toggle__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.05rem;
}

.drum-toggle--horizontal {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.25rem 0.5rem;
  text-align: center;
}

.drum-toggle--horizontal .drum-toggle__text {
  min-width: 0;
}

.drum-toggle--horizontal .drum-toggle__symbol {
  flex-shrink: 0;
}

.drumpad__metro-row {
  grid-column: 1 / -1;
  grid-row: 1;
  display: grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  gap: 12px;
  align-items: stretch;
}

.drumpad__metro-row .drum-toggle--metro {
  min-height: 0;
  width: 100%;
}

.drum-toggle--metro {
  background: var(--metro-bg, var(--bg-tertiary));
  border-color: var(--metro-border, var(--border-color-light));
  color: var(--text-secondary);
}

.drum-toggle--metro .drum-toggle__symbol,
.drum-toggle--metro .drum-toggle__bpm-input,
.drum-toggle--metro .drum-toggle__spacebar,
.drum-toggle--metro .drum-toggle__metro-icon {
  color: var(--accent-color-dark);
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
}

.drum-toggle--metro:hover:not(:disabled):not(.drum-toggle--active) {
  background: var(--metro-bg-hover, var(--bg-quaternary));
  border-color: var(--metro-border, var(--border-color-light));
  color: var(--text-primary);
  transform: none;
}

.drum-toggle--metro.drum-toggle--active {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

.drum-toggle--metro.drum-toggle--active .drum-toggle__label,
.drum-toggle--metro.drum-toggle--active .drum-toggle__state {
  color: white;
}

.drum-toggle--metro.drum-toggle--active:hover {
  background: var(--accent-color-dark);
  border-color: var(--accent-color-dark);
}

.drum-toggle--metro-bpm {
  cursor: default;
}

.metro-beat-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 1.75rem;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  background: var(--metro-inset-bg, var(--bg-quaternary));
  border: 2px solid var(--metro-border, var(--border-color-light));
  box-sizing: border-box;
  opacity: 0.45;
  overflow: hidden;
  transition: opacity 0.2s ease;
}

.metro-beat-bar--running {
  opacity: 1;
}

.metro-beat-bar__strike {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--accent-color, #ff8c3c);
  pointer-events: none;
  animation: metro-beat-strike 0.3s ease-out forwards;
}

@keyframes metro-beat-strike {
  0% {
    opacity: 1;
    transform: scale(1.08);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

.metro-beat-bar--flash {
  border-color: var(--accent-color, #ff8c3c);
  box-shadow: 0 0 18px rgba(255, 140, 60, 0.7);
}

.metro-beat-bar__dot {
  position: relative;
  z-index: 1;
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 50%;
  background: var(--metro-border, var(--border-color-light));
  opacity: 0.4;
}

.metro-beat-bar--running .metro-beat-bar__dot {
  opacity: 0.55;
}

.metro-beat-bar__dot--on {
  opacity: 1;
  background: var(--accent-color-dark, #e67a2e);
  transform: scale(1.75);
  box-shadow: 0 0 12px rgba(255, 140, 60, 0.9);
}

.metro-beat-bar--flash .metro-beat-bar__dot--on {
  background: #fff;
  transform: scale(2);
  box-shadow: 0 0 14px #fff;
}

.drum-toggle--beat-flash:not(.drum-toggle--active) {
  background: var(--accent-color) !important;
  border-color: var(--accent-color) !important;
  color: white !important;
}

.drum-toggle--beat-flash:not(.drum-toggle--active) .drum-toggle__symbol,
.drum-toggle--beat-flash:not(.drum-toggle--active) .drum-toggle__bpm-input,
.drum-toggle--beat-flash:not(.drum-toggle--active) .drum-toggle__spacebar,
.drum-toggle--beat-flash:not(.drum-toggle--active) .drum-toggle__label,
.drum-toggle--beat-flash:not(.drum-toggle--active) .drum-toggle__state {
  color: white !important;
  filter: none !important;
}

.drum-toggle--metro.drum-toggle--active.drum-toggle--beat-flash {
  filter: brightness(1.5);
  box-shadow:
    0 0 0 3px #fff,
    0 0 16px rgba(255, 255, 255, 0.65);
}

.drum-toggle--beat-flash .drum-toggle__bpm-input {
  transform: scale(1.15);
  transition: transform 0.08s ease-out;
}

.drum-toggle--metro-minus .drum-toggle__symbol,
.drum-toggle--metro-plus .drum-toggle__symbol {
  font-size: 1.25rem;
}

.drum-toggle--metro .drum-toggle__bpm-input {
  width: 2.75rem;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  font-weight: 800;
  font-family: var(--font-secondary);
  text-align: center;
  outline: none;
  flex-shrink: 0;
  transition: transform 0.12s ease-out;
}

.drum-toggle--metro.drum-toggle--active .drum-toggle__symbol,
.drum-toggle--metro.drum-toggle--active .drum-toggle__bpm-input,
.drum-toggle--metro.drum-toggle--active .drum-toggle__spacebar,
.drum-toggle--metro.drum-toggle--active .drum-toggle__metro-icon,
.drum-toggle--metro.drum-toggle--active .drum-toggle__metro-icon-svg {
  color: white;
  filter: none;
}

.drum-toggle__bpm-input:disabled {
  opacity: 0.5;
}

.drum-toggle__bpm-input::-webkit-outer-spin-button,
.drum-toggle__bpm-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.drum-toggle__bpm-input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.drum-toggle--metro-space {
  width: 100%;
  min-height: 48px;
  flex-shrink: 0;
  padding: 0.5rem 0.75rem;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}

.drum-toggle--metro-space .drum-toggle__metro-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  margin: 0;
  padding: 0;
  line-height: 0;
}

.drum-toggle--metro-space .drum-toggle__metro-icon-svg {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
}

.drum-toggle--metro .drum-toggle__spacebar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  min-height: 2rem;
  padding: 0 1rem;
  background: var(--metro-inset-bg, var(--bg-quaternary));
  border: 1px solid var(--metro-border, var(--border-color-light));
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.drum-toggle--metro.drum-toggle--active .drum-toggle__spacebar {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.35);
}

.drum-toggle--metro-space .drum-toggle__text {
  flex-shrink: 0;
  align-self: center;
  justify-content: center;
}

.drum-toggle--minus {
  grid-row: 2;
  grid-column: 4;
  align-self: center;
}

.drum-toggle--plus {
  grid-row: 3;
  grid-column: 4;
  align-self: center;
}

.drum-toggle--enter {
  grid-row: 4 / 6;
  grid-column: 4;
  align-self: stretch;
  min-height: 0;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.35rem 0.2rem;
}

.drum-toggle--zero {
  grid-row: 5;
  grid-column: 1 / 3;
  align-self: stretch;
  min-height: 0;
}

.drum-toggle--decimal {
  grid-row: 5;
  grid-column: 3;
  align-self: stretch;
  min-height: 0;
}

.drum-toggle--zero .drum-toggle__symbol,
.drum-toggle--decimal .drum-toggle__symbol {
  font-size: 1.15rem;
}

.drum-toggle--zero .drum-toggle__label,
.drum-toggle--decimal .drum-toggle__label {
  font-size: 0.55rem;
}

.drum-toggle--zero .drum-toggle__state,
.drum-toggle--decimal .drum-toggle__state {
  font-size: 0.5rem;
}

.drum-toggle--enter .drum-toggle__label {
  font-size: 0.55rem;
}

.drum-toggle--enter .drum-toggle__state {
  font-size: 0.5rem;
}

.drum-toggle--enter .drum-toggle__symbol {
  font-size: 1.25rem;
}

.drum-toggle--record.drum-toggle--active {
  background: var(--danger-color);
  border-color: var(--danger-color);
  color: white;
}

.drum-toggle--record.drum-toggle--active .drum-toggle__symbol,
.drum-toggle--record.drum-toggle--active .drum-toggle__label,
.drum-toggle--record.drum-toggle--active .drum-toggle__state {
  color: white;
}

.drum-toggle--record.drum-toggle--active:hover {
  background: var(--danger-color-dark, #dc2626);
  border-color: var(--danger-color-dark, #dc2626);
}

.drum-toggle--play.drum-toggle--active {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

.drum-toggle--play.drum-toggle--active .drum-toggle__symbol,
.drum-toggle--play.drum-toggle--active .drum-toggle__label,
.drum-toggle--play.drum-toggle--active .drum-toggle__state {
  color: white;
}

.drum-toggle--play.drum-toggle--active:hover {
  background: var(--accent-color-dark);
  border-color: var(--accent-color-dark);
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
  grid-template-columns: repeat(3, 1fr) minmax(3.75rem, 0.42fr);
  grid-template-rows: minmax(52px, auto) repeat(3, minmax(80px, 1fr)) minmax(44px, auto);
  gap: 12px;
}

@media (min-width: 768px) {
  .drumpad {
    max-width: 600px;
    gap: 16px;
    padding: 24px;
  }

  .drumpad__grid {
    gap: 16px;
    grid-template-rows: minmax(56px, auto) repeat(3, minmax(100px, 1fr)) minmax(48px, auto);
  }

  .drumpad__metro-row {
    gap: 16px;
  }

  .drum-toggle {
    min-height: 100px;
  }

  .drum-toggle--metro-minus,
  .drum-toggle--metro-plus,
  .drum-toggle--metro-bpm,
  .drum-toggle--metro-space,
  .drum-toggle--zero,
  .drum-toggle--decimal {
    min-height: 0;
  }

  .drum-toggle__bpm-input {
    font-size: 1.4rem;
  }

  .drum-toggle--zero .drum-toggle__symbol,
  .drum-toggle--decimal .drum-toggle__symbol {
    font-size: 1.25rem;
  }

  .drum-toggle__symbol {
    font-size: 1.75rem;
  }

  .drum-toggle__label {
    font-size: 0.65rem;
  }

  .drum-toggle__state {
    font-size: 0.6rem;
  }
}

@media (min-width: 1024px) {
  .drumpad {
    max-width: 720px;
    gap: 20px;
    padding: 32px;
  }

  .drumpad__grid {
    gap: 20px;
    grid-template-rows: minmax(60px, auto) repeat(3, minmax(120px, 1fr)) minmax(52px, auto);
  }

  .drumpad__metro-row {
    gap: 20px;
  }

  .drum-toggle {
    min-height: 120px;
  }

  .drum-toggle--metro-minus,
  .drum-toggle--metro-plus,
  .drum-toggle--metro-bpm,
  .drum-toggle--metro-space,
  .drum-toggle--zero,
  .drum-toggle--decimal {
    min-height: 0;
  }

  .drum-toggle__bpm-input {
    font-size: 1.5rem;
  }

  .drum-toggle--zero .drum-toggle__symbol,
  .drum-toggle--decimal .drum-toggle__symbol {
    font-size: 1.35rem;
  }

  .drum-toggle__symbol {
    font-size: 2rem;
  }

  .drum-toggle__label {
    font-size: 0.7rem;
  }

  .drum-toggle__state {
    font-size: 0.65rem;
  }
}
</style>
