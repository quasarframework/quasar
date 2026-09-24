<template>
  <div class="q-pa-md">
    <q-btn
      color="primary"
      push
      @click="setRandomSize"
      label="Set Random Size"
    />

    <div
      v-resize="onResize"
      :style="style"
      class="container bg-amber rounded-borders glossy q-my-md"
    />

    <div v-if="report" class="q-gutter-sm row items-center">
      <div>Reported:</div>
      <q-badge :label="`width: ${report.width}`" />
      <q-badge :label="`height: ${report.height}`" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const style = ref({ width: '200px', height: '200px' })
const report = ref(null)

function onResize(size) {
  report.value = size
  // {
  //   width: 20 // width of container (in px)
  //   height: 50 // height of container (in px)
  // }
}

function setRandomSize() {
  style.value = {
    width: Math.floor(100 + Math.random() * 200) + 'px',
    height: Math.floor(100 + Math.random() * 200) + 'px'
  }
}
</script>

<style lang="sass" scoped>
.container
  transition: width .3s, height .3s
</style>
