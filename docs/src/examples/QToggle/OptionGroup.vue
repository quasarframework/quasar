<template>
  <div class="q-pa-md">
    <q-option-group
      :options="options"
      type="toggle"
      v-model="group"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      group: ref([]),

      options: [
        { label: 'Battery too low', value: 'bat' },
        { label: 'Friend request', value: 'friend', color: 'green' },
        { label: 'Picture uploaded', value: 'upload', color: 'red' }
      ]
    }
  }
}
</script>
