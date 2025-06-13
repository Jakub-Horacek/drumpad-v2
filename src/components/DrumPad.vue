<template>
  <div class="drumpad">
    <div class="drumpad-grid">
      <PadTile v-for="pad in 9" :key="pad" :pad="pad" :label="pad.toString()" />
    </div>
    <div class="drumpad-row">
      <PadTile v-for="pad in 2" :key="pad" :pad="pad" :label="pad.toString()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PadTile from './PadTile.vue'
</script>

<style scoped>
.drumpad {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: #000;
  padding: 10px;
  border-radius: 5px;
}

.drumpad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 5px;
  grid-row-gap: 5px;
}

.drumpad-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
}
</style>
