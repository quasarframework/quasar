<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-badge color="secondary" multi-line class="q-mb-md">
      Model: {{ model || 'empty' }}
    </q-badge>

    <div class="q-gutter-md">
      <q-toggle v-model="optionsSanitize" label="Sanitize options" />

      <q-select filled v-model="model" :options="options" label="Standard" options-html />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(null),

      options: [
        {
          label: '<span class="text-primary">G</span>oogle',
          value: 'Google'
        },
        {
          label: '<span class="text-primary">This is</span> sanitized through option',
          value: 'Facebook',
          html: true
        }
      ]
    }
  }
}
</script>
