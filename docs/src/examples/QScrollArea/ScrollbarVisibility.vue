<template>
  <div class="q-ma-md">
    <div>
      <q-toggle v-model="visible" label="Show scrollbar" />
    </div>

    <q-scroll-area
      :visible="visible"
      style="height: 200px; max-width: 300px;"
    >
      <div v-for="n in 100" :key="n" class="q-py-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      visible: ref(true)
    }
  }
}
</script>
