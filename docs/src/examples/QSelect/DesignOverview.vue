<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select v-model="model" :options="options" label="Standard" />

      <q-select filled v-model="model" :options="options" label="Filled" />

      <q-select outlined v-model="model" :options="options" label="Outlined" />

      <q-select standout v-model="model" :options="options" label="Standout" />

      <q-select standout="bg-teal text-white" v-model="model" :options="options" label="Custom standout" />

      <q-select borderless v-model="model" :options="options" label="Borderless" />

      <q-select rounded filled v-model="model" :options="options" label="Rounded filled" />

      <q-select rounded outlined v-model="model" :options="options" label="Rounded outlined" />

      <q-select rounded standout v-model="model" :options="options" label="Rounded standout" />

      <q-select square filled v-model="model" :options="options" label="Square filled" />

      <q-select square outlined v-model="model" :options="options" label="Square outlined" />

      <q-select square standout v-model="model" :options="options" label="Square standout" />
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
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]
    }
  }
}
</script>
