<template>
  <div class="q-pa-md">
    <div class="row q-gutter-md q-mb-md">
      <q-btn
        :label="`Scroll to ${position}px`"
        color="primary"
        @click="scroll"
      />
      <q-btn
        :label="`Animate to ${position}px`"
        color="primary"
        @click="animateScroll"
      />
    </div>

    <q-scroll-area ref="scrollAreaRef" style="height: 150px; max-width: 300px">
      <ol>
        <li v-for="n in 1000" :key="n">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </li>
      </ol>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

const position = ref(300)
const scrollAreaRef = useTemplateRef('scrollAreaRef')

function scroll() {
  scrollAreaRef.value.setScrollPosition('vertical', position.value)
  position.value = Math.floor(Math.random() * 1001) * 20
}

function animateScroll() {
  scrollAreaRef.value.setScrollPosition('vertical', position.value, 300)
  position.value = Math.floor(Math.random() * 1001) * 20
}
</script>
