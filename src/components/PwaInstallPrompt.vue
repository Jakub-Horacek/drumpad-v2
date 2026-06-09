<template>
  <div v-if="installMode !== 'hidden'" class="pwa-install" :class="`pwa-install--${installMode}`">
    <template v-if="installMode === 'native'">
      <button type="button" class="pwa-install__action pwa-install__action--primary" @click="promptNativeInstall">
        Install app
      </button>
    </template>

    <template v-else-if="installMode === 'ios-guide'">
      <aside class="pwa-install__ios-guide" aria-label="Add to Home Screen steps">
        <ol class="pwa-install__ios-guide-steps">
          <li>
            <span class="pwa-install__ios-guide-step">
              Tap the
              <svg
                class="pwa-install__ios-share-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v10M8 7l4-4 4 4" />
                <rect x="5" y="11" width="14" height="10" rx="2" />
              </svg>
              Share button in Safari&apos;s toolbar at the bottom of the screen.
            </span>
          </li>
          <li>Scroll the sheet if needed, then tap <strong>Add to Home Screen</strong>.</li>
          <li>Tap <strong>Add</strong> in the top-right corner.</li>
        </ol>
        <p class="pwa-install__ios-guide-hint">
          <span class="pwa-install__ios-guide-arrow" aria-hidden="true">↓</span>
          Look for Share below this page
        </p>
      </aside>
    </template>

    <template v-else-if="installMode === 'ios-safari-warning'">
      <p class="pwa-install__message pwa-install__message--warning">
        To install on iPhone or iPad, open this page in <strong>Safari</strong> — other browsers on
        iOS cannot add apps to the home screen.
      </p>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { usePwaInstall } from '../composables/usePwaInstall'

export default defineComponent({
  name: 'PwaInstallPrompt',
  setup() {
    const { installMode, promptNativeInstall } = usePwaInstall()

    return {
      installMode,
      promptNativeInstall,
    }
  },
})
</script>

<style scoped>
.pwa-install {
  margin-top: 1rem;
}

.pwa-install__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
}

.pwa-install__action--primary {
  background: var(--accent-color);
  color: white;
  border: none;
}

.pwa-install__action--primary:hover {
  background: var(--accent-color-dark, #e67a2e);
  transform: translateY(-1px);
}

.pwa-install__action:active {
  transform: translateY(0);
}

.pwa-install__message--warning {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.pwa-install__ios-guide {
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--accent-color);
  background: color-mix(in srgb, var(--accent-color) 10%, var(--bg-tertiary));
}

.pwa-install__ios-guide-steps {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.pwa-install__ios-guide-steps li {
  margin-bottom: 0.625rem;
}

.pwa-install__ios-guide-steps li:last-child {
  margin-bottom: 0;
}

.pwa-install__ios-guide-step {
  display: inline;
}

.pwa-install__ios-share-icon {
  display: inline-block;
  width: 1.125rem;
  height: 1.125rem;
  margin: 0 0.125rem;
  vertical-align: -0.2rem;
  color: var(--accent-color);
}

.pwa-install__ios-guide-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin: 1rem 0 0;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--border-color);
  color: var(--accent-color);
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: center;
}

.pwa-install__ios-guide-arrow {
  font-size: 1.125rem;
  line-height: 1;
}
</style>
