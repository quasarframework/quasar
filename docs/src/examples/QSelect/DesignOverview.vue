<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-select v-model="model" :options="options" label="Standard" />

      <q-select filled v-model="model" :options="options" label="Filled" />

      <q-select outlined v-model="model" :options="options" label="Outlined" />

      <q-select standout v-model="model" :options="options" label="Standout" />

      <q-select borderless v-model="model" :options="options" label="Borderless" />

      <q-select rounded filled v-model="model" :options="options" label="Rounded filled" />

      <q-select rounded outlined v-model="model" :options="options" label="Rounded outlined" />

      <q-select rounded standout v-model="model" :options="options" label="Rounded standout" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: null,
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]
    }
  }
}
</script>
