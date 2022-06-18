<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <div style="min-width: 250px; max-width: 300px">
        <q-badge color="secondary" class="q-mb-md">
          Model: {{ modelSingle || '*none*' }}
        </q-badge>

        <q-select
          filled
          v-model="modelSingle"
          :options="options"
          use-chips
          stack-label
          label="Single selection"
        />
      </div>

      <div style="min-width: 250px; max-width: 300px">
        <q-badge color="secondary" class="q-mb-md">
          Model: {{ modelMultiple || '[]' }}
        </q-badge>

        <q-select
          filled
          v-model="modelMultiple"
          multiple
          :options="options"
          use-chips
          stack-label
          label="Multiple selection"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      modelSingle: ref('Apple'),
      modelMultiple: ref(['Facebook']),

      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]
    }
  }
}
</script>
