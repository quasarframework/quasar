<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row no-wrap items-center q-gutter-md">
      <q-btn
        color="primary"
        push
        @click="setRandomSize"
        label="Set Random Size"
      />
      <q-toggle v-model="enabled" label="Observe" dense />
    </div>

    <div
      v-resize="enabled ? onResize : false"
      :style="style"
      class="container bg-amber rounded-borders glossy"
    />

    <div v-if="report" class="q-gutter-sm">
      Reported:
      <q-badge>width: {{ report.width }}</q-badge>
      <q-badge>height: {{ report.height }}</q-badge>
      <q-badge color="secondary">reports: {{ count }}</q-badge>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const enabled = ref(true)
const style = ref({ width: '200px', height: '200px' })
const report = ref(null)
const count = ref(0)

function onResize(size) {
  report.value = size
  count.value++
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
