import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from './App.vue'
import './assets/main.css'
import './themes'

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState())
app.use(pinia)
app.mount('#app')

// Debug mode is available via Chrome DevTools console
// Open DevTools (F12) and type: __DRUMPAD_DEBUG__.help()
