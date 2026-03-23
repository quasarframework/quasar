<template>
  <div class="q-pa-lg">
    <!-- as string -->
    <q-option-group
      v-model="modelOne"
      :options="options"
      color="primary"
      option-value="key"
      option-label="title"
      option-disable="inactive"
    />

    <!-- or as function -->
    <q-option-group
      class="q-mt-lg"
      v-model="modelTwo"
      :options="options"
      color="primary"
      :option-value="optValueFn"
      :option-label="optLabelFn"
      :option-disable="optDisableFn"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    return {
      modelOne: ref('op1'),
      modelTwo: ref('op1'),

      options: [
        {
          title: 'Option 1',
          key: 'op1',
          inactive: false
        },
        {
          title: 'Option 2 (disabled)',
          key: 'op2',
          inactive: true
        },
        {
          title: 'Option 3',
          key: 'op3',
          inactive: false
        }
      ],

      optValueFn: item => item.key,
      optLabelFn: item => item.title,
      optDisableFn: item => item.inactive
    }
  }
}
</script>
