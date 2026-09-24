<template>
  <div class="q-pa-md">
    <q-btn
      color="primary"
      push
      label="Random height"
      @click="setRandomHeight"
    />

    <q-slider color="teal" v-model="boxWidth" :min="100" :max="300" label />

    <div
      ref="boxRef"
      :style="style"
      class="container bg-amber rounded-borders glossy q-my-md"
    />

    <div class="q-gutter-sm row items-center">
      <div>Measured:</div>
      <q-badge :label="`width: ${width}`" />
      <q-badge :label="`height: ${height}`" />
      <q-badge color="secondary" :label="`reports: ${reports}`" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, useTemplateRef } from 'vue'
import { useElementResize } from 'quasar'

const boxRef = useTemplateRef('boxRef')

const boxWidth = ref(200)
const boxHeight = ref(120)
const reports = ref(0)

const style = computed(() => ({
  width: boxWidth.value + 'px',
  height: boxHeight.value + 'px'
}))

const { width, height } = useElementResize({
  target: boxRef,
  onResize() {
    reports.value++
  }
})

function setRandomHeight() {
  boxHeight.value = Math.floor(80 + Math.random() * 120)
}
</script>

<style lang="sass" scoped>
.container
  transition: height .3s
</style>
