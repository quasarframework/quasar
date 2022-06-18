<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-select
        filled
        v-model="single"
        :options="options"
        label="Single"
        style="width: 250px"
      />

      <q-select
        filled
        v-model="multiple"
        multiple
        :options="options"
        label="Multiple"
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
      single: ref(null),
      multiple: ref(null),

      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]
    }
  }
}
</script>
