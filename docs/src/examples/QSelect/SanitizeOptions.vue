<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <div>Model: {{ model || 'empty' }}</div>

      <q-toggle v-model="optionsSanitize" label="Sanitize options" />

      <q-select filled v-model="model" :options="options" label="Standard" :options-sanitize="optionsSanitize" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: null,
      optionsSanitize: false,
      options: [
        {
          label: '<span class="text-primary">G</span>oogle',
          value: 'Google'
        },
        {
          label: '<span class="text-primary">This is</span> sanitized through option',
          value: 'Facebook',
          sanitize: true
        }
      ]
    }
  }
}
</script>
