<template>
  <button class="pad-tile" @click="onClick">
    {{ label }}
  </button>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'PadTile',
  props: {
    label: {
      type: String,
      required: true,
    },
    onClick: {
      type: Function as PropType<() => void>,
      required: false,
    },
  },
})
</script>
<style scoped>
.pad-tile {
  width: 100%;
  height: 100%;
  background-color: #afafaf;
  border-radius: 5px;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-align: center;
}
</style>
