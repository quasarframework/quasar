<template>
  <div class="q-layout-padding">
    <div>Click "Start" then use QInput</div>
    <div>{{ i }}</div>
    <div class="q-gutter-md">
      <q-btn label="start" @click="start" />
      <q-btn label="stop" @click="stop" />
    </div>
    <q-input filled v-model="text" debounce="300" label="Label" />

    <div class="q-mt-xl">
      {{ text }}
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'

const text = ref('')
const i = ref(0)

let timer

function start() {
  stop()
  timer = setInterval(() => {
    i.value++
  }, 100)
}

function stop() {
  clearInterval(timer)
}

onBeforeUnmount(() => {
  stop()
})
</script>
