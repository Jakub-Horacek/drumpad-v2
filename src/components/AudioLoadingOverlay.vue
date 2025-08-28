<template>
  <div v-if="isLoading" class="audio-loading-overlay">
    <div class="loading-content">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <h2 class="loading-title">Loading Audio Samples</h2>
      <p class="loading-description">Preparing your drum kit for zero-latency performance...</p>
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <span class="progress-text">{{ progress }}%</span>
      </div>
      <div class="loading-tips">
        <p class="tip">💡 Tip: All sounds are pre-cached for instant playback!</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AudioLoadingOverlay',
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
  },
})
</script>

<style scoped>
.audio-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.loading-content {
  text-align: center;
  color: white;
  max-width: 400px;
  padding: 2rem;
}

.loading-spinner {
  margin-bottom: 2rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-left: 4px solid var(--accent-color, #3b82f6);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
}

.loading-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.progress-container {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-color, #3b82f6), #60a5fa);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.loading-tips {
  margin-top: 1.5rem;
}

.tip {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .loading-content {
    padding: 1.5rem;
    max-width: 320px;
  }

  .loading-title {
    font-size: 1.25rem;
  }

  .loading-description {
    font-size: 0.9rem;
  }
}
</style>
