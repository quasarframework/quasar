<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-badge color="secondary" multi-line class="q-mb-md">
      Model: {{ model || 'empty' }}
    </q-badge>

    <div class="q-gutter-md">
      <q-toggle v-model="optionsHtml" label="Options in HTML form" />

      <q-select filled v-model="model" :options="options" label="Standard" :options-html="optionsHtml" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(null),
      optionsHtml: ref(false),

      options: [
        {
          label: '<span class="text-primary text-bold text-underline">Goo</span>gle',
          value: 'Google'
        },
        {
          label: '<span class="text-primary">This is</span> in <span class="text-negative text-bold">HTML form</span> through an option prop',
          value: 'Facebook',
          html: true
        }
      ]
    }
  }
}
</script>
