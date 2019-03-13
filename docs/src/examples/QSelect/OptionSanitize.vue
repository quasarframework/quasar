<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary">Model: "{{ model }}"</q-badge>

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
          value: 'Google',
          description: 'Search engine',
          icon: 'mail'
        },
        {
          label: '<span class="text-primary">F</span>acebook',
          value: 'Facebook',
          description: 'Social media - will be sanitized',
          icon: 'bluetooth',
          sanitize: true
        }
      ]
    }
  }
}
</script>
