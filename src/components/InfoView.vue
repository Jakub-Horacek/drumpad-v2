<template>
  <div class="view info-view">
    <div class="view__content">
      <h2 class="view__title">Info</h2>

      <section class="info-section">
        <h3 class="info-section__title">Controls</h3>
        <ul v-if="!isTouchPrimary" class="info-list">
          <li><kbd>−</kbd> / <kbd>Numpad −</kbd> — Hi-hat open / closed</li>
          <li><kbd>+</kbd> / <kbd>Numpad +</kbd> — Snare / rimshot</li>
          <li><kbd>0</kbd> / <kbd>Numpad 0</kbd> — Start / stop recording</li>
          <li><kbd>.</kbd> / <kbd>Numpad .</kbd> — Play / stop recording</li>
          <li><kbd>Numpad Enter</kbd> — Clear recording</li>
          <li><kbd>/</kbd> / <kbd>Numpad /</kbd> — Decrease metronome BPM</li>
          <li><kbd>*</kbd> / <kbd>Numpad *</kbd> — Increase metronome BPM</li>
          <li><kbd>Space</kbd> — Start / stop metronome</li>
          <li><kbd>Numpad 1–9</kbd> — Play drums (matches pad layout)</li>
        </ul>
        <ul v-else class="info-list">
          <li>Drum pads — tap to play</li>
          <li>Hi-Hat — toggle open / closed</li>
          <li>Snare — toggle normal / rimshot</li>
          <li>Record — start / stop recording</li>
          <li>Play — play / stop recording</li>
          <li>Clear — clear recording</li>
          <li>BPM − / + — decrease / increase tempo (hold to repeat)</li>
          <li>Tempo field — type a BPM value directly</li>
          <li>Metronome — start / stop</li>
        </ul>
        <p v-if="!isTouchPrimary" class="info-section__note">
          Record, play, and clear are also available as on-screen buttons below the drum row.
        </p>
        <p v-else class="info-section__note">
          Hi-Hat and Snare toggles sit on the right; Record, Play, and Clear are below the bottom
          drum row.
        </p>
      </section>

      <section class="info-section info-section--legacy">
        <h3 class="info-section__title">History</h3>
        <p class="info-legacy__text">
          <strong>Drumpad 2.0</strong> is a modern rebuild of my first JavaScript project from high
          school — created between December 2018 and April 2019 as my
          <em>Klauzurní Práce</em> (final project). The core idea is unchanged: play virtual drums
          with keys or on-screen pads and hear matching sounds.
        </p>
        <p class="info-legacy__text">
          The original version still runs today. It was plain JavaScript without Vue or TypeScript;
          this app brings the same concept up to date with Vue 3, TypeScript, a metronome,
          recording, themes, and more.
        </p>
        <aside class="info-legacy__warning" role="note">
          <p class="info-legacy__warning-title">Fair warning</p>
          <p class="info-legacy__warning-text">
            The old Drumpad still works, but it is far from ideal — buggy corners, outdated
            patterns, and code I am genuinely ashamed of. Open it for nostalgia or curiosity, not
            because you expect something polished.
          </p>
        </aside>
        <div class="info-legacy__actions">
          <a
            class="info-legacy__link"
            :href="LEGACY_DRUMPAD_URL"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try the original Drumpad
          </a>
          <a
            class="info-legacy__link info-legacy__link--secondary"
            :href="LEGACY_REPO_URL"
            target="_blank"
            rel="noopener noreferrer"
          >
            View source on GitHub
          </a>
        </div>
        <p class="info-section__note">
          Once Drumpad 2.0 is finished, the old project will likely be archived — try it while it is
          still live.
        </p>
      </section>

      <section class="info-section info-section--mobile">
        <h3 class="info-section__title">Mobile</h3>

        <div class="info-mobile__block">
          <template v-if="isStandalonePwa">
            <h4 class="info-mobile__subtitle">Installed app</h4>
            <p class="info-mobile__text">
              You are currently using Drumpad as an installed app — full-screen, on your home
              screen, with offline support after your first visit.
            </p>
            <span class="info-mobile__badge info-mobile__badge--active">Active now</span>
          </template>
          <template v-else>
            <h4 class="info-mobile__subtitle">Install as an app</h4>
            <p class="info-mobile__text">
              Drumpad is a Progressive Web App (PWA). You can add it to your home screen for a
              full-screen, app-like experience — including offline use after the first visit.
            </p>
            <ul class="info-mobile__steps">
              <li>
                <strong>iPhone / iPad (Safari):</strong> tap Share, then
                <em>Add to Home Screen</em>.
              </li>
              <li>
                <strong>Android (Chrome):</strong> open the browser menu, then
                <em>Install app</em> or <em>Add to Home screen</em>.
              </li>
            </ul>
            <span class="info-mobile__badge info-mobile__badge--available">Available now</span>
          </template>
        </div>

        <div class="info-mobile__block info-mobile__block--native">
          <h4 class="info-mobile__subtitle">Native app</h4>
          <p class="info-mobile__text">
            A dedicated native mobile app is also in the works. Stay tuned — coming soon.
          </p>
          <span class="info-mobile__badge">Coming soon</span>
        </div>
      </section>

      <section class="info-section info-credits">
        <h3 class="info-section__title">Credits</h3>
        <div class="info-credits__grid">
          <a
            class="info-credit-card"
            href="https://callmehillman.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="info-credit-card__role">Created by</span>
            <span class="info-credit-card__name">Jakub Horáček</span>
          </a>
          <a
            class="info-credit-card"
            href="https://www.instagram.com/kalacsound/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="info-credit-card__role">Sounds by</span>
            <span class="info-credit-card__name">KalacSound</span>
          </a>
        </div>
        <p class="info-credits__curious">Curious how this project was done?</p>
        <a
          class="info-credit-card info-credit-card--source"
          :href="SOURCE_REPO_URL"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="info-credit-card__role">Source code</span>
          <span class="info-credit-card__name">View on GitHub</span>
        </a>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStandalonePwa } from '../composables/useStandalonePwa'
