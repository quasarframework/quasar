<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-select
        filled
        v-model="model"
        multiple
        :options="options"
        counter
        hint="With counter"
        style="width: 250px"
      />

      <q-select
        filled
        v-model="model2"
        multiple
        :options="options"
        counter
        max-values="2"
        hint="Max 2 selections"
        style="width: 250px"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(null),
      model2: ref(null),

      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]
    }
  }
}
</script>
