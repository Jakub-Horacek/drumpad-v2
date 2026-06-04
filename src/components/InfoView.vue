<template>
  <div class="view info-view">
    <div class="view__content">
      <h2 class="view__title">Info</h2>

      <section class="info-section">
        <h3 class="info-section__title">Controls</h3>
        <ul class="info-list">
          <li><kbd>−</kbd> / <kbd>Numpad −</kbd> — Hi-hat open / closed</li>
          <li><kbd>+</kbd> / <kbd>Numpad +</kbd> — Snare / rimshot</li>
          <li><kbd>0</kbd> / <kbd>Numpad 0</kbd> — Start / stop recording</li>
          <li><kbd>.</kbd> / <kbd>Numpad .</kbd> — Play / stop recording</li>
          <li><kbd>Numpad Enter</kbd> — Clear recording</li>
          <li><kbd>/</kbd> / <kbd>Numpad /</kbd> — Decrease metronome BPM</li>
          <li><kbd>*</kbd> / <kbd>Numpad *</kbd> — Increase metronome BPM</li>
          <li><kbd>Space</kbd> — Start / stop metronome</li>
        </ul>
        <p class="info-section__note">
          Record, play, and clear are also available as on-screen buttons below the drum row.
        </p>
      </section>

      <section class="info-section info-section--mobile">
        <h3 class="info-section__title">Mobile App</h3>
        <p class="info-mobile__text">
          A dedicated mobile app is in the works. Stay tuned — coming soon.
        </p>
        <span class="info-mobile__badge">Coming soon</span>
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
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InfoView',
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

.info-mobile__text {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.5;
  font-size: 0.9375rem;
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
}
</style>
