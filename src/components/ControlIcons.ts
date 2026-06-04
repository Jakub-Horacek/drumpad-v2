import { defineComponent, h } from 'vue'

export const StopIcon = defineComponent({
  name: 'StopIcon',
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M6 6h12v12H6z' }),
    ])
  },
})

export const PlayAllIcon = defineComponent({
  name: 'PlayAllIcon',
  render() {
    return h('svg', { width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M8 5v14l11-7z' }),
      h('path', { d: 'M2 5v14l11-7z', opacity: '0.5' }),
    ])
  },
})
