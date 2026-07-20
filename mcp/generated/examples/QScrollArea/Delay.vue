<template>
  <div class="q-pa-md">
    <q-btn-group class="q-mb-md">
      <q-btn color="primary" @click="less">Less</q-btn>
      <q-btn color="secondary" @click="more">More</q-btn>
    </q-btn-group>

    <q-scroll-area :delay="1200" style="height: 200px; max-width: 300px">
      <div v-for="n in number" :key="n">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const number = ref(4)

function less() {
  if (number.value > 1) {
    number.value--
  }
}

function more() {
  number.value++
}
</script>
