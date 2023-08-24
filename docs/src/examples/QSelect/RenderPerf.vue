<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select
        filled
        v-model="model"
        multiple
        :options="options"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

const options = []
for (let i = 0; i <= 100000; i++) {
  options.push('Opt ' + i)
}

export default {
  setup () {
    return {
      model: ref(null),
      options
    }
  }
}
</script>
