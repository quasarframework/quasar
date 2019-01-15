<template>
  <div class="q-pa-md q-gutter-sm">
    <q-select
        :options="options"
        filled
        multiple
        v-model="selected"
    />
    <q-select
        :display-value="`Selected ${selected.length} items`"
        :options="options"
        expand-besides
        filled
        label="Custom display value"
        multiple
        stack-label
        v-model="selected"
    />
    <q-select
        :options="options"
        expand-besides
        filled
        label="Use chips"
        multiple
        use-chips
        v-model="selected"
    />

    <q-select
        :max-values="2"
        :options="options"
        expand-besides
        filled
        label="Maximum 2 values can be selected"
        multiple
        v-model="maxTwoValues"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected: [
        {
          label: 'Google',
          value: 'goog'
        }
      ],
      maxTwoValues: [
        {
          label: 'Google',
          value: 'goog'
        }
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
