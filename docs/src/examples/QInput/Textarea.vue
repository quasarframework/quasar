<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input
      v-model="text"
      filled
      type="textarea"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      text: ref('')
    }
  }
}
</script>
