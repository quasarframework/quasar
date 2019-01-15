<template>
  <div class="q-pa-md q-gutter-sm">
    <q-select
        :options="options"
        emit-values
        filled
        label="Save only values to v-model, instead of whole option object."
        multiple
        v-model="selected"
    />

    <q-select
        :options="options"
        emit-values
        filled
        label="Allow user input"
        multiple
        use-chips
        use-input
        v-model="selected"
    />

    <q-select
        :input-debounce="1000"
        :options="options"
        emit-values
        filled
        label="Debounced input"
        multiple
        use-chips
        v-model="selected"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected: [
        'goog'
      ],
      options: [
        {
          label: 'Google',
          value: 'goog'
        },
        {
          label: 'Facebook',
          value: 'fb'
        },
        {
          label: 'Twitter',
          value: 'twtr'
        },
        {
          label: 'Apple Inc.',
          value: 'appl'
        },
        {
          label: 'Oracle',
          value: 'ora'
        }
      ]
    }
  }
}
</script>
