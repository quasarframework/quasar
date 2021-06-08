<template>
  <div class="q-pa-md bg-grey-10 text-white">
    <q-btn-toggle
      v-model="model"
      push
      glossy
      toggle-color="primary"
      :options="[
        {label: 'Cake', value: 'cake'},
        {label: 'Ice cream', value: 'ice-cream'}
      ]"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref('cake')
    }
  }
}
</script>