import { useTouchPrimaryDevice } from '../composables/useTouchPrimaryDevice'

const LEGACY_DRUMPAD_URL = 'https://jakub-horacek.github.io/drumpad/'
const LEGACY_REPO_URL = 'https://github.com/Jakub-Horacek/drumpad'
const SOURCE_REPO_URL = 'https://github.com/Jakub-Horacek/drumpad-v2'

export default defineComponent({
  name: 'InfoView',
  setup() {
    const { isTouchPrimary } = useTouchPrimaryDevice()
    const { isStandalonePwa } = useStandalonePwa()
    return {
      isTouchPrimary,
      isStandalonePwa,
      LEGACY_DRUMPAD_URL,
      LEGACY_REPO_URL,
      SOURCE_REPO_URL,
    }
  },
})
</script>

<style scoped>
.view {
  min-height: calc(100vh - 8rem);
  padding: 1rem;
  padding-bottom: calc(1rem + var(--mobile-nav-offset, 0px));
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

.info-section {
  margin-bottom: 1.25rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
}

.info-section__title {
  margin: 0 0 0.75rem;
  color: var(--accent-color);
  font-size: 1.125rem;
}

.info-section__note {
  margin: 0.75rem 0 0;
  color: var(--text-secondary);
  line-height: 1.5;
  font-size: 0.875rem;
  opacity: 0.9;
}

.info-legacy__text {
  margin: 0 0 0.75rem;
  color: var(--text-secondary);
  line-height: 1.55;
  font-size: 0.9375rem;
}

.info-legacy__text:last-of-type {
  margin-bottom: 1rem;
}

.info-legacy__text strong {
  color: var(--text-primary);
}

.info-legacy__warning {
  margin: 0 0 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--danger-color);
  background: color-mix(in srgb, var(--danger-color) 12%, var(--bg-tertiary));
}

.info-legacy__warning-title {
  margin: 0 0 0.35rem;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--danger-color);
}

.info-legacy__warning-text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.info-legacy__actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.info-legacy__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1rem;
  background: var(--accent-color);
  color: white;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    background 0.2s,
    transform 0.2s;
}

.info-legacy__link:hover {
  background: var(--accent-color-dark, #e67a2e);
  transform: translateY(-1px);
}

.info-legacy__link--secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.info-legacy__link--secondary:hover {
  background: var(--bg-quaternary, var(--bg-tertiary));
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.info-mobile__block {
  margin-bottom: 1.25rem;
}

.info-mobile__block:last-child {
  margin-bottom: 0;
}

.info-mobile__block--native {
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-color);
}

.info-mobile__subtitle {
  margin: 0 0 0.5rem;
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 600;
}

.info-mobile__text {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
  font-size: 0.9375rem;
}

.info-mobile__steps {
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
}

.info-mobile__steps li {
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.45;
}

.info-mobile__steps li:last-child {
  margin-bottom: 0;
}

.info-mobile__steps li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent-color);
}

.info-mobile__steps strong {
  color: var(--text-primary);
}

.info-mobile__badge {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent-color);
  background: var(--accent-color-light, rgba(59, 130, 246, 0.15));
  border: 1px solid var(--accent-color);
  border-radius: 999px;
}

.info-mobile__badge--available {
  color: #22c55e;
  background: color-mix(in srgb, #22c55e 15%, var(--bg-tertiary));
  border-color: #22c55e;
}

.info-mobile__badge--active {
  color: var(--accent-color);
  background: var(--accent-color-light, rgba(59, 130, 246, 0.15));
  border-color: var(--accent-color);
}

.info-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.info-list li {
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.45;
}

.info-list li:last-child {
  margin-bottom: 0;
}

.info-list li::before {
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
  color: var(--text-primary);
}

.info-credits {
  background: linear-gradient(
    135deg,
    var(--bg-secondary) 0%,
    var(--bg-tertiary) 100%
  );
}

.info-credits__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.info-credits__curious {
  margin: 0 0 0.5rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.45;
}

.info-credit-card--source {
  max-width: 20rem;
  margin: 0 auto;
}

.info-credit-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1.25rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.625rem;
  text-decoration: none;
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
}

.info-credit-card:hover {
  border-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.info-credit-card__role {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
}

.info-credit-card__name {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--accent-color);
}

@media (min-width: 768px) {
  .view {
    min-height: calc(100vh - 5rem);
  }

  .info-credits__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-legacy__actions {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .info-legacy__link {
    flex: 1;
    min-width: 12rem;
  }
}
</style>
