import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from './App.vue'
import './assets/main.css'
import './themes'

/**
 * Main application entry point.
 * Initializes Vue app with Pinia store and persistence plugin.
 * Sets up the drum pad application with all necessary configurations.
 */
const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState())
app.use(pinia)
app.mount('#app')

// Debug mode is available via Chrome DevTools console
// Open DevTools (F12) and type: __DRUMPAD_DEBUG__.help()
