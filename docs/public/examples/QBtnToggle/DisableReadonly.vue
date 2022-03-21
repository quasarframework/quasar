<template>
  <div class="q-pa-md">
    <q-btn-toggle
      disable
      v-model="model"
      toggle-color="primary"
      push
      glossy
      :options="[
        {label: 'One', value: 'one'},
        {label: 'Two', value: 'two'},
        {label: 'Three', value: 'three'}
      ]"
    />

    <q-btn-toggle
      readonly
      v-model="model"
      toggle-color="primary"
      push
      glossy
      class="q-ml-md"
      :options="[
        {label: 'One', value: 'one'},
        {label: 'Two', value: 'two'},
        {label: 'Three', value: 'three'}
      ]"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref('two')
    }
  }
}
</script>
