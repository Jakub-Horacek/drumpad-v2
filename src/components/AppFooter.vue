<template>
  <footer class="app-footer">
    <p>Created by <a href="https://callmehillman.com" target="_blank">Jakub Horáček</a></p>
    <p>Sounds by <a href="https://www.instagram.com/kalacsound/" target="_blank">KalacSound</a></p>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppFooter',
})
</script>

<style scoped>
/* Footer */
.app-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.app-footer a {
  color: var(--accent-color);
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}
</style>
