<template>
  <div class="q-pa-md row flex-center">
    <q-btn
      v-touch-repeat:0:1000.mouse.enter.space="decrement"
      color="primary"
      push
      round
      class="q-mr-sm"
      icon="remove"
    />

    <q-btn
      v-touch-repeat:0:100.mouse.enter.space="decrement"
      color="red"
      push
      round
      icon="remove"
    />

    <span class="q-mx-md">
      {{ number }}
    </span>

    <q-btn
      v-touch-repeat:0:100.mouse.enter.space="increment"
      color="red"
      push
      round
      class="q-mr-sm"
      icon="add"
    />

    <q-btn
      v-touch-repeat:0:1000.mouse.enter.space="increment"
      color="primary"
      push
      round
      icon="add"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const number = ref(110)

function increment() {
  number.value++
}

function decrement() {
  number.value--
}
</script>
