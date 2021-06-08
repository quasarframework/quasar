<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-badge color="secondary" multi-line class="q-mb-md">
      Model: {{ model || 'empty' }}
    </q-badge>

    <div class="q-gutter-md">
      <q-toggle v-model="displayHtml" label="Display value in HTML form" />

      <q-select
        filled
        v-model="model"
        :options="options"
        stack-label
        label="Standard"
        :display-value="`Company: ${model ? model.label : '*none*'}`"
        :display-value-html="displayHtml"
      >
        <template v-slot:append>
          <q-icon
            v-if="model !== null"
            class="cursor-pointer"
            name="clear"
            @click.stop="model = null"
          />
        </template>
      </q-select>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

const options = [
  {
    label: '<span class="text-primary">G</span>oogle',
    value: 'Google'
  },
  {
    label: '<span class="text-red">Face</span>book',
    value: 'Facebook'
  }
]

export default {
  setup () {
    return {
      model: ref(options[ 0 ]),
      displayHtml: ref(false),
      options
    }
  }
}
</script>
