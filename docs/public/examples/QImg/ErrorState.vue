<template>
  <div class="q-pa-md">
    <q-img
      src="https://cdn.quasar.dev/img/non-existent-image-src.png"
      style="height: 140px; max-width: 150px"
    >
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-negative text-white">
          Cannot load image
        </div>
      </template>
    </q-img>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const url = ref('https://cdn.quasar.dev/img/no-image-src.png')

    return {
      url,
      refresh () {
        url.value = 'https://cdn.quasar.dev/img/no-image-src.png?t=' + Math.random()
      }
    }
  }
}
</script>
